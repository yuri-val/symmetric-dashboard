/**
 * @module NodeInfoService
 * @description Service for handling detailed node information operations
 * @author Yuri V
 */
const logger = require('../logger');

/** Time threshold to consider a node offline (30 minutes in milliseconds) */
const DEAD_NODE_THRESHOLD = 30 * 60 * 1000;

class NodeInfoService {
  /**
   * Creates an instance of NodeInfoService
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
      
      const nodes = await this.database.getNodes();
      const formattedNodes = this.formatNodes(nodes);
      
      const stats = {
        total: formattedNodes.length,
        online: formattedNodes.filter(node => node.status === 'ONLINE').length,
        offline: formattedNodes.filter(node => node.status === 'OFFLINE').length
      };
      
      logger.debug('Node status statistics retrieved successfully', stats);
      return stats;
    } catch (error) {
      logger.error('Error fetching node status statistics', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  /**
   * Get detailed node information
   * @returns {Promise<Object[]>} Formatted node information
   */
  async getNodesInfo() {
    try {
      logger.debug('Fetching detailed node information');
      
      const nodes = await this.database.getNodes();
      const formattedNodes = this.formatNodes(nodes);
      
      logger.debug('Node information retrieved successfully', { count: nodes.length });
      return formattedNodes;
    } catch (error) {
      logger.error('Error fetching node information', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  /**
   * Format nodes data
   * @private
   * @param {Object[]} nodes - List of nodes
   * @returns {Object[]} Formatted nodes
   */
  /**
   * Extract vessel name from node group description
   * @private
   * @param {string} nodeGroupId - Node group ID
   * @param {string} description - Node group description
   * @returns {string|null} Vessel name or null if not found
   */
  extractVesselName(nodeGroupId, description) {
    if (!nodeGroupId?.startsWith('vessel_') || !description) return null;
    const match = description.match(/Node Group for ([^\d]+).*vessel/);
    const name =  match ? match[1].trim() : null;
    return name.toString().toUpperCase().replace(/_/g, ' ');
  }

  /**
   * Format nodes data
   * @private
   * @param {Object[]} nodes - List of nodes
   * @returns {Object[]} Formatted nodes
   */
  formatNodes(nodes) {
    const now = Date.now();
    return nodes.map(node => ({
      nodeId: node.node_id,
      nodeGroupId: node.node_group_id,
      externalId: node.external_id,
      syncUrl: node.sync_url,
      status: this.getNodeStatus(node.heartbeat_time, now),
      lastHeartbeat: node.heartbeat_time,
      hostName: node.host_name,
      ipAddress: node.ip_address,
      osInfo: node.os_name ? `${node.os_name} ${node.os_version}` : null,
      processors: node.available_processors,
      memoryUsage: this.getMemoryUsage(node),
      version: node.symmetric_version,
      batchInErrorCount: parseInt(node.batch_in_error_count, 10),
      batchToSendCount: parseInt(node.batch_to_send_count, 10),
      vesselName: this.extractVesselName(node.node_group_id, node.node_group_description)
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

  /**
   * Get memory usage information
   * @private
   * @param {Object} node - Node object
   * @returns {Object|null} Memory usage object or null if not available
   */
  getMemoryUsage(node) {
    if (!node.total_memory_bytes) return null;
    return {
      free: node.free_memory_bytes,
      total: node.total_memory_bytes,
      used: node.total_memory_bytes - node.free_memory_bytes
    };
  }
}

module.exports = NodeInfoService;