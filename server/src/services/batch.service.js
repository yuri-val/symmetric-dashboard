/**
 * @module BatchService
 * @description Service for handling batch-related operations and data retrieval
 * @author Yuri V
 */
const DatabaseRepository = require('../repositories/database.repository');
const logger = require('../logger');

/**
 * Batch directions enum
 * @readonly
 * @enum {string}
 */
const DIRECTION = Object.freeze({
  INCOMING: 'incoming',
  OUTGOING: 'outgoing'
});

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
      
      logger.debug('Fetching batch status', { filters });

      const [
        outgoingBatches,
        incomingBatches,
        outgoingStats,
        incomingStats
      ] = await Promise.all([
        this.fetchBatches(DIRECTION.OUTGOING, outgoingStatus),
        this.fetchBatches(DIRECTION.INCOMING, incomingStatus),
        this.fetchBatchStats(DIRECTION.OUTGOING),
        this.fetchBatchStats(DIRECTION.INCOMING)
      ]);

      // Use bind to ensure correct 'this' context for the callback functions
      const transformBatch = this.transformBatch.bind(this);
      
      logger.debug('Batch data retrieved successfully', { 
        outgoingCount: outgoingBatches.length,
        incomingCount: incomingBatches.length
      });

      return {
        outgoing: outgoingBatches.map(transformBatch),
        incoming: incomingBatches.map(transformBatch),
        stats: {
          outgoing: this.transformStats(outgoingStats),
          incoming: this.transformStats(incomingStats)
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
   * @param {string} type - Type of batches to fetch ('incoming' or 'outgoing')
   * @param {string} [status] - Optional status filter
   * @returns {Promise<Array>} Array of batch records
   */
  async fetchBatches(type, status) {
    const tableName = `sym_${type}_batch`;
    const params = [];
    
    let query = `SELECT * FROM ${tableName}`;
    
    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY create_time DESC LIMIT 100';
    
    logger.debug('Fetching batches', { type, status, query });
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

  /**
   * Retrieves detailed information for a specific batch
   * @async
   * @param {string|number} batchId - The ID of the batch to fetch
   * @param {string} direction - The direction of the batch ('incoming' or 'outgoing')
   * @returns {Promise<Object|null>} Detailed batch information or null if not found
   * @throws {Error} If database query fails
   */
  async getBatchDetails(batchId, direction) {
    try {
      logger.debug('Getting batch details', { batchId, direction });
      this.validateDirection(direction);
      
      const tableName = `sym_${direction}_batch`;
      const query = `
        SELECT * FROM ${tableName} 
        WHERE batch_id = ? 
        LIMIT 1
      `;
      
      const results = await this.database.executeQuery(query, [batchId]);
      
      if (!results || results.length === 0) {
        logger.debug('No batch found with provided ID', { batchId, direction });
        return null;
      }
      
      // Transform the basic batch data
      const batchData = this.transformBatch(results[0]);
      
      // Fetch additional data related to this batch
      logger.debug('Fetching additional batch data', { batchId, direction });
      const additionalData = await this.fetchBatchAdditionalData(batchId, direction);
      
      // Combine the data
      logger.debug('Batch details retrieved successfully', { batchId, direction });
      return {
        ...batchData,
        ...additionalData
      };
    } catch (error) {
      logger.error(`Error in getBatchDetails: ${error.message}`, { 
        batchId, 
        direction,
        stack: error.stack,
        code: error.code
      });
      throw error;
    }
  }

  /**
   * Fetches additional data related to a specific batch
   * @private
   * @async
   * @param {string|number} batchId - The ID of the batch
   * @param {string} direction - The direction of the batch ('incoming' or 'outgoing')
   * @returns {Promise<Object>} Additional batch data
   */
  async fetchBatchAdditionalData(batchId, direction) {
    // For outgoing batches, we might want to fetch data events
    if (direction === DIRECTION.OUTGOING) {
      const dataEvents = await this.fetchBatchDataEvents(batchId);
      return { dataEvents };
    }
    
    // For incoming batches, we might want to fetch different related data
    // This can be customized based on requirements
    return {};
  }

  /**
   * Fetches data events associated with an outgoing batch
   * @private
   * @async
   * @param {string|number} batchId - The ID of the outgoing batch
   * @returns {Promise<Array>} Array of data events
   */
  async fetchBatchDataEvents(batchId) {
    try {
      logger.debug('Fetching batch data events', { batchId });
      const query = `
        SELECT * FROM sym_data_event 
        WHERE batch_id = ? 
        ORDER BY data_id 
        LIMIT 100
      `;
      
      const results = await this.database.executeQuery(query, [batchId]);
      
      logger.debug('Batch data events retrieved', { batchId, count: results.length });
      return results.map(event => ({
        dataId: event.data_id,
        batchId: event.batch_id,
        routerId: event.router_id,
        createTime: event.create_time,
        tableId: event.table_name
      }));
    } catch (error) {
      logger.error(`Error fetching batch data events: ${error.message}`, { 
        batchId,
        stack: error.stack,
        code: error.code
      });
      return [];
    }
  }

  /**
   * Validates the direction parameter
   * @private
   * @param {string} direction - The direction to validate
   * @throws {Error} If direction is invalid
   */
  validateDirection(direction) {
    if (!direction || !Object.values(DIRECTION).includes(direction.toLowerCase())) {
      throw new Error('Invalid direction parameter');
    }
  }

  /**
   * Retrieves sym_data entries associated with a specific batch
   * @async
   * @param {string|number} batchId - The ID of the batch
   * @param {string} direction - The direction of the batch ('incoming' or 'outgoing')
   * @returns {Promise<Array>} Array of sym_data entries associated with the batch
   * @throws {Error} If database query fails
   */
  async getBatchData(batchId, direction) {
    try {
      logger.debug('Getting batch data', { batchId, direction });
      // Validate direction parameter
      this.validateDirection(direction);

      // Normalize direction to lowercase
      const normalizedDirection = direction.toLowerCase();
      
      // First verify the batch exists in the appropriate batch table
      const batchExists = await this.batchExists(batchId, normalizedDirection);
      
      if (!batchExists) {
        // Return empty array if batch doesn't exist
        logger.debug('Batch does not exist, returning empty data array', { batchId, direction: normalizedDirection });
        return [];
      }
      
      // SQL query to join sym_data_event with sym_data
      // Use batch_id to find related data entries
      const query = `
        SELECT d.*
        FROM sym_data_event de
        JOIN sym_data d ON de.data_id = d.data_id
        WHERE de.batch_id = ?
        ORDER BY d.data_id
        LIMIT 100
      `;
      
      logger.debug('Executing batch data query', { batchId, query });
      const results = await this.database.executeQuery(query, [batchId]);
      
      logger.debug('Batch data retrieved successfully', { batchId, count: results.length });
      // Transform the results to camelCase for frontend consumption
      return results.map(this.transformDataEntry);
    } catch (error) {
      logger.error(`Error fetching batch data: ${error.message}`, { 
        batchId, 
        direction,
        stack: error.stack,
        code: error.code 
      });
      throw error;
    }
  }

  /**
   * Checks if a batch exists in the database
   * @private
   * @async
   * @param {string|number} batchId - The ID of the batch
   * @param {string} direction - The direction of the batch
   * @returns {Promise<boolean>} True if batch exists, false otherwise
   */
  async batchExists(batchId, direction) {
    const batchCheckQuery = `
      SELECT batch_id FROM sym_${direction}_batch 
      WHERE batch_id = ? 
      LIMIT 1
    `;
    
    const batchExists = await this.database.executeQuery(batchCheckQuery, [batchId]);
    
    return batchExists && batchExists.length > 0;
  }

  /**
   * Transforms a data entry to the expected format
   * @private
   * @param {Object} data - Raw data entry from database
   * @returns {Object} Transformed data entry
   */
  transformDataEntry(data) {
    return {
      dataId: data.data_id,
      tableName: data.table_name,
      eventType: data.event_type,
      rowData: data.row_data,
      oldData: data.old_data,
      pkData: data.pk_data,
      createTime: data.create_time,
      sourceNodeId: data.source_node_id,
      channelId: data.channel_id,
      triggerHistId: data.trigger_hist_id
    };
  }
}

module.exports = BatchService;