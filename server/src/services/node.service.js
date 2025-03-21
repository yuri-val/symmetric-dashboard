/**
 * @fileoverview Service layer for node-related business logic
 */
const DatabaseRepository = require('../repositories/database.repository');

class NodeService {
  constructor(dbConfig) {
    this.dbRepo = new DatabaseRepository(dbConfig);
  }

  /**
   * Get node status statistics
   * @returns {Promise<object>} Node status statistics
   */
  async getNodeStatusStats() {
    const nodes = await this.dbRepo.getNodeStatus();
    const nodeStatus = this.calculateNodeStatus(nodes);
    const syncStats = await this.dbRepo.getSyncBatchStats();

    return {
      nodeStatus: Object.entries(nodeStatus).map(([status, count]) => ({ status, count })),
      syncStats: syncStats.map(batch => ({
        name: batch.status,
        value: parseInt(batch.count)
      }))
    };
  }

  /**
   * Get detailed node information
   * @returns {Promise<object[]>} Formatted node information
   */
  async getNodesInfo() {
    const nodes = await this.dbRepo.getNodes();
    return this.formatNodes(nodes);
  }

  /**
   * Get system configuration
   * @returns {Promise<object>} System configuration
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
   * @param {object[]} nodes - List of nodes
   * @returns {object} Node status counts
   */
  calculateNodeStatus(nodes) {
    const now = new Date();
    return nodes.reduce((acc, node) => {
      const heartbeatTime = node.heartbeat_time ? new Date(node.heartbeat_time) : null;
      const status = !heartbeatTime || (now.getTime() - heartbeatTime.getTime()) > 300000000 ? 'Offline' : 'Online';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
  }

  /**
   * Format nodes data
   * @private
   * @param {object[]} nodes - List of nodes
   * @returns {object[]} Formatted nodes
   */
  formatNodes(nodes) {
    const now = new Date();
    return nodes.map(node => ({
      nodeId: node.node_id,
      nodeGroupId: node.node_group_id,
      externalId: node.external_id,
      syncUrl: node.sync_url,
      status: !node.heartbeat_time ? 'OFFLINE' : 
              (now.getTime() - new Date(node.heartbeat_time).getTime() > 300000000 ? 'OFFLINE' : 'ONLINE'),
      lastHeartbeat: node.heartbeat_time,
      hostName: node.host_name,
      ipAddress: node.ip_address,
      osInfo: node.os_name ? `${node.os_name} ${node.os_version}` : null,
      processors: node.available_processors,
      memoryUsage: node.total_memory_bytes ? {
        free: node.free_memory_bytes,
        total: node.total_memory_bytes,
        used: node.total_memory_bytes - node.free_memory_bytes
      } : null,
      version: node.symmetric_version,
      batchInErrorCount: parseInt(node.batch_in_error_count),
      batchToSendCount: parseInt(node.batch_to_send_count)
    }));
  }
}

module.exports = NodeService;