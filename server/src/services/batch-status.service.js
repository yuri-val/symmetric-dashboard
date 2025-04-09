/**
 * @module BatchStatusService
 * @description Service for handling batch status operations
 * @author Yuri V
 */
const logger = require('../logger');
const QueryBuilder = require('../utils/query-builder');
const { DIRECTION, DEFAULT_BATCH_LIMIT } = require('../constants/batch.constants');
const { transformBatch, transformStats } = require('../transformers/batch.transformer');

class BatchStatusService {
  /**
   * Creates an instance of BatchStatusService
   * @param {Object} database - Database repository instance
   */
  constructor(database) {
    if (!database) {
      throw new Error('Database instance is required');
    }
    this.database = database;
  }

  /**
   * Retrieves unique channel IDs from both incoming and outgoing batches
   * @async
   * @returns {Promise<Array>} Array of unique channel IDs
   * @throws {Error} If database query fails
   */
  async getUniqueChannels() {
    try {
      logger.debug('Fetching unique channel IDs');
      
      const channels = await this.database.getUniqueChannels();
      
      logger.debug('Unique channel IDs retrieved successfully', { count: channels.length });
      
      return channels;
    } catch (error) {
      logger.error('Error in getUniqueChannels', { 
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  /**
   * Retrieves batch status information with optional filtering
   * @async
   * @param {Object} filters - Filter criteria
   * @param {string} [filters.incomingStatus] - Filter for incoming batch status
   * @param {string} [filters.outgoingStatus] - Filter for outgoing batch status
   * @param {string} [filters.channel] - Filter batches by channel ID
   * @returns {Promise<Object>} Batch status information including outgoing and incoming batches with statistics
   * @throws {Error} If database query fails
   */
  async getBatchStatus(filters = {}) {
    try {
      const { incomingStatus, outgoingStatus, channel } = filters;
      
      logger.debug('Fetching batch status', { filters });

      const [
        outgoingBatches,
        incomingBatches,
        outgoingStats,
        incomingStats
      ] = await Promise.all([
        this.fetchBatches(DIRECTION.OUTGOING, outgoingStatus, channel),
        this.fetchBatches(DIRECTION.INCOMING, incomingStatus, channel),
        this.fetchBatchStats(DIRECTION.OUTGOING, channel),
        this.fetchBatchStats(DIRECTION.INCOMING, channel)
      ]);
      
      logger.debug('Batch data retrieved successfully', { 
        outgoingCount: outgoingBatches.length,
        incomingCount: incomingBatches.length
      });

      return {
        outgoing: outgoingBatches.map(transformBatch),
        incoming: incomingBatches.map(transformBatch),
        stats: {
          outgoing: transformStats(outgoingStats),
          incoming: transformStats(incomingStats)
        }
      };
    } catch (error) {
      logger.error('Error in getBatchStatus', { 
        error: error.message,
        stack: error.stack,
        filters
      });
      throw error;
    }
  }

  /**
   * Fetches batches from the database
   * @private
   * @async
   * @param {string} direction - Direction of batches to fetch ('incoming' or 'outgoing')
   * @param {string} [status] - Optional status filter
   * @param {string} [channel] - Optional channel filter
   * @returns {Promise<Array>} Array of batch records
   */
  async fetchBatches(direction, status, channel) {
    const normalizedDirection = direction.toLowerCase();
    const tableName = `sym_${normalizedDirection}_batch`;
    
    const queryBuilder = new QueryBuilder(tableName)
      .where('status = ?', status)
      .where('channel_id = ?', channel)
      .order('create_time')
      .limitTo(DEFAULT_BATCH_LIMIT);
    
    const { query, params } = queryBuilder.build();
    
    logger.debug('Fetching batches', { direction: normalizedDirection, status, channel, query });

    return this.database.executeQuery(query, params);
  }

  /**
   * Fetches batch statistics from the database
   * @private
   * @async
   * @param {string} direction - Direction of batches to fetch stats for ('incoming' or 'outgoing')
   * @param {string} [channel] - Optional channel filter
   * @returns {Promise<Array>} Array of batch statistics
   */
  async fetchBatchStats(direction, channel) {
    const normalizedDirection = direction.toLowerCase();
    const tableName = `sym_${normalizedDirection}_batch`;
    
    const queryBuilder = new QueryBuilder(tableName)
      .select('status, COUNT(*) as count')
      .where('channel_id = ?', channel)
      .group('status');
    
    const { query, params } = queryBuilder.build();
    
    logger.debug('Fetching batch stats', { direction: normalizedDirection, channel, query });

    return this.database.executeQuery(query, params);
  }
}

module.exports = BatchStatusService;