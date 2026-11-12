#!/usr/bin/env node
import { exec } from 'child_process';
import { readFileSync } from 'fs';
import { fileURLToPath, URL } from 'url';
import { checkAndCreateConfig, getConfigDir, loadConfig } from './nodeutils/config.js';
import { loadImportConfig, getImportConfigItem } from './nodeutils/importConfig.js';
import { callMaxScript, importMaxObject, importMaxObjectV1, importMaxMessage, importMaxWorkflow, importMaxPresentation, importMaxDomain, importMaxAutoKey, importMaxScript, importMaxAppInfo, importMaxAppInfoV1, importMaxIntObject } from './nodeutils/maximoTools.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = new URL('.', import.meta.url).pathname;
const packageJson = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'));

const args = process.argv.slice(2);

// 解析全局选项（--env, --web, --port）
let globalEnv = 'local';
let envSpecified = false;
let webMode = false;
let webPort = 8080;
const filteredArgs = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--env' || args[i] === '-e') {
    globalEnv = args[i + 1];
    envSpecified = true;
    i++; // 跳过值
  } else if (args[i] === '--web' || args[i] === '-web') {
    webMode = true;
  } else if (args[i] === '--port' || args[i] === '-p') {
    webPort = parseInt(args[i + 1]) || 8080;
    i++; // 跳过值
  } else {
    filteredArgs.push(args[i]);
  }
}

// 解析导入命令的 --params（JSON 格式的 URL 参数，会合并进接口请求）
let urlParams = {};
const paramsIndex = filteredArgs.indexOf('--params');
if (paramsIndex > -1) {
  const rawParams = filteredArgs[paramsIndex + 1];
  if (rawParams && !rawParams.startsWith('-')) {
    try {
      urlParams = JSON.parse(rawParams);
      filteredArgs.splice(paramsIndex, 2);
    } catch (e) {
      console.error(`参数解析失败: ${e.message}`);
      process.exit(1);
    }
  } else {
    filteredArgs.splice(paramsIndex, 1);
  }
}

const cmd = filteredArgs[0];

/**
 * 统一打印新模式接口的导入结果
 * @param {Object} result 接口响应（{ status, message, data }）
 * @param {string} unit 根级单位，如“个对象”“条消息”
 */
function printImportResult(result, unit) {
  const data = result.data || result || {};
  // 工作流等脚本返回 summary:{total,success,failed}
  if (data.summary) {
    const s = data.summary;
    console.log(`共 ${s.total ?? 0} ${unit}，成功 ${s.success ?? 0}，失败 ${s.failed ?? 0}`);
    return;
  }
  const success = data['sks:successSumTotal'] ?? 0;
  const ignore = data['sks:ignoreSumTotal'] ?? 0;
  const fail = data['sks:failSumTotal'] ?? 0;
  const counts = [];
  if (data.total !== undefined) counts.push(`共 ${data.total} ${unit}`);
  if (data.added !== undefined) counts.push(`新增 ${data.added}`);
  if (data.updated !== undefined) counts.push(`更新 ${data.updated}`);
  if (data.deleted !== undefined) counts.push(`删除 ${data.deleted}`);
  if (data.skipped !== undefined) counts.push(`跳过 ${data.skipped}`);
  if (data.failed !== undefined) counts.push(`失败 ${data.failed}`);
  if (counts.length) {
    console.log(counts.join('，'));
  }
  console.log(`总计 成功 ${success}，忽略 ${ignore}，失败 ${fail}`);
}


// 兼容位置参数写法：sks-maximo import-xxx <fileName> <env>
const importCommands = ['import-object', 'import-object-v2', 'import-message', 'import-workflow', 'import-appinfo', 'import-appinfo-v1', 'import-presentation', 'import-script', 'import-domain', 'import-maxintobject', 'import-autokey'];
if (!envSpecified && importCommands.includes(cmd)) {
  const positionalEnv = filteredArgs[2];
  if (positionalEnv && !positionalEnv.startsWith('-')) {
    globalEnv = positionalEnv;
  }
}

if (!cmd && !webMode || ['-h', '--help', '-?', '--version', '-v'].includes(cmd)) {
  console.log(`sks-maximo v${packageJson.version}`);
  console.log('');
  console.log('用法:');
  console.log('  sks-maximo              # 检查配置文件并打开配置目录');
  console.log('  sks-maximo <env>        # 加载指定环境配置');
  console.log('  sks-maximo -web -e hd   # 启动 Web UI');
  console.log('  sks-maximo call <scriptName> [options]  # 调用脚本接口');
  console.log('  sks-maximo import-object <fileName>    # 导入 Maximo 对象配置(旧版接口 SKS.AUTOSCRIPT.LIBRARY)');
  console.log('  sks-maximo import-object-v2 <fileName> # 导入 Maximo 对象配置(新模式 SKS_MIGRATEAPI_CONFIGUR)');
  console.log('  sks-maximo import-message <fileName>   # 导入消息配置(新模式 SKS_MIGRATEAPI_MAXMESSAGES)');
  console.log('  sks-maximo import-workflow <fileName>  # 导入工作流(SKS.AUTOSCRIPT.WORKFLOW)');
  console.log('  sks-maximo import-appinfo <fileName>   # 导入应用信息配置(新接口)');
  console.log('  sks-maximo import-appinfo-v1 <fileName> # 导入应用信息配置(旧版接口)');
  console.log('  sks-maximo import-presentation <fileName> # 导入应用XML配置');
  console.log('  sks-maximo import-script <fileName>    # 导入自动化脚本');
  console.log('  sks-maximo import-domain <fileName>    # 导入域配置');
  console.log('  sks-maximo import-maxintobject <fileName> # 导入对象结构(Integration Object)配置');
  console.log('  sks-maximo import-autokey <fileName>   # 导入自动编码(AutoKey)配置');
  console.log('  sks-maximo import-params [命令/方法名]    # 查看导入接口参数说明');
  console.log('');
  console.log('环境:');
  console.log('  local                   # 使用本地环境配置');
  console.log('  dev                     # 使用开发环境配置');
  console.log('  hd                      # 使用测试环境配置');
  console.log('');
  console.log('命令:');
  console.log('  call                    # 调用通用脚本接口');
  console.log('  import-object           # 导入 Maximo 对象配置(旧版接口 importMaxObjectV1)');
  console.log('  import-object-v2        # 导入 Maximo 对象配置(新模式 SKS_MIGRATEAPI_CONFIGUR)');
  console.log('  import-message          # 导入消息配置(新模式 SKS_MIGRATEAPI_MAXMESSAGES)');
  console.log('  import-workflow         # 导入工作流(SKS.AUTOSCRIPT.WORKFLOW)');
  console.log('  import-appinfo          # 导入应用信息配置(新接口 importMaxAppInfo)');
  console.log('  import-appinfo-v1       # 导入应用信息配置(旧版接口 importMaxAppInfoV1)');
  console.log('  import-presentation     # 导入应用XML配置');
  console.log('  import-script           # 导入自动化脚本');
  console.log('  import-domain           # 导入域配置');
  console.log('  import-maxintobject     # 导入对象结构(Integration Object)配置');
  console.log('  import-autokey          # 导入自动编码(AutoKey)配置');
  console.log('  import-params           # 查看导入接口参数说明');
  console.log('');
  console.log('选项:');
  console.log('  -h, --help              # 显示帮助信息');
  console.log('  -v, --version           # 显示版本信息');
  console.log('  --env, -e <env>         # 指定环境（直接输入sks-maximo 可进行打开配置目录）');
  console.log('  --web, -web             # 启动 Web UI');
  console.log('  --port, -p <port>       # Web UI 端口（默认 8080）');
  console.log('  --file <fileName>       # 请求体文件路径（JSON）');
  console.log('  --params <params>       # 导入命令的 URL 参数（JSON格式，如 \'{"dmDeploySet":true}\'）');
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
} else if (webMode) {
  // Web UI 模式
  import('./web/server/index.js').then(({ startWebServer }) => {
    startWebServer({ env: globalEnv, port: webPort });
  }).catch(err => {
    console.error('启动 Web 服务失败:', err.message);
    process.exit(1);
  });
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
      const response = await callMaxScript({ apiScriptName: scriptName, fileName, params, logname, urlParams });
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
} else if (cmd === 'import-object-v2') {
  const fileName = filteredArgs[1];
  if (!fileName) {
    console.error('错误: 请指定 JSON 文件路径');
    console.log('用法: sks-maximo import-object-v2 <fileName> [-e env] [-l logname]');
    process.exit(1);
  }
  let logname = null;
  let dmDeploySet = false;
  for (let i = 2; i < filteredArgs.length; i++) {
    if (filteredArgs[i] === '--logname' || filteredArgs[i] === '-l') {
      logname = filteredArgs[i + 1];
      i++;
    } else if (filteredArgs[i] === '--dm-deploy-set') {
      dmDeploySet = true;
    }
  }
  loadConfig(globalEnv);
  (async () => {
    try {
      const result = await importMaxObject({ fileName, logname: logname || fileName, dmDeploySet, urlParams });
      if (result && result.status !== 'error') {
        console.log(result.message || '导入成功');
        printImportResult(result, '个对象');
      } else {
        console.error(result && result.message ? `导入失败: ${result.message}` : '导入失败');
        process.exit(1);
      }
    } catch (error) {
      console.error('导入出错:', error.message);
      process.exit(1);
    }
  })();
} else if (cmd === 'import-message') {
  const fileName = filteredArgs[1];
  if (!fileName) {
    console.error('错误: 请指定 JSON 文件路径');
    console.log('用法: sks-maximo import-message <fileName> [-e env] [-l logname] [--all-langcode] [--dm-deploy-set]');
    process.exit(1);
  }
  let logname = null;
  let dmDeploySet = false;
  let allLangcode = false;
  for (let i = 2; i < filteredArgs.length; i++) {
    if (filteredArgs[i] === '--logname' || filteredArgs[i] === '-l') {
      logname = filteredArgs[i + 1];
      i++;
    } else if (filteredArgs[i] === '--dm-deploy-set') {
      dmDeploySet = true;
    } else if (filteredArgs[i] === '--all-langcode') {
      allLangcode = true;
    }
  }
  loadConfig(globalEnv);
  (async () => {
    try {
      const result = await importMaxMessage({ fileName, logname: logname || fileName, dmDeploySet, allLangcode, urlParams });
      if (result && result.status !== 'error') {
        console.log(result.message || '导入成功');
        printImportResult(result, '条消息');
      } else {
        console.error(result && result.message ? `导入失败: ${result.message}` : '导入失败');
        process.exit(1);
      }
    } catch (error) {
      console.error('导入出错:', error.message);
      process.exit(1);
    }
  })();
} else if (cmd === 'import-workflow') {
  const fileName = filteredArgs[1];
  if (!fileName) {
    console.error('错误: 请指定 JSON 文件路径');
    console.log('用法: sks-maximo import-workflow <fileName> [-e env] [-l logname] [--imp-mode add|migration] [--disable] [--type workflows|actions|maxroles]');
    process.exit(1);
  }
  let logname = null;
  let impMode = 'add';
  let enable = true;
  let type = 'workflows';
  for (let i = 2; i < filteredArgs.length; i++) {
    const arg = filteredArgs[i];
    if (arg === '--logname' || arg === '-l') {
      logname = filteredArgs[i + 1];
      i++;
    } else if (arg === '--imp-mode') {
      impMode = filteredArgs[i + 1];
      i++;
    } else if (arg === '--enable') {
      enable = filteredArgs[i + 1] !== 'false';
      i++;
    } else if (arg === '--disable') {
      enable = false;
    } else if (arg === '--type') {
      type = filteredArgs[i + 1];
      i++;
    }
  }
  loadConfig(globalEnv);
  (async () => {
    try {
      const result = await importMaxWorkflow({ fileName, logname: logname || fileName, type, impMode, enable, urlParams });
      if (result && result.status !== 'error') {
        console.log(result.message || '导入成功');
        printImportResult(result, '个工作流');
        const failedRows = [];
        ['actions', 'maxroles', 'workflows'].forEach(section => {
          const sec = result[section];
          if (sec && Array.isArray(sec.result)) failedRows.push(...sec.result);
        });
        if (Array.isArray(result.result)) failedRows.push(...result.result);
        failedRows.filter(r => r && r.status === 'FAILED').forEach(r => {
          const name = r.processName || r.action || r.maxrole || r.id || '未知';
          console.error(`  - ${name}${r.processRev !== undefined ? `(${r.processRev})` : ''}: ${r.message || '失败'}`);
        });
      } else {
        console.error(result && result.message ? `导入失败: ${result.message}` : '导入失败');
        process.exit(1);
      }
    } catch (error) {
      console.error('导入出错:', error.message);
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
      const result = await importMaxObjectV1({ fileName, logname: fileName, urlParams });
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
      const result = await importMaxAppInfo({ fileName, logname: logname || fileName, urlParams });
      if (result && result.status !== 'error') {
        console.log(result.message || '导入成功');
        console.log(`成功 ${result['sks:successSumTotal'] ?? 0}，失败 ${result['sks:failSumTotal'] ?? 0}`);
      } else {
        console.error(result && result.message ? `导入失败: ${result.message}` : '导入失败');
        process.exit(1);
      }
    } catch (error) {
      console.error('导入出错:', error.message);
      process.exit(1);
    }
  })();
} else if (cmd === 'import-appinfo-v1') {
  const fileName = filteredArgs[1];
  if (!fileName) {
    console.error('错误: 请指定 JSON 文件路径');
    console.log('用法: sks-maximo import-appinfo-v1 <fileName> [-e env] [-l logname]');
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
      const result = await importMaxAppInfoV1({ fileName, logname: logname || fileName, urlParams });
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
      const result = await importMaxPresentation({ fileName, logname: logname || fileName, urlParams });
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
} else if (cmd === 'import-script') {
  const fileName = filteredArgs[1];
  if (!fileName) {
    console.error('错误: 请指定脚本 JSON 配置文件路径');
    console.log('用法: sks-maximo import-script <fileName> [-e env] [-l logname]');
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
      const result = await importMaxScript({ fileName, logname: logname || fileName, urlParams });
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
} else if (cmd === 'import-domain') {
  const fileName = filteredArgs[1];
  if (!fileName) {
    console.error('错误: 请指定域 JSON 文件路径');
    console.log('用法: sks-maximo import-domain <fileName> [-e env] [-l logname]');
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
      const result = await importMaxDomain({ fileName, logname: logname || fileName, urlParams });
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
} else if (cmd === 'import-maxintobject') {
  const fileName = filteredArgs[1];
  if (!fileName) {
    console.error('错误: 请指定对象结构 JSON 文件路径');
    console.log('用法: sks-maximo import-maxintobject <fileName> [-e env] [-l logname]');
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
      const result = await importMaxIntObject({ fileName, logname: logname || fileName, urlParams });
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
} else if (cmd === 'import-autokey') {
  const fileName = filteredArgs[1];
  if (!fileName) {
    console.error('错误: 请指定 AutoKey JSON 文件路径');
    console.log('用法: sks-maximo import-autokey <fileName> [-e env] [-l logname]');
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
      const result = await importMaxAutoKey({ fileName, logname: logname || fileName, urlParams });
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
} else if (cmd === 'import-params') {
  const config = loadImportConfig();
  const target = filteredArgs[1];

  if (!target) {
    console.log('可用的导入接口：');
    for (const item of Object.values(config)) {
      const cmdName = item.command || '-';
      console.log(`  ${cmdName.padEnd(24)} ${item.key.padEnd(24)} ${item.title || ''}`);
    }
    console.log('');
    console.log('用法: sks-maximo import-params <命令或方法名>');
    process.exit(0);
  }

  const item = getImportConfigItem(target);
  if (!item) {
    console.error(`未找到配置: ${target}`);
    console.log('使用 sks-maximo import-params 查看可用接口');
    process.exit(1);
  }

  console.log(item.title || item.key);
  console.log(`方法: ${item.key}${item.command ? `  命令: ${item.command}` : ''}`);
  console.log(`接口: ${item.interface || '-'}`);
  console.log('');

  if (Array.isArray(item.params) && item.params.length > 0) {
    console.log('URL 参数:');
    for (const p of item.params) {
      console.log(`  ${String(p.name).padEnd(20)} ${String(p.type).padEnd(10)} 默认: ${String(p.default)}`);
      if (p.description) {
        console.log(`    ${p.description}`);
      }
    }
    console.log('');
  }

  if (item.remarkContent) {
    console.log('详细说明:');
    console.log(item.remarkContent);
  }
} else {
  console.error(`不支持的命令: ${cmd}`);
  console.log('使用 sks-maximo --help 查看帮助信息');
  process.exit(1);
}

export * from './nodeutils/maximoTools.js';
export * from './nodeutils/mockdataTools.js';
export * from './nodeutils/fileUtils.js';
export { default as logger } from './nodeutils/logger.js';
export { default as request } from './nodeutils/requestHttp.js';