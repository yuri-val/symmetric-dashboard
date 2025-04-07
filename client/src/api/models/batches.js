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
 * @property {string} [nodeId] - Filter batches by node ID
 * @property {number} [limit] - Limit the number of results
 * @property {string} [sortBy] - Field to sort results by
 * @property {string} [sortOrder] - Sort order ('asc' or 'desc')
 */

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
    const { incomingStatus, outgoingStatus, ...otherFilters } = filters;

    // Build query parameters object
    const params = {
      ...otherFilters,
      ...(incomingStatus && { incomingStatus }),
      ...(outgoingStatus && { outgoingStatus })
    };

    // Make API request
    const response = await axiosInstance.get('/batch/status', { params });
    return response.data || response;
  } catch (error) {
    console.error('Error fetching batch status:', error.message);
    throw error;
  }
};