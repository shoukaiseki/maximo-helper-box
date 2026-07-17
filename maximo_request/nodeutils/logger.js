// logger.js
const LEVELS = {
  TRACE: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  FATAL: 5
};

// 颜色定义
const COLORS = {
  TRACE: '\x1b[90m',  // 灰色
  DEBUG: '\x1b[36m',  // 青色
  INFO:  '\x1b[32m',  // 绿色
  WARN:  '\x1b[33m',  // 黄色
  ERROR: '\x1b[31m',  // 红色
  FATAL: '\x1b[1;31m' // 粗体红
};
const RESET = '\x1b[0m';

class ConsoleLogger {
  constructor(level = 'INFO') {
    this.level = LEVELS[level] !== undefined ? LEVELS[level] : LEVELS.INFO;
  }

  // 设置日志级别
  setLevel(level) {
    if (LEVELS[level] !== undefined) {
      this.level = LEVELS[level];
    } else {
      console.warn(`无效的日志级别: ${level}，保持当前级别`);
    }
  }

  // 核心打印方法
  _print(levelName, levelValue, args) {
    if (levelValue < this.level) return;

    const timestamp = new Date().toLocaleTimeString();
    const color = COLORS[levelName] || '';
    const prefix = `${color}[${timestamp}] [${levelName}]${RESET}`;

    switch (levelValue) {
      case LEVELS.TRACE:
      case LEVELS.DEBUG:
      case LEVELS.INFO:
        console.log(prefix, ...args);
        break;
      case LEVELS.WARN:
        console.warn(prefix, ...args);
        break;
      case LEVELS.ERROR:
      case LEVELS.FATAL:
        console.error(prefix, ...args);
        break;
    }
  }

  trace(...args) { this._print('TRACE', LEVELS.TRACE, args); }
  debug(...args) { this._print('DEBUG', LEVELS.DEBUG, args); }
  info(...args)  { this._print('INFO', LEVELS.INFO, args); }
  warn(...args)  { this._print('WARN', LEVELS.WARN, args); }
  error(...args) { this._print('ERROR', LEVELS.ERROR, args); }
  fatal(...args) { this._print('FATAL', LEVELS.FATAL, args); }
}

const logger = new ConsoleLogger('INFO'); // 默认导出一个实例，级别为 INFO
export default logger
