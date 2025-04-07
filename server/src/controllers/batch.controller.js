/**
 * @module BatchController
 * @description Controller for handling batch-related HTTP requests
 * @author Yuri V
 */
const BatchService = require('../services/batch.service');
const logger = require('../logger');

/**
 * Valid batch directions
 * @constant {string[]}
 * @private
 */
const VALID_DIRECTIONS = ['incoming', 'outgoing'];

/**
 * Controller class for batch-related endpoints
 * @class BatchController
 */
class BatchController {
  /**
   * Creates an instance of BatchController
   * @param {Object} config - Database configuration object
   * @throws {Error} If database configuration is not provided
   */
  constructor(config) {
    if (!config) {
      throw new Error('Database configuration is required');
    }
    this.batchService = new BatchService(config);
  }

  /**
   * Handles requests to get unique channel IDs from both incoming and outgoing batches
   * @async
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>} Sends JSON response with unique channel IDs
   */
  async getUniqueChannels(req, res) {
    try {
      const channels = await this.batchService.getUniqueChannels();
      res.json(channels);
    } catch (error) {
      this.handleError(error, res, 'Failed to fetch unique channels');
    }
  }

  /**
   * Handles requests to get batch status information
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.query - Query parameters
   * @param {string} [req.query.incomingStatus] - Filter for incoming batch status
   * @param {string} [req.query.outgoingStatus] - Filter for outgoing batch status
   * @param {string} [req.query.channel] - Filter batches by channel ID
   * @param {Object} res - Express response object
   * @returns {Promise<void>} Sends JSON response with batch status data
   */
  async getBatchStatus(req, res) {
    try {
      const { incomingStatus, outgoingStatus, channel } = req.query;

      const batchStatus = await this.batchService.getBatchStatus({
        incomingStatus,
        outgoingStatus,
        channel
      });

      res.json(batchStatus);
    } catch (error) {
      this.handleError(error, res, 'Failed to fetch batch status', { query: req.query });
    }
  }

  /**
   * Handles requests to get detailed information for a specific batch
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - URL parameters
   * @param {string} req.params.batchId - The ID of the batch to fetch
   * @param {Object} req.query - Query parameters
   * @param {string} [req.query.direction] - The direction of the batch ('incoming' or 'outgoing')
   * @param {Object} res - Express response object
   * @returns {Promise<void>} Sends JSON response with detailed batch data
   */
  async getBatchDetails(req, res) {
    try {
      const { batchId } = req.params;
      const { direction = 'outgoing' } = req.query;

      // Validate input parameters
      const validationError = this.validateBatchParams(batchId, direction);
      if (validationError) {
        return res.status(400).json(validationError);
      }

      const batchDetails = await this.batchService.getBatchDetails(batchId, direction);

      if (!batchDetails) {
        return res.status(404).json({ 
          error: 'Batch not found',
          message: `No ${direction} batch found with ID ${batchId}`
        });
      }

      res.json(batchDetails);
    } catch (error) {
      this.handleError(error, res, 'Failed to fetch batch details', { params: req.params });
    }
  }

  /**
   * Handles requests to get sym_data entries associated with a specific batch
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - URL parameters
   * @param {string} req.params.batchId - The ID of the batch to fetch data for
   * @param {Object} req.query - Query parameters
   * @param {string} [req.query.direction] - The direction of the batch ('incoming' or 'outgoing'), defaults to 'outgoing'
   * @param {Object} res - Express response object
   * @returns {Promise<void>} Sends JSON response with sym_data entries associated with the batch
   */
  async getBatchData(req, res) {
    try {
      const { batchId } = req.params;
      const { direction = 'outgoing' } = req.query;
      const normalizedDirection = direction.toLowerCase();

      // Validate input parameters
      const validationError = this.validateBatchParams(batchId, normalizedDirection);
      if (validationError) {
        return res.status(400).json(validationError);
      }

      const batchData = await this.batchService.getBatchData(batchId, normalizedDirection);

      if (!batchData || batchData.length === 0) {
        return res.json([]); // Return empty array if no data found
      }

      res.json(batchData);
    } catch (error) {
      this.handleError(error, res, 'Failed to fetch batch data', {
        params: req.params,
        query: req.query
      });
    }
  }

  /**
   * Validates batch ID and direction parameters
   * @private
   * @param {string|number} batchId - The batch ID to validate
   * @param {string} direction - The direction to validate
   * @returns {Object|null} Error object if validation fails, null otherwise
   */
  validateBatchParams(batchId, direction) {
    // Validate direction parameter
    if (!direction || !VALID_DIRECTIONS.includes(direction.toLowerCase())) {
      return { 
        error: 'Invalid direction parameter',
        message: `Direction must be either "${VALID_DIRECTIONS.join('" or "')}"` 
      };
    }

    // Validate batchId parameter
    if (!batchId || isNaN(parseInt(batchId, 10))) {
      return { 
        error: 'Invalid batch ID',
        message: 'Batch ID must be a valid number'
      };
    }

    return null;
  }

  /**
   * Handles errors in a consistent way across controller methods
   * @private
   * @param {Error} error - The error that occurred
   * @param {Object} res - Express response object
   * @param {string} defaultMessage - Default error message to return
   * @param {Object} [logContext={}] - Additional context for logging
   */
  handleError(error, res, defaultMessage, logContext = {}) {
    logger.error(`${defaultMessage}: ${error.message}`, { 
      stack: error.stack,
      ...logContext
    });

    res.status(500).json({ 
      error: defaultMessage,
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

module.exports = BatchController;