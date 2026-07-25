#!/usr/bin/env node
import { exec } from 'child_process';
import { readFileSync } from 'fs';
import { fileURLToPath, URL } from 'url';
import { checkAndCreateConfig, getConfigDir, loadConfig } from './nodeutils/config.js';
import { callMaxScript, importMaxObject, importMaxPresentation, importMaxDomain, importMaxAutoKey, importMaxScript, importMaxAppInfo } from './nodeutils/maximoTools.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = new URL('.', import.meta.url).pathname;
const packageJson = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'));

const args = process.argv.slice(2);

// 解析全局选项（--env）
let globalEnv = 'local';
const filteredArgs = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--env' || args[i] === '-e') {
    globalEnv = args[i + 1];
    i++; // 跳过值
  } else {
    filteredArgs.push(args[i]);
  }
}

const cmd = filteredArgs[0];
const env = filteredArgs[0];

if (!cmd || ['-h', '--help', '-?', '--version', '-v'].includes(cmd)) {
  console.log(`sks-maximo v${packageJson.version}`);
  console.log('');
  console.log('用法:');
  console.log('  sks-maximo              # 检查配置文件并打开配置目录');
  console.log('  sks-maximo <env>        # 加载指定环境配置');
  console.log('  sks-maximo call <scriptName> [options]  # 调用脚本接口');
  console.log('  sks-maximo import-object <fileName>    # 导入 Maximo 对象配置');
  console.log('  sks-maximo import-appinfo <fileName>    # 导入应用信息配置');
  console.log('  sks-maximo import-presentation <fileName> # 导入应用XML配置');
  console.log('');
  console.log('环境:');
  console.log('  local                   # 使用本地环境配置');
  console.log('  dev                     # 使用开发环境配置');
  console.log('  hd                      # 使用测试环境配置');
  console.log('');
  console.log('命令:');
  console.log('  call                    # 调用通用脚本接口');
  console.log('  import-object           # 导入 Maximo 对象配置');
  console.log('  import-appinfo          # 导入应用信息配置');
  console.log('  import-presentation     # 导入应用XML配置');
  console.log('');
  console.log('选项:');
  console.log('  -h, --help              # 显示帮助信息');
  console.log('  -v, --version           # 显示版本信息');
  console.log('  --env, -e <env>         # 指定环境（默认 local）');
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
  
  loadConfig(globalEnv);
  
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
} else if (cmd === 'import-object') {
  const fileName = filteredArgs[1];
  if (!fileName) {
    console.error('错误: 请指定 JSON 文件路径');
    console.log('用法: sks-maximo import-object <fileName> [-e env]');
    process.exit(1);
  }
  loadConfig(globalEnv);
  (async () => {
    try {
      const result = await importMaxObject({ fileName, logname: fileName });
      if (result) {
        console.log('导入成功');
      } else {
        console.error('导入失败');
        process.exit(1);
      }
    } catch (error) {
      console.error('导入出错:', error.message);
      process.exit(1);
    }
  })();
} else if (cmd === 'import-appinfo') {
  const fileName = filteredArgs[1];
  if (!fileName) {
    console.error('错误: 请指定 JSON 文件路径');
    console.log('用法: sks-maximo import-appinfo <fileName> [-e env] [-l logname]');
    process.exit(1);
  }
  let logname = null;
  for (let i = 2; i < filteredArgs.length; i++) {
    if (filteredArgs[i] === '--logname' || filteredArgs[i] === '-l') {
      logname = filteredArgs[i + 1];
      i++;
    }
  }
  loadConfig(globalEnv);
  (async () => {
    try {
      const result = await importMaxAppInfo({ fileName, logname: logname || fileName });
      if (result) {
        console.log('导入成功');
      } else {
        console.error('导入失败');
        process.exit(1);
      }
    } catch (error) {
      console.error('导入出错:', error.message);
      process.exit(1);
    }
  })();
} else if (cmd === 'import-presentation') {
  const fileName = filteredArgs[1];
  if (!fileName) {
    console.error('错误: 请指定 XML 文件路径');
    console.log('用法: sks-maximo import-presentation <fileName> [-e env] [-l logname]');
    process.exit(1);
  }
  let logname = null;
  for (let i = 2; i < filteredArgs.length; i++) {
    if (filteredArgs[i] === '--logname' || filteredArgs[i] === '-l') {
      logname = filteredArgs[i + 1];
      i++;
    }
  }
  loadConfig(globalEnv);
  (async () => {
    try {
      const result = await importMaxPresentation({ fileName, logname: logname || fileName });
      if (result) {
        console.log('导入成功');
      } else {
        console.error('导入失败');
        process.exit(1);
      }
    } catch (error) {
      console.error('导入出错:', error.message);
      process.exit(1);
    }
  })();
} else {
  loadConfig(globalEnv);
}

export * from './nodeutils/maximoTools.js';
export * from './nodeutils/mockdataTools.js';
export * from './nodeutils/fileUtils.js';
export { default as logger } from './nodeutils/logger.js';
export { default as request } from './nodeutils/requestHttp.js';