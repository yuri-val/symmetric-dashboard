/**
 * @fileoverview Database repository for SymmetricDS dashboard
 */
const mysql = require('mysql2/promise');
const logger = require('../logger');

class DatabaseRepository {
  constructor(config) {
    this.pool = mysql.createPool({
      host: config.host || 'localhost',
      port: config.port || 3306,
      user: config.user || 'root',
      password: config.password,
      database: config.database || 'symmetric',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }

  /**
   * Execute a SQL query and log it
   * @param {string} query - SQL query to execute
   * @param {Array} [params=[]] - Query parameters
   * @returns {Promise<Array>} Query results
   * @throws {Error} If query execution fails
   */
  async executeQuery(query, params = []) {
    const startTime = Date.now();
    try {
      logger.debug('Executing SQL query', { query, params });
      const [results] = await this.pool.query(query, params);
      const duration = Date.now() - startTime;
      
      logger.logQuery(query, params, duration, results);
      
      if (duration > 1000) {
        // Log slow queries with a warning
        logger.debug('Slow query detected', { query, duration, params });
      }
      
      return results;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error(`Database query failed: ${error.message}`, {
        query,
        params,
        duration,
        code: error.code,
        sqlState: error.sqlState,
        stack: error.stack
      });
      throw error;
    }
  }

  /**
   * Get node status and heartbeat information
   * @returns {Promise<Array>} Node status data
   */
  async getNodeStatus() {
    return this.executeQuery(
      'SELECT n.node_id, n.batch_in_error_count, n.batch_to_send_count, h.heartbeat_time ' +
      'FROM sym_node n ' +
      'LEFT JOIN sym_node_host h ON n.node_id = h.node_id'
    );
  }

  /**
   * Get detailed node information
   * @returns {Promise<Array>} Detailed node data
   */
  async getNodes() {
    return this.executeQuery(
      'SELECT n.node_id, n.node_group_id, n.external_id, n.sync_url, ' +
      'n.batch_in_error_count, n.batch_to_send_count, ' +
      'h.heartbeat_time, h.host_name, h.ip_address, ' +
      'h.os_name, h.os_version, h.available_processors, ' +
      'h.free_memory_bytes, h.total_memory_bytes, ' +
      'h.symmetric_version, g.description as node_group_description ' +
      'FROM sym_node n ' +
      'LEFT JOIN sym_node_host h ON n.node_id = h.node_id ' +
      'LEFT JOIN sym_node_group g ON n.node_group_id = g.node_group_id'
    );
  }

  /**
   * Get node groups configuration
   * @returns {Promise<Array>} Node groups data
   */
  async getNodeGroups() {
    return this.executeQuery('SELECT node_group_id as id, description FROM sym_node_group');
  }

  /**
   * Get channels configuration
   * @returns {Promise<Array>} Channels data
   */
  async getChannels() {
    return this.executeQuery('SELECT channel_id as id, max_batch_size, description FROM sym_channel');
  }

  /**
   * Get unique channel IDs from both incoming and outgoing batches
   * @returns {Promise<Array>} Unique channel IDs
   */
  async getUniqueChannels() {
    return this.executeQuery(
      'SELECT DISTINCT channel_id FROM sym_outgoing_batch ' +
      'UNION ' +
      'SELECT DISTINCT channel_id FROM sym_incoming_batch ' +
      'ORDER BY channel_id'
    );
  }

  /**
   * Get triggers configuration
   * @returns {Promise<Array>} Triggers data
   */
  async getTriggers() {
    return this.executeQuery(
      'SELECT trigger_id as triggerId, source_table_name as sourceTableName, ' +
      'channel_id as channelId, last_update_time as lastUpdateTime ' +
      'FROM sym_trigger'
    );
  }

  /**
   * Get sync batch statistics
   * @returns {Promise<Array>} Sync batch statistics
   */
  async getSyncBatchStats() {
    return this.executeQuery('SELECT status, count(*) as count FROM sym_outgoing_batch GROUP BY status');
  }
}

module.exports = DatabaseRepository;