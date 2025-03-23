/**
 * Utility functions for batch status handling
 */

/**
 * Get the appropriate color for a batch status
 * @param {string} status - The batch status code
 * @returns {string} The MUI color name for the status
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'ERROR':
    case 'ER':
      return 'error';
    case 'OK':
      return 'success';
    case 'NE':
    case 'QE':
    case 'SE':
    case 'LD':
    case 'RT':
      return 'warning';
    default:
      return 'default';
  }
};

/**
 * Get a human-readable label for a batch status code
 * @param {string} status - The batch status code
 * @returns {string} The human-readable status label
 */
export const getStatusLabel = (status) => {
  switch (status) {
    case 'NE': return 'New';
    case 'QE': return 'Queued';
    case 'SE': return 'Sending';
    case 'ER': return 'Error';
    case 'OK': return 'OK';
    case 'LD': return 'Loading';
    case 'RT': return 'Routing';
    default: return status;
  }
};