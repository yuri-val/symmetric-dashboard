import axiosInstance from "../axiosConfig";

/**
 * Fetch nodes information
 * @returns {Promise<Array>} Array of node objects
 */
export const fetchNodes = async () => {
  try {
    const data = await axiosInstance.get("/node/nodes");
    return data;
  } catch (error) {
    console.error("Error fetching nodes:", error.message);
    throw error;
  }
};

/**
 * Fetch node status statistics
 * @returns {Promise<Object>} Node status statistics
 */
export const fetchNodeStatus = async () => {
  try {
    const data = await axiosInstance.get("/node/status");
    return data;
  } catch (error) {
    console.error("Error fetching node status:", error.message);
    throw error;
  }
};

/**
 * Fetch batch status statistics for a specific node
 * @param {string} nodeId - The ID of the node
 * @returns {Promise<Object>} Batch status statistics for the node
 */
export const fetchNodeBatchStats = async (nodeId) => {
  if (!nodeId) {
    throw new Error("Node ID is required");
  }

  try {
    // Make sure to specifically request only statistics for this node
    const response = await axiosInstance.get("/batch/status", {
      params: { nodeId: nodeId },
    });

    // Make sure we're getting the data property from the response
    return response.data || response;
  } catch (error) {
    console.error("Error fetching node batch statistics:", error.message);
    throw error;
  }
};
