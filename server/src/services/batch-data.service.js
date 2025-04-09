/**
 * @module BatchDataService
 * @description Service for handling batch data operations
 * @author Yuri V
 */
const logger = require('../logger');
const QueryBuilder = require('../utils/query-builder');
const { transformDataEntry, transformDataEvent } = require('../transformers/batch.transformer');
const { DEFAULT_BATCH_LIMIT } = require('../constants/batch.constants');

class BatchDataService {
  /**
   * Creates an instance of BatchDataService
   * @param {Object} database - Database repository instance
   */
  constructor(database) {
    if (!database) {
      throw new Error('Database instance is required');
    }
    this.database = database;
  }

  /**
   * Retrieves sym_data entries associated with a specific batch
   * @async
   * @param {string|number} batchId - The ID of the batch
   * @returns {Promise<Array>} Array of sym_data entries associated with the batch
   * @throws {Error} If database query fails
   */
  async getBatchData(batchId) {
    try {
      logger.debug('Getting batch data', { batchId });
      
      // SQL query to join sym_data_event with sym_data
      const query = `
        SELECT d.*
        FROM sym_data_event de
        JOIN sym_data d ON de.data_id = d.data_id
        WHERE de.batch_id = ?
        ORDER BY d.data_id
        LIMIT ${DEFAULT_BATCH_LIMIT}
      `;
      
      logger.debug('Executing batch data query', { batchId });
      const results = await this.database.executeQuery(query, [batchId]);
      
      logger.debug('Batch data retrieved successfully', { batchId, count: results.length });
      return results.map(transformDataEntry);
    } catch (error) {
      logger.error('Error fetching batch data', { 
        batchId,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  /**
   * Fetches data events associated with a batch
   * @async
   * @param {string|number} batchId - The ID of the batch
   * @returns {Promise<Array>} Array of data events
   */
  async fetchBatchDataEvents(batchId) {
    try {
      logger.debug('Fetching batch data events', { batchId });
      
      const queryBuilder = new QueryBuilder('sym_data_event')
        .where('batch_id = ?', batchId)
        .order('data_id')
        .limitTo(DEFAULT_BATCH_LIMIT);
      
      const { query, params } = queryBuilder.build();
      
      const results = await this.database.executeQuery(query, params);
      
      logger.debug('Batch data events retrieved', { batchId, count: results.length });
      return results.map(transformDataEvent);
    } catch (error) {
      logger.error('Error fetching batch data events', { 
        batchId,
        error: error.message,
        stack: error.stack
      });
      return [];
    }
  }

  /**
   * Checks if a batch exists in the database
   * @async
   * @param {string|number} batchId - The ID of the batch
   * @param {string} direction - The direction of the batch
   * @returns {Promise<boolean>} True if batch exists, false otherwise
   */
  async batchExists(batchId, direction) {
    const queryBuilder = new QueryBuilder(`sym_${direction}_batch`)
      .select('batch_id')
      .where('batch_id = ?', batchId)
      .limitTo(1);
    
    const { query, params } = queryBuilder.build();
    
    const result = await this.database.executeQuery(query, params);
    
    return result && result.length > 0;
  }
}

module.exports = BatchDataService;