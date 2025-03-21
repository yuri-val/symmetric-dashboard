const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logDir = path.join(__dirname, '../logs');
    this.logFile = path.join(this.logDir, 'sql.log');
    
    // Ensure logs directory exists
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  error(message) {
    this.log(`ERROR: ${message}`);
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    
    fs.appendFileSync(this.logFile, logEntry);
  }

  logQuery(query, params, duration, results) {
    const logMessage = [
      '=== SQL Query ===',
      `Query: ${query}`,
      `Parameters: ${JSON.stringify(params)}`,
      `Duration: ${duration}ms`,
      `Results: ${JSON.stringify(results, null, 2)}`,
      '===============\n'
    ].join('\n');

    this.log(logMessage);
  }
}

module.exports = new Logger();