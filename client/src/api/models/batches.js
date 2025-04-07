import axiosInstance from '../axiosConfig';

/**
 * API module for batch-related operations
 * @module api/models/batches
 */

/**
 * Batch status filter options
 * @typedef {Object} BatchStatusFilters
 * @property {string} [incomingStatus] - Filter incoming batches by status code
 * @property {string} [outgoingStatus] - Filter outgoing batches by status code
 * @property {string} [channel] - Filter batches by channel ID
 * @property {string} [nodeId] - Filter batches by node ID
 * @property {number} [limit] - Limit the number of results
 * @property {string} [sortBy] - Field to sort results by
 * @property {string} [sortOrder] - Sort order ('asc' or 'desc')
 */

/**
 * Valid batch directions
 * @type {Array<string>}
 */
const VALID_DIRECTIONS = ['incoming', 'outgoing'];

/**
 * Validates batch direction parameter
 * @private
 * @param {string} direction - The direction to validate
 * @throws {Error} If the direction is invalid
 */
const validateDirection = (direction) => {
  if (!direction || !VALID_DIRECTIONS.includes(direction)) {
    throw new Error(`Valid direction (${VALID_DIRECTIONS.join(' or ')}) is required`);
  }
};

/**
 * Validates batch ID parameter
 * @private
 * @param {string|number} batchId - The batch ID to validate
 * @throws {Error} If the batch ID is missing
 */
const validateBatchId = (batchId) => {
  if (!batchId) {
    throw new Error('Batch ID is required');
  }
};

/**
 * Fetches batch status information from the server
 * 
 * @async
 * @param {BatchStatusFilters} [filters={}] - Optional filters for the batch status query
 * @returns {Promise<Object>} The batch status data
 * @throws {Error} If the API request fails
 */
export const fetchBatchStatus = async (filters = {}) => {
  try {
    // Extract filter parameters
    const { incomingStatus, outgoingStatus, channel, ...otherFilters } = filters;

    // Build query parameters object
    const params = {
      ...otherFilters,
      ...(incomingStatus && { incomingStatus }),
      ...(outgoingStatus && { outgoingStatus }),
      ...(channel && { channel })
    };

    // Make API request
    const response = await axiosInstance.get('/batch/status', { params });
    return response.data || response;
  } catch (error) {
    console.error('Error fetching batch status:', error.message);
    throw error;
  }
};

/**
 * Fetches detailed information for a specific batch
 * 
 * @async
 * @param {string|number} batchId - The ID of the batch to fetch details for
 * @param {string} direction - The direction of the batch ('incoming' or 'outgoing')
 * @returns {Promise<Object>} The detailed batch data
 * @throws {Error} If the API request fails or parameters are invalid
 */
export const fetchBatchDetails = async (batchId, direction) => {
  try {
    validateBatchId(batchId);
    validateDirection(direction);

    const response = await axiosInstance.get(`/batch/${direction}/${batchId}`);
    return response.data || response;
  } catch (error) {
    console.error(`Error fetching ${direction} batch details:`, error.message);
    throw error;
  }
};

/**
 * Fetches sym_data entries associated with a specific batch
 * 
 * @async
 * @param {string|number} batchId - The ID of the batch to fetch data entries for
 * @param {string} direction - The direction of the batch ('incoming' or 'outgoing')
 * @returns {Promise<Array>} The sym_data entries associated with the batch
 * @throws {Error} If the API request fails or parameters are invalid
 */
export const fetchBatchData = async (batchId, direction) => {
  try {
    validateBatchId(batchId);
    validateDirection(direction);

    const response = await axiosInstance.get(`/batch/${batchId}/data`, {
      params: { direction }
    });
    return response.data || response;
  } catch (error) {
    console.error(`Error fetching data for ${direction} batch ${batchId}:`, error.message);
    throw error;
  }
};