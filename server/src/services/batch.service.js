/**
 * @module BatchService
 * @description Service for handling batch-related operations and data retrieval
 * @author Yuri V
 */
const DatabaseRepository = require('../repositories/database.repository');
const logger = require('../logger');

/**
 * Service class for batch operations
 * @class BatchService
 */
class BatchService {
  /**
   * Creates an instance of BatchService
   * @param {Object} config - Database configuration object
   * @throws {Error} If database configuration is not provided
   */
  constructor(config) {
    if (!config) {
      throw new Error('Database configuration is required');
    }
    this.database = new DatabaseRepository(config);
  }

  /**
   * Retrieves batch status information with optional filtering
   * @async
   * @param {Object} filters - Filter criteria
   * @param {string} [filters.incomingStatus] - Filter for incoming batch status
   * @param {string} [filters.outgoingStatus] - Filter for outgoing batch status
   * @returns {Promise<Object>} Batch status information including outgoing and incoming batches with statistics
   * @throws {Error} If database query fails
   */
  async getBatchStatus(filters = {}) {
    try {
      const { incomingStatus, outgoingStatus } = filters;

      const [
        outgoingBatches,
        incomingBatches,
        outgoingStats,
        incomingStats
      ] = await Promise.all([
        this.fetchBatches('outgoing', outgoingStatus),
        this.fetchBatches('incoming', incomingStatus),
        this.fetchBatchStats('outgoing'),
        this.fetchBatchStats('incoming')
      ]);

      return {
        outgoing: outgoingBatches.map(this.transformBatch),
        incoming: incomingBatches.map(this.transformBatch),
        stats: {
          outgoing: this.transformStats(outgoingStats),
          incoming: this.transformStats(incomingStats)
        }
      };
    } catch (error) {
      logger.error('Error in getBatchStatus:', error);
      throw error;
    }
  }

  /**
   * Fetches batches from the database
   * @private
   * @async
   * @param {string} type - Type of batches to fetch ('incoming' or 'outgoing')
   * @param {string} [status] - Optional status filter
   * @returns {Promise<Array>} Array of batch records
   */
  async fetchBatches(type, status) {
    const tableName = `sym_${type}_batch`;
    let query = `SELECT * FROM ${tableName}`;
    const params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY create_time DESC LIMIT 100';

    return this.database.executeQuery(query, params);
  }

  /**
   * Fetches batch statistics from the database
   * @private
   * @async
   * @param {string} type - Type of batches to fetch stats for ('incoming' or 'outgoing')
   * @returns {Promise<Array>} Array of batch statistics
   */
  async fetchBatchStats(type) {
    const tableName = `sym_${type}_batch`;
    const query = `SELECT status, COUNT(*) as count FROM ${tableName} GROUP BY status`;

    return this.database.executeQuery(query);
  }

  /**
   * Transforms a batch record to the expected format
   * @private
   * @param {Object} batch - Raw batch record from database
   * @returns {Object} Transformed batch object
   */
  transformBatch(batch) {
    return {
      batchId: batch.batch_id,
      nodeId: batch.node_id,
      channelId: batch.channel_id,
      status: batch.status,
      errorFlag: batch.error_flag === 1,
      byteCount: batch.byte_count,
      dataEventCount: batch.data_event_count,
      createTime: batch.create_time,
      loadTime: batch.load_time,
      routerId: batch.router_id
    };
  }

  /**
   * Transforms batch statistics to a map of status codes to counts
   * @private
   * @param {Array} stats - Array of status statistics
   * @returns {Object} Map of status codes to counts
   */
  transformStats(stats) {
    return stats.reduce((acc, curr) => {
      acc[curr.status] = curr.count;
      return acc;
    }, {});
  }
}

module.exports = BatchService;