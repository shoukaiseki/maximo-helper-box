#!/usr/bin/env node
import { exec } from 'child_process';
import { checkAndCreateConfig, getConfigDir, loadConfig } from './nodeutils/config.js';

const args = process.argv.slice(2);
const env = args[0];

if (!env || ['-h', '--help', '-?', '--version', '-v'].includes(env)) {
  console.log(`sks-maximo v${require('./package.json').version}`);
  console.log('');
  console.log('用法:');
  console.log('  sks-maximo              # 检查配置文件并打开配置目录');
  console.log('  sks-maximo <env>        # 加载指定环境配置');
  console.log('');
  console.log('环境:');
  console.log('  local                   # 使用本地环境配置');
  console.log('  dev                     # 使用开发环境配置');
  console.log('  hd                      # 使用测试环境配置');
  console.log('');
  console.log('选项:');
  console.log('  -h, --help              # 显示帮助信息');
  console.log('  -v, --version           # 显示版本信息');
  console.log('');
  console.log('配置文件位置: ~/.sks/nodeutils/config.json');
  
  if (!env) {
    const configPath = checkAndCreateConfig();
    const configDir = getConfigDir();
    
    console.log(`\n配置文件位置: ${configPath}`);
    console.log(`正在打开配置目录...`);
    
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
  }
} else {
  loadConfig(env);
}

export * from './nodeutils/maximoTools.js';
export * from './nodeutils/mockdataTools.js';
export * from './nodeutils/fileUtils.js';
export { default as logger } from './nodeutils/logger.js';
export { default as request } from './nodeutils/requestHttp.js';