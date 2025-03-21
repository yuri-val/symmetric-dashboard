const BatchService = require('../services/batch.service');
const logger = require('../logger');

class BatchController {
  constructor(config) {
    this.batchService = new BatchService(config);
  }

  async getBatchStatus(req, res) {
    try {
      const batchStatus = await this.batchService.getBatchStatus();
      res.json(batchStatus);
    } catch (error) {
      logger.log(`Error fetching batch status: ${error.message}`);
      res.status(500).json({ error: 'Failed to fetch batch status' });
    }
  }
}

module.exports = BatchController;