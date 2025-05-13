/**
 * @module BatchService
 * @description Service for handling batch-related operations and data retrieval
 * @author Yuri V
 */
const logger = require("../logger");
const DatabaseRepository = require("../repositories/database.repository");
const BatchStatusService = require("./batch-status.service");
const BatchDataService = require("./batch-data.service");
const QueryBuilder = require("../utils/query-builder");
const { DIRECTION } = require("../constants/batch.constants");
const { transformBatch } = require("../transformers/batch.transformer");

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
      throw new Error("Database configuration is required");
    }
    this.database = new DatabaseRepository(config);
    this.batchStatusService = new BatchStatusService(this.database);
    this.batchDataService = new BatchDataService(this.database);
  }

  /**
   * Retrieves unique channel IDs from both incoming and outgoing batches
   * @async
   * @returns {Promise<Array>} Array of unique channel IDs
   * @throws {Error} If database query fails
   */
  async getUniqueChannels() {
    return this.batchStatusService.getUniqueChannels();
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
    return this.batchStatusService.getBatchStatus(filters);
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
  async fetchBatchAdditionalData(batchId, direction) {
    // For outgoing batches, fetch data events
    if (direction === DIRECTION.OUTGOING) {
      const dataEvents = await this.batchDataService.fetchBatchDataEvents(
        batchId
      );
      return { dataEvents };
    }

    // For incoming batches, we might want to fetch different related data
    // This can be customized based on requirements
    return {};
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
      logger.debug("Getting batch details", { batchId, direction });
      this.validateDirection(direction);
      const normalizedDirection = direction.toLowerCase();

      const queryBuilder = new QueryBuilder(`sym_${normalizedDirection}_batch`)
        .where("batch_id = ?", batchId)
        .limitTo(1);

      const { query, params } = queryBuilder.build();

      const results = await this.database.executeQuery(query, params);

      if (!results || results.length === 0) {
        logger.debug("No batch found with provided ID", {
          batchId,
          direction: normalizedDirection,
        });
        return null;
      }

      // Transform the basic batch data
      const batchData = transformBatch(results[0]);

      // Fetch additional data related to this batch
      logger.debug("Fetching additional batch data", {
        batchId,
        direction: normalizedDirection,
      });
      const additionalData = await this.fetchBatchAdditionalData(
        batchId,
        normalizedDirection
      );

      // Combine the data
      logger.debug("Batch details retrieved successfully", {
        batchId,
        direction: normalizedDirection,
      });
      return {
        ...batchData,
        ...additionalData,
      };
    } catch (error) {
      logger.error("Error in getBatchDetails", {
        batchId,
        direction,
        error: error.message,
        stack: error.stack,
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
      logger.debug("Fetching batch data events", { batchId });

      const queryBuilder = new QueryBuilder("sym_data_event")
        .where("batch_id = ?", batchId)
        .order("data_id")
        .limitTo(100);

      const { query, params } = queryBuilder.build();

      const results = await this.database.executeQuery(query, params);

      logger.debug("Batch data events retrieved", {
        batchId,
        count: results.length,
      });
      return results.map((event) => ({
        dataId: event.data_id,
        batchId: event.batch_id,
        routerId: event.router_id,
        createTime: event.create_time,
        tableId: event.table_name,
      }));
    } catch (error) {
      logger.error("Error fetching batch data events", {
        batchId,
        error: error.message,
        stack: error.stack,
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
    if (
      !direction ||
      !Object.values(DIRECTION).includes(direction.toLowerCase())
    ) {
      throw new Error(`Invalid direction parameter: ${direction}`);
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
      logger.debug("Getting batch data", { batchId, direction });
      this.validateDirection(direction);
      const normalizedDirection = direction.toLowerCase();

      // First verify the batch exists
      const batchExists = await this.batchDataService.batchExists(
        batchId,
        normalizedDirection
      );

      if (!batchExists) {
        logger.debug("Batch does not exist, returning empty data array", {
          batchId,
          direction: normalizedDirection,
        });
        return [];
      }

      return this.batchDataService.getBatchData(batchId);
    } catch (error) {
      logger.error("Error fetching batch data", {
        batchId,
        direction,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}

module.exports = BatchService;
