/**
 * @module NodeConfigService
 * @description Service for handling node configuration operations
 * @author Yuri V
 */
const logger = require('../logger');

class NodeConfigService {
  /**
   * Creates an instance of NodeConfigService
   * @param {Object} database - Database repository instance
   */
  constructor(database) {
    if (!database) {
      throw new Error('Database instance is required');
    }
    this.database = database;
  }

  /**
   * Get system configuration
   * @returns {Promise<Object>} System configuration
   */
  async getConfiguration() {
    try {
      logger.debug('Fetching system configuration');
      
      const [nodeGroups, channels, triggers] = await Promise.all([
        this.database.getNodeGroups(),
        this.database.getChannels(),
        this.database.getTriggers()
      ]);

      const config = { nodeGroups, channels, triggers };
      
      logger.debug('System configuration retrieved successfully');
      return config;
    } catch (error) {
      logger.error('Error fetching system configuration', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
}

module.exports = NodeConfigService;