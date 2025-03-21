import axiosInstance from '../axiosConfig';

/**
 * Fetch engine configuration information
 * @returns {Promise<Object>} Engine configuration object
 */
export const fetchEngineConfig = async () => {
  try {
    const data = await axiosInstance.get('/engine/config');
    return data;
  } catch (error) {
    console.error('Error fetching engine configuration:', error.message);
    throw error;
  }
};