const { createLogger, transports, format } = require('winston');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

// สร้างโฟลเดอร์ logs หากไม่มี
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Custom format สำหรับ console
const consoleFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message, data, error }) => {
    let output = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    if (data) output += `\nData: ${JSON.stringify(data, null, 2)}`;
    if (error) output += `\nError: ${error}`;
    return output;
  })
);

// สร้าง logger instance
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }), // จัดการ error stack อัตโนมัติ
    format.json()
  ),
  transports: [
    // Error logs
    new transports.File({ 
      filename: path.join(logsDir, 'error.log'), 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: format.combine(
        format.timestamp(),
        format.json()
      )
    }),
    // Combined logs
    new transports.File({ 
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Daily rotate logs
    new transports.File({
      filename: path.join(logsDir, `app-${new Date().toISOString().split('T')[0]}.log`),
      level: 'info'
    })
  ],
  // Handle uncaught exceptions
  exceptionHandlers: [
    new transports.File({ filename: path.join(logsDir, 'exceptions.log') })
  ],
  rejectionHandlers: [
    new transports.File({ filename: path.join(logsDir, 'rejections.log') })
  ]
});

// เพิ่ม console transport เฉพาะใน development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: consoleFormat,
    level: 'debug'
  }));
}

// Utility functions สำหรับใช้งานง่าย
const logLevel = {
  DEBUG: 'debug',
  INFO: 'info', 
  WARN: 'warn',
  ERROR: 'error'
};

const debug = (msg, data = null) => {
  console.log(chalk.yellow(`[DEBUG] ${new Date().toLocaleTimeString('th-TH')} ${msg}`));
  if (data) console.log(chalk.gray(JSON.stringify(data, null, 2)));
  logger.debug({ message: msg, data });
};

const info = (msg, data = null) => {
  console.log(chalk.blue(`[INFO] ${new Date().toLocaleTimeString('th-TH')} ${msg}`));
  if (data) console.log(chalk.cyan(JSON.stringify(data, null, 2)));
  logger.info({ message: msg, data });
};

const success = (msg, data = null) => {
  console.log(chalk.green(`[SUCCESS] ${new Date().toLocaleTimeString('th-TH')} ${msg}`));
  if (data) console.log(chalk.cyan(JSON.stringify(data, null, 2)));
  logger.info({ message: msg, data, type: 'success' });
};

const warn = (msg, data = null) => {
  console.log(chalk.yellow(`[WARN] ${new Date().toLocaleTimeString('th-TH')} ${msg}`));
  if (data) console.log(chalk.yellow(JSON.stringify(data, null, 2)));
  logger.warn({ message: msg, data });
};

const error = (msg, err = null) => {
  console.error(chalk.red(`[ERROR] ${new Date().toLocaleTimeString('th-TH')} ${msg}`));
  if (err) {
    console.error(chalk.red(err.stack || err.message || err));
  }
  logger.error({ 
    message: msg, 
    error: err?.stack || err?.message || err,
    timestamp: new Date().toISOString()
  });
};

// Performance logging
const performance = {
  start: (label) => {
    const startTime = Date.now();
    console.time(chalk.magenta(`[PERF] ${label}`));
    return {
      end: (additionalData = null) => {
        const duration = Date.now() - startTime;
        console.timeEnd(chalk.magenta(`[PERF] ${label}`));
        logger.info({ 
          message: `Performance: ${label}`, 
          duration: `${duration}ms`,
          data: additionalData,
          type: 'performance'
        });
        return duration;
      }
    };
  }
};

// HTTP request logging middleware
const httpLogger = (req, res, next) => {
  const startTime = Date.now();
  const originalSend = res.send;
  
  res.send = function(data) {
    const duration = Date.now() - startTime;
    logger.info({
      message: 'HTTP Request',
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      type: 'http'
    });
    
    return originalSend.call(this, data);
  };
  
  next();
};

// Database query logging
const dbLogger = (query, params = null, duration = null) => {
  logger.debug({
    message: 'Database Query',
    query: query,
    params: params,
    duration: duration ? `${duration}ms` : null,
    type: 'database'
  });
};

// System info logging
const logSystemInfo = () => {
  const systemInfo = {
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    pid: process.pid
  };
  
  logger.info({
    message: 'System Information',
    data: systemInfo,
    type: 'system'
  });
};

// Cleanup old logs (เรียกใช้เป็นระยะ)
const cleanupOldLogs = (daysToKeep = 30) => {
  const fs = require('fs');
  const path = require('path');
  
  try {
    const files = fs.readdirSync(logsDir);
    const now = Date.now();
    const maxAge = daysToKeep * 24 * 60 * 60 * 1000;
    
    files.forEach(file => {
      const filePath = path.join(logsDir, file);
      const stats = fs.statSync(filePath);
      
      if (now - stats.mtime.getTime() > maxAge) {
        fs.unlinkSync(filePath);
        info(`Deleted old log file: ${file}`);
      }
    });
  } catch (err) {
    error('Failed to cleanup old logs', err);
  }
};

module.exports = { 
  logger,
  debug, 
  info,
  success, 
  warn,
  error,
  performance,
  httpLogger,
  dbLogger,
  logSystemInfo,
  cleanupOldLogs,
  logLevel
};