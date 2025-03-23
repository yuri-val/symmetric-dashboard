/**
 * Utility functions for node components
 */

/**
 * Determines the color to use for a node status
 * @param {string} status - The node status
 * @returns {string} The MUI color to use
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'ONLINE':
      return 'success';
    case 'OFFLINE':
      return 'error';
    default:
      return 'warning';
  };
};

/**
 * Formats memory usage data into a human-readable format
 * @param {Object} memoryUsage - Memory usage object with used and total properties
 * @returns {string} Formatted memory usage string
 */
export const formatMemoryUsage = (memoryUsage) => {
  if (!memoryUsage) return 'N/A';
  
  const usedMB = Math.round(memoryUsage.used / (1024 * 1024) * 10) / 10;
  const totalMB = Math.round(memoryUsage.total / (1024 * 1024) * 10) / 10;
  const percentage = Math.round((memoryUsage.used / memoryUsage.total) * 100);
  
  return {
    usedMB,
    totalMB,
    percentage
  };
};

/**
 * Formats a date string into a human-readable format
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).replace(',', '');
};

export default {
  getStatusColor,
  formatMemoryUsage,
  formatDate
};