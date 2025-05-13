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
    case "ERROR":
    case "ER":
      return "error";
    case "OK":
      return "success";
    case "NE":
    case "QY": // Querying
    case "SE":
    case "LD":
    case "RT":
    case "LS": // LoadSetup
    case "RS": // Resend
      return "warning";
    case "RQ": // Request
      return "info";
    case "IG": // Ignored
      return "default";
    case "XX": // Unknown
      return "default";
    default:
      return "default";
  }
};

/**
 * Get a human-readable label for a batch status code
 * @param {string} status - The batch status code
 * @returns {string} The human-readable status label
 */
export const getStatusLabel = (status) => {
  switch (status) {
    case "NE":
      return "New";
    case "QY":
      return "Querying";
    case "SE":
      return "Sending";
    case "ER":
      return "Error";
    case "OK":
      return "OK";
    case "LD":
      return "Loading";
    case "RT":
      return "Routing";
    case "RQ":
      return "Request";
    case "IG":
      return "Ignored";
    case "RS":
      return "Resend";
    case "XX":
      return "Unknown";
    case "LS":
      return "LoadSetup";
    default:
      return status;
  }
};
