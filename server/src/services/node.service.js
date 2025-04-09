/**
 * @fileoverview Service layer for node-related business logic
 */
const DatabaseRepository = require('../repositories/database.repository');

/**
 * Service class for handling node-related operations
 */
class NodeService {
  /**
   * Creates an instance of NodeService
   * @param {Object} dbConfig - Database configuration object
   */
  constructor(dbConfig) {
    this.dbRepo = new DatabaseRepository(dbConfig);
  }

  /**
   * Get system configuration
   * @returns {Promise<Object>} System configuration
   */
  async getConfiguration() {
    const [nodeGroups, channels, triggers] = await Promise.all([
      this.dbRepo.getNodeGroups(),
      this.dbRepo.getChannels(),
      this.dbRepo.getTriggers()
    ]);

    return { nodeGroups, channels, triggers };
  }
}

module.exports = NodeService;