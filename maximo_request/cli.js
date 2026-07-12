#!/usr/bin/env node
import { exec } from 'child_process';
import { readFileSync } from 'fs';
import { fileURLToPath, URL } from 'url';
import { checkAndCreateConfig, getConfigDir, loadConfig } from './nodeutils/config.js';
import { callMaxScript } from './nodeutils/maximoTools.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = new URL('.', import.meta.url).pathname;
const packageJson = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'));

const args = process.argv.slice(2);
const cmd = args[0];
const env = args[0];

if (!cmd || ['-h', '--help', '-?', '--version', '-v'].includes(cmd)) {
  console.log(`sks-maximo v${packageJson.version}`);
  console.log('');
  console.log('用法:');
  console.log('  sks-maximo              # 检查配置文件并打开配置目录');
  console.log('  sks-maximo <env>        # 加载指定环境配置');
  console.log('  sks-maximo call <scriptName> [--file <fileName>] [--params <params>]  # 调用脚本接口');
  console.log('');
  console.log('环境:');
  console.log('  local                   # 使用本地环境配置');
  console.log('  dev                     # 使用开发环境配置');
  console.log('  hd                      # 使用测试环境配置');
  console.log('');
  console.log('命令:');
  console.log('  call                    # 调用通用脚本接口');
  console.log('');
  console.log('选项:');
  console.log('  -h, --help              # 显示帮助信息');
  console.log('  -v, --version           # 显示版本信息');
  console.log('  --file <fileName>       # 请求体文件路径（JSON）');
  console.log('  --params <params>       # URL参数（JSON格式）');
  console.log('');
  console.log('配置文件位置: ~/.sks/nodeutils/config.json');
  
  if (!cmd) {
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
} else if (cmd === 'call') {
  const scriptName = args[1];
  
  if (!scriptName) {
    console.error('错误: 请指定脚本名称');
    console.log('用法: sks-maximo call <scriptName> [--file <fileName>] [--params <params>]');
    process.exit(1);
  }
  
  let fileName = null;
  let params = {};
  let logname = null;
  
  for (let i = 2; i < args.length; i++) {
    if (args[i] === '--file' || args[i] === '-f') {
      fileName = args[i + 1];
      i++;
    } else if (args[i] === '--params' || args[i] === '-p') {
      try {
        params = JSON.parse(args[i + 1]);
      } catch (e) {
        console.error(`参数解析失败: ${e.message}`);
        process.exit(1);
      }
      i++;
    } else if (args[i] === '--logname' || args[i] === '-l') {
      logname = args[i + 1];
      i++;
    }
  }
  
  loadConfig('local');
  
  (async () => {
    try {
      const response = await callMaxScript({ apiScriptName: scriptName, fileName, params, logname });
      if (response) {
        console.log('响应:', JSON.stringify(response, null, 2));
      } else {
        console.error('调用失败');
        process.exit(1);
      }
    } catch (error) {
      console.error('调用出错:', error.message);
      process.exit(1);
    }
  })();
} else {
  loadConfig(env);
}

export * from './nodeutils/maximoTools.js';
export * from './nodeutils/mockdataTools.js';
export * from './nodeutils/fileUtils.js';
export { default as logger } from './nodeutils/logger.js';
export { default as request } from './nodeutils/requestHttp.js';