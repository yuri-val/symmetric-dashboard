import axiosInstance from '../axiosConfig';

/**
 * Fetch nodes information
 * @returns {Promise<Array>} Array of node objects
 */
export const fetchNodes = async () => {
  try {
    const data = await axiosInstance.get('/node/nodes');
    return data;
  } catch (error) {
    console.error('Error fetching nodes:', error.message);
    throw error;
  }
};

/**
 * Fetch node status statistics
 * @returns {Promise<Object>} Node status statistics
 */
export const fetchNodeStatus = async () => {
  try {
    const data = await axiosInstance.get('/node/status');
    return {
      nodeStatus: data.nodeStatus,
      syncStats: data.syncStats
    };
  } catch (error) {
    console.error('Error fetching node status:', error.message);
    throw error;
  }
};