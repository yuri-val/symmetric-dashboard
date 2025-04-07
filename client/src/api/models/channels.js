import axiosInstance from '../axiosConfig';

/**
 * API module for channel-related operations
 * @module api/models/channels
 */

/**
 * Fetches unique channel IDs from both incoming and outgoing batches
 * 
 * @async
 * @returns {Promise<Array<string>>} Array of unique channel IDs
 * @throws {Error} If the API request fails
 */
export const fetchUniqueChannels = async () => {
  try {
    const response = await axiosInstance.get('/batch/channels');
    console.log('Fetched unique channels:', response);
    return response || [];
  } catch (error) {
    console.error('Error fetching unique channels:', error.message);
    throw error;
  }
};