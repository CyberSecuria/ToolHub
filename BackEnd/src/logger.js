// Simple logger utility for ToolHub backend
// Usage: const logger = require('./logger'); logger.info('message');

const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

function getLogFile() {
  const date = new Date().toISOString().slice(0, 10);
  return path.join(logDir, `app-${date}.log`);
}

function log(level, message) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
  fs.appendFile(getLogFile(), line, err => {
    if (err) console.error('Log error:', err);
  });
}

module.exports = {
  info: msg => log('info', msg),
  warn: msg => log('warn', msg),
  error: msg => log('error', msg)
};
