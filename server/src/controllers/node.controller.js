/**
 * @fileoverview Controller layer for handling node-related HTTP requests
 */
const NodeService = require('../services/node.service');

class NodeController {
  constructor(dbConfig) {
    this.nodeService = new NodeService(dbConfig);
  }

  /**
   * Get node status statistics
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   */
  async getNodeStatus(req, res) {
    try {
      const stats = await this.nodeService.getNodeStatusStats();
      res.json(stats);
    } catch (error) {
      this.handleError(res, 'Error fetching status', error);
    }
  }

  /**
   * Get nodes list
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   */
  async getNodes(req, res) {
    try {
      const nodes = await this.nodeService.getNodesInfo();
      res.json(nodes);
    } catch (error) {
      this.handleError(res, 'Error fetching nodes', error);
    }
  }

  /**
   * Get configuration
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   */
  async getConfiguration(req, res) {
    try {
      const config = await this.nodeService.getConfiguration();
      res.json(config);
    } catch (error) {
      this.handleError(res, 'Error fetching configuration', error);
    }
  }

  /**
   * Handle API errors
   * @private
   * @param {import('express').Response} res - Express response object
   * @param {string} message - Error message
   * @param {Error} error - Error object
   */
  handleError(res, message, error) {
    console.error(`${message}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = NodeController;