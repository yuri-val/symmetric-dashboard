const fs = require('fs');
const path = require('path');

/**
 * @class Logger
 * @description Custom logger implementation with development mode support
 */
class Logger {
  constructor() {
    this.logDir = path.join(__dirname, '../logs');
    this.logFile = path.join(this.logDir, 'sql.log');
    this.isDevelopment = process.env.NODE_ENV === 'development';
    
    // Ensure logs directory exists
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
    
    // Log startup mode
    this.log(`Logger initialized in ${this.isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION'} mode`);
  }

  /**
   * Log an error message with optional context data
   * @param {string} message - Error message
   * @param {Object} [context] - Additional context data for debugging
   */
  error(message, context = {}) {
    // In development mode, include full context
    if (this.isDevelopment && context) {
      // Format the context object for better readability
      const contextStr = JSON.stringify(context, null, 2);
      this.log(`ERROR: ${message}\nContext: ${contextStr}`);
      
      // Also log to console in development mode for immediate feedback
      console.error(`ERROR: ${message}`, context);
    } else {
      // In production, just log the error message without sensitive details
      this.log(`ERROR: ${message}`);
    }
  }

  /**
   * Log a debug message (only in development mode)
   * @param {string} message - Debug message
   * @param {Object} [context] - Additional context data for debugging
   */
  debug(message, context = {}) {
    // Only log debug messages in development mode
    if (this.isDevelopment) {
      const contextStr = context ? `\nContext: ${JSON.stringify(context, null, 2)}` : '';
      this.log(`DEBUG: ${message}${contextStr}`);
      console.debug(`DEBUG: ${message}`, context);
    }
  }

  /**
   * Log an info message
   * @param {string} message - Info message
   * @param {Object} [context] - Additional context data
   */
  info(message, context = {}) {
    // In development mode, include context if provided
    if (this.isDevelopment && context && Object.keys(context).length > 0) {
      const contextStr = JSON.stringify(context, null, 2);
      this.log(`INFO: ${message}\nContext: ${contextStr}`);
      
      // Also log to console in development mode for immediate feedback
      console.info(`INFO: ${message}`, context);
    } else {
      // In production, just log the message
      this.log(`INFO: ${message}`);
      
      // Still log to console but without context in production
      console.info(`INFO: ${message}`);
    }
  }

  /**
   * Log a message to the log file
   * @param {string} message - Message to log
   */
  log(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    
    fs.appendFileSync(this.logFile, logEntry);
  }

  /**
   * Log SQL query details
   * @param {string} query - SQL query string
   * @param {Array} params - Query parameters
   * @param {number} duration - Query execution time in milliseconds
   * @param {Object} results - Query results
   */
  logQuery(query, params, duration, results) {
    // In development mode, log full query details including results
    if (this.isDevelopment) {
      const logMessage = [
        '=== SQL Query ===',
        `Query: ${query}`,
        `Parameters: ${JSON.stringify(params)}`,
        `Duration: ${duration}ms`,
        `Results: ${JSON.stringify(results, null, 2)}`,
        '===============\n'
      ].join('\n');

      this.log(logMessage);
    } else {
      // In production, log minimal query info without results for security/performance
      const logMessage = [
        '=== SQL Query ===',
        `Query: ${query}`,
        `Parameters: ${JSON.stringify(params)}`,
        `Duration: ${duration}ms`,
        `Results: [${Array.isArray(results) ? results.length : 'object'} returned]`,
        '===============\n'
      ].join('\n');

      this.log(logMessage);
    }
  }
}

module.exports = new Logger();