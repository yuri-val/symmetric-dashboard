/**
 * @module NodeStatusService
 * @description Service for handling node status and statistics operations
 * @author Yuri V
 */
const logger = require('../logger');

/** Time threshold to consider a node offline (30 minutes in milliseconds) */
const DEAD_NODE_THRESHOLD = 30 * 60 * 1000;

class NodeStatusService {
  /**
   * Creates an instance of NodeStatusService
   * @param {Object} database - Database repository instance
   */
  constructor(database) {
    if (!database) {
      throw new Error('Database instance is required');
    }
    this.database = database;
  }

  /**
   * Get node status statistics
   * @returns {Promise<Object>} Node status statistics
   */
  async getNodeStatusStats() {
    try {
      logger.debug('Fetching node status statistics');
      
      const [nodes, syncStats] = await Promise.all([
        this.database.getNodeStatus(),
        this.database.getSyncBatchStats()
      ]);

      const result = {
        nodeStatus: this.calculateNodeStatus(nodes),
        syncStats: this.formatSyncStats(syncStats)
      };

      logger.debug('Node status statistics retrieved successfully');
      return result;
    } catch (error) {
      logger.error('Error fetching node status statistics', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  /**
   * Calculate node status
   * @private
   * @param {Object[]} nodes - List of nodes
   * @returns {Object[]} Node status counts
   */
  calculateNodeStatus(nodes) {
    const now = Date.now();
    const statusCounts = nodes.reduce((acc, node) => {
      const heartbeatTime = node.heartbeat_time ? new Date(node.heartbeat_time).getTime() : null;
      const status = !heartbeatTime || (now - heartbeatTime > DEAD_NODE_THRESHOLD) ? 'OFFLINE' : 'ONLINE';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCounts).map(([status, count]) => ({ status, count }));
  }

  /**
   * Format sync stats data
   * @private
   * @param {Object[]} syncStats - List of sync stats
   * @returns {Object[]} Formatted sync stats
   */
  formatSyncStats(syncStats) {
    return syncStats.map(batch => ({
      name: batch.status,
      value: parseInt(batch.count, 10)
    }));
  }

  /**
   * Get node status based on heartbeat time
   * @private
   * @param {string} heartbeatTime - Node's last heartbeat time
   * @param {number} now - Current timestamp
   * @returns {string} Node status
   */
  getNodeStatus(heartbeatTime, now) {
    if (!heartbeatTime) return 'OFFLINE';
    return (now - new Date(heartbeatTime).getTime() > DEAD_NODE_THRESHOLD) ? 'OFFLINE' : 'ONLINE';
  }
}

module.exports = NodeStatusService;