#!/usr/bin/env node
import { exec } from 'child_process';
import { checkAndCreateConfig, getConfigDir, loadConfig } from './nodeutils/config.js';

const args = process.argv.slice(2);
const env = args[0];

if (!env) {
  // 不带参数：检查配置并打开目录
  const configPath = checkAndCreateConfig();
  const configDir = getConfigDir();
  
  console.log(`配置文件位置: ${configPath}`);
  console.log(`正在打开配置目录...`);
  
  // 根据操作系统打开目录
  const platform = process.platform;
  let command;
  
  if (platform === 'win32') {
    command = `explorer "${configDir}"`;
  } else if (platform === 'darwin') {
    command = `open "${configDir}"`;
  } else {
    command = `xdg-open "${configDir}"`;
  }
  
  exec(command, (error) => {
    if (error) {
      console.error(`打开目录失败: ${error.message}`);
      console.log(`请手动打开: ${configDir}`);
    }
  });
} else {
  // 带参数：加载配置
  loadConfig(env);
}

export * from './nodeutils/maximoTools.js';
export * from './nodeutils/mockdataTools.js';
export * from './nodeutils/fileUtils.js';
export { default as logger } from './nodeutils/logger.js';
export { default as request } from './nodeutils/requestHttp.js';