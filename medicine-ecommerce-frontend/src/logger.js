import { logService } from './services/logService';

const LOG_LEVELS = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
};

class Logger {
  info(message, ...args) {
    console.log(`[INFO] ${message}`, ...args);
    // Info logs are too noisy for server, mostly keep local
  }

  warn(message, ...args) {
    console.warn(`[WARN] ${message}`, ...args);
    this.shipToServer(LOG_LEVELS.WARN, message, args);
  }

  error(message, ...args) {
    console.error(`[ERROR] ${message}`, ...args);
    this.shipToServer(LOG_LEVELS.ERROR, message, args);
  }

  // Helper to send log to backend
  shipToServer(level, message, args) {
    try {
      // Convert args to string if object
      const details = args.length > 0 ? JSON.stringify(args) : '';
      const fullMessage = `${message} ${details}`;
      
      logService.logFrontendError(level, fullMessage);
    } catch (e) {
      // Fail silently to avoid infinite loops
      console.error('Logger failed to ship:', e);
    }
  }
}

export const logger = new Logger();
