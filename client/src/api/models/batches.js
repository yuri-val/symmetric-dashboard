import axiosInstance from '../axiosConfig';

/**
 * Fetch batch status information
 * @returns {Promise<Array>} Array of batch status objects
 */
export const fetchBatchStatus = async () => {
  try {
    const data = await axiosInstance.get('/batch/status');
    return data;
  } catch (error) {
    console.error('Error fetching batch status:', error.message);
    throw error;
  }
};