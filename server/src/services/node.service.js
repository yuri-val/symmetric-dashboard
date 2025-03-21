/**
 * @fileoverview Service layer for node-related business logic
 */
const DatabaseRepository = require('../repositories/database.repository');

/** Time threshold to consider a node offline (30 minutes in milliseconds) */
const DEAD_NODE_THRESHOLD = 30 * 60 * 1000;

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
   * Get node status statistics
   * @returns {Promise<Object>} Node status statistics
   */
  async getNodeStatusStats() {
    const [nodes, syncStats] = await Promise.all([
      this.dbRepo.getNodeStatus(),
      this.dbRepo.getSyncBatchStats()
    ]);

    return {
      nodeStatus: this.calculateNodeStatus(nodes),
      syncStats: this.formatSyncStats(syncStats)
    };
  }

  /**
   * Get detailed node information
   * @returns {Promise<Object[]>} Formatted node information
   */
  async getNodesInfo() {
    const nodes = await this.dbRepo.getNodes();
    return this.formatNodes(nodes);
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
      const status = !heartbeatTime || (now - heartbeatTime > DEAD_NODE_THRESHOLD) ? 'Offline' : 'Online';
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
      batchToSendCount: parseInt(node.batch_to_send_count, 10)
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

module.exports = NodeService;