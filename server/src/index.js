/**
 * @fileoverview Express server for SymmetricDS dashboard API
 * @author Yuri V
 */
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const NodeController = require('./controllers/node.controller');
const BatchController = require('./controllers/batch.controller');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'symmetric'
};

const nodeController = new NodeController(dbConfig);
const batchController = new BatchController(dbConfig);

/**
 * Health check endpoint
 * @route GET /health
 * @returns {object} Status object
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

/**
 * Get node status statistics
 * @route GET /api/engine/status
 * @returns {object} Node status and sync statistics
 */
app.get('/api/node/status', nodeController.getNodeStatus.bind(nodeController));

/**
 * Get nodes list
 * @route GET /api/node/nodes
 * @returns {object[]} List of formatted nodes
 */
app.get('/api/node/nodes', nodeController.getNodes.bind(nodeController));

/**
 * Get configuration
 * @route GET /api/node/config
 * @returns {object} Configuration object containing node groups, channels, and triggers
 */
app.get('/api/engine/config', nodeController.getConfiguration.bind(nodeController));

/**
 * @route GET /api/batch/status
 * @description Get the status of incoming and outgoing batches
 */
app.get('/api/batch/status', (req, res) => batchController.getBatchStatus(req, res));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});