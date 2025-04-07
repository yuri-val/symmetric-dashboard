/**
 * @fileoverview Express server for SymmetricDS dashboard API
 * @module server
 * @requires express
 * @requires cors
 * @requires dotenv
 * @requires ./controllers/node.controller
 * @requires ./controllers/batch.controller
 * @author Yuri V
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const NodeController = require('./controllers/node.controller');
const BatchController = require('./controllers/batch.controller');
const logger = require('./logger');

// Load environment variables
dotenv.config();

// Set default NODE_ENV if not set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

// Log startup mode
logger.log(`Server starting in ${process.env.NODE_ENV.toUpperCase()} mode`);

/**
 * Initialize Express application
 * @type {express.Application}
 */
const app = express();

// Apply middleware
app.use(cors());
app.use(express.json());

/**
 * Database configuration object
 * @type {Object}
 */
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'symmetric'
};

// Initialize controllers
const nodeController = new NodeController(dbConfig);
const batchController = new BatchController(dbConfig);

/**
 * Global error handler for route handlers
 * @param {Function} handler - Route handler function
 * @returns {Function} Express middleware function with error handling
 */
const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next))
    .catch((error) => {
      logger.error(`Unhandled error in route handler: ${error.message}`, {
        stack: error.stack,
        path: req.path,
        method: req.method
      });
      res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    });
};

// Health check endpoint
/**
 * Health check endpoint
 * @name GET/health
 * @function
 * @memberof module:server
 * @returns {Object} Status object indicating API health
 */
app.get('/health', asyncHandler((req, res) => {
  res.json({ status: 'ok' });
}));

// Node-related routes
/**
 * Get node status statistics
 * @name GET/api/node/status
 * @function
 * @memberof module:server
 * @returns {Object} Node status and sync statistics
 */
app.get('/api/node/status', asyncHandler((req, res) => 
  nodeController.getNodeStatus(req, res)
));

/**
 * Get nodes list
 * @name GET/api/node/nodes
 * @function
 * @memberof module:server
 * @returns {Array<Object>} List of formatted nodes
 */
app.get('/api/node/nodes', asyncHandler((req, res) => 
  nodeController.getNodes(req, res)
));

/**
 * Get configuration
 * @name GET/api/engine/config
 * @function
 * @memberof module:server
 * @returns {Object} Configuration object containing node groups, channels, and triggers
 */
app.get('/api/engine/config', asyncHandler((req, res) => 
  nodeController.getConfiguration(req, res)
));

// Batch-related routes
/**
 * Get unique channel IDs from both incoming and outgoing batches
 * @name GET/api/batch/channels
 * @function
 * @memberof module:server
 * @returns {Array} List of unique channel IDs
 */
app.get('/api/batch/channels', asyncHandler((req, res) => 
  batchController.getUniqueChannels(req, res)
));

/**
 * Get the status of incoming and outgoing batches
 * @name GET/api/batch/status
 * @function
 * @memberof module:server
 * @returns {Object} Status information for incoming and outgoing batches
 */
app.get('/api/batch/status', asyncHandler((req, res) => 
  batchController.getBatchStatus(req, res)
));

/**
 * Get sym_data entries associated with a specific batch
 * @name GET/api/batch/:batchId/data
 * @function
 * @memberof module:server
 * @param {string} req.params.batchId - The ID of the batch to fetch data for
 * @param {string} [req.query.direction='outgoing'] - The direction of the batch ('incoming' or 'outgoing')
 * @returns {Array<Object>} Data entries associated with the specified batch
 */
app.get('/api/batch/:batchId/data', asyncHandler((req, res) => 
  batchController.getBatchData(req, res)
));

/**
 * Get detailed information for a specific batch
 * @name GET/api/batch/:direction/:batchId
 * @function
 * @memberof module:server
 * @param {string} req.params.direction - The direction of the batch ('incoming' or 'outgoing')
 * @param {string} req.params.batchId - The ID of the batch to fetch
 * @returns {Object} Detailed information about the specified batch
 */
app.get('/api/batch/:direction/:batchId', asyncHandler((req, res) => 
  batchController.getBatchDetails(req, res)
));

/**
 * Start the Express server
 * @name server
 * @function
 * @memberof module:server
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

/**
 * Handle uncaught exceptions
 */
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`, { stack: error.stack });
  process.exit(1);
});

/**
 * Handle unhandled promise rejections
 */
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { 
    promise, 
    reason: reason instanceof Error ? reason.message : reason,
    stack: reason instanceof Error ? reason.stack : undefined
  });
});