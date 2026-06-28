import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './logger.js';

// 获取当前模块目录
const __dirname = path.dirname(fileURLToPath(import.meta.url));

let globalConfig = null;

function getConfigPath() {
  const homeDir = os.homedir();
  return path.join(homeDir, '.sks', 'nodeutils', 'config.json');
}

export function getConfigDir() {
  return path.dirname(getConfigPath());
}

// 检查配置文件是否存在，不存在则创建
export function checkAndCreateConfig() {
  const configPath = getConfigPath();
  const configDir = getConfigDir();

  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  if (!fs.existsSync(configPath)) {
    copySampleConfig(configPath);
  }

  return configPath;
}

export function loadConfig(env = null) {
  const configPath = getConfigPath();

  if (!env) {
    const args = process.argv.slice(2);
    env = args[0] || 'local';
  }

  try {
    const configDir = path.dirname(configPath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    if (!fs.existsSync(configPath)) {
      logger.warn(`配置文件不存在: ${configPath}，将复制示例配置`);
      copySampleConfig(configPath);
    }

    const configData = fs.readFileSync(configPath, 'utf-8');
    const allConfigs = JSON.parse(configData);

    // 获取全局配置
    const globalLogLevel = allConfigs.logLevel || 'INFO';

    // 获取环境配置
    const envs = allConfigs.envs || {};
    const envConfig = envs[env] || envs.local || envs.dev;

    if (!envConfig) {
      throw new Error(`未找到环境 ${env} 的配置`);
    }

    // 合并配置：环境配置优先于全局配置
    globalConfig = { ...envConfig };

    // 设置默认 authType
    if (!globalConfig.authType) {
      globalConfig.authType = 'apiKey';
    }

    // logLevel 优先使用环境配置，否则使用全局配置
    const logLevel = envConfig.logLevel || globalLogLevel;

    // 规范化 baseUrl
    if (globalConfig.baseUrl) {
      globalConfig.baseUrl = globalConfig.baseUrl.replace(/\\/g, '/');
      if (!globalConfig.baseUrl.endsWith('/')) {
        globalConfig.baseUrl += '/';
      }
    }

    logger.setLevel(logLevel);
    logger.info(`[Config] 已加载配置，环境: ${env}, 日志级别: ${logLevel}`);

    return globalConfig;
  } catch (error) {
    logger.error(`[Config] 加载配置文件失败: ${error.message}`);
    throw error;
  }
}

function copySampleConfig(configPath) {
  const sampleConfigPath = path.join(__dirname, 'sample.config.json');

  const configDir = path.dirname(configPath);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  if (fs.existsSync(sampleConfigPath)) {
    fs.copyFileSync(sampleConfigPath, configPath);
    logger.info(`[Config] 已复制示例配置文件到: ${configPath}`);
  } else {
    // 如果 sample.config.json 不存在，创建默认配置
    const defaultConfig = {
      "logLevel": "INFO",
      "envs": {
        "local": {
          "baseUrl": "http://127.0.0.1:9080/maximo",
          "apiKey": "your-api-key-here",
          "maxauth": ""
        },
        "dev": {
          "baseUrl": "https://mdev/maximo",
          "apiKey": "your-api-key-here",
          "maxauth": ""
        },
        "hd": {
          "baseUrl": "http://xxxxx:9080/maximo",
          "apiKey": "your-api-key-here",
          "maxauth": ""
        }
      }
    };
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), 'utf-8');
    logger.info(`[Config] 已创建默认配置文件: ${configPath}`);
  }
}

export function getConfig() {
  if (!globalConfig) {
    return loadConfig();
  }
  return globalConfig;
}

export function getWorkDir() {
  return process.cwd();
}

export default {
  loadConfig,
  getConfig,
  getWorkDir,
  getConfigDir,
  checkAndCreateConfig
};