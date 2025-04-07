/**
 * @module BatchController
 * @description Controller for handling batch-related HTTP requests
 * @author Yuri V
 */
const BatchService = require('../services/batch.service');
const logger = require('../logger');

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
   * Handles requests to get batch status information
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.query - Query parameters
   * @param {string} [req.query.incomingStatus] - Filter for incoming batch status
   * @param {string} [req.query.outgoingStatus] - Filter for outgoing batch status
   * @param {Object} res - Express response object
   * @returns {Promise<void>} Sends JSON response with batch status data
   */
  async getBatchStatus(req, res) {
    try {
      const { incomingStatus, outgoingStatus } = req.query;

      const batchStatus = await this.batchService.getBatchStatus({
        incomingStatus,
        outgoingStatus
      });

      res.json(batchStatus);
    } catch (error) {
      logger.error(`Error fetching batch status: ${error.message}`, { 
        stack: error.stack,
        query: req.query 
      });

      res.status(500).json({ 
        error: 'Failed to fetch batch status',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = BatchController;