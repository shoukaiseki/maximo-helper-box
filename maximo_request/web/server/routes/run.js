import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { loadConfig } from '../../../nodeutils/config.js';
import {
  importMaxObject,
  importMaxPresentation,
  importMaxDomain,
  importMaxAutoKey,
  importMaxScript,
  importMaxAppInfo,
  importMaxIntObject,
  importMaxMessage,
  importMaxWorkflow,
  batchImport
} from '../../../nodeutils/maximoTools.js';

export const runRouter = Router();

// 导入类型映射
const IMPORT_TYPE_MAP = {
  object: { fn: importMaxObject, ext: '.json' },
  presentation: { fn: importMaxPresentation, ext: '.xml' },
  domain: { fn: importMaxDomain, ext: '.json' },
  autokey: { fn: importMaxAutoKey, ext: '.json' },
  script: { fn: importMaxScript, ext: '.json' },
  appinfo: { fn: importMaxAppInfo, ext: '.json' },
  intobject: { fn: importMaxIntObject, ext: '.json' },
  message: { fn: importMaxMessage, ext: '.json' },
  workflow: { fn: importMaxWorkflow, ext: '.json' }
};

// 当前运行状态
let currentRun = null;

/**
 * POST /api/run
 * 执行单个任务或整个计划
 */
runRouter.post('/', async (req, res) => {
  try {
    const { env, tasks, concurrency = 1 } = req.body;
    
    if (!env) {
      return res.status(400).json({
        success: false,
        message: '环境不能为空'
      });
    }
    
    if (!tasks || tasks.length === 0) {
      return res.status(400).json({
        success: false,
        message: '任务列表不能为空'
      });
    }
    
    // 加载环境配置
    loadConfig(env);
    
    // 如果有正在运行的任务，拒绝新请求
    if (currentRun && !currentRun.stopped) {
      return res.status(409).json({
        success: false,
        message: '已有任务正在运行，请先停止当前任务'
      });
    }
    
    // 创建运行状态
    currentRun = {
      env,
      tasks,
      concurrency,
      stopped: false,
      startTime: Date.now(),
      results: [],
      logs: []
    };
    
    // 返回 SSE 流
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    
    // 发送初始状态
    sendEvent(res, 'start', {
      env,
      totalTasks: tasks.length,
      startTime: currentRun.startTime
    });
    
    // 执行任务
    await executeTasks(currentRun, res);
    
    // 发送完成事件
    sendEvent(res, 'complete', {
      results: currentRun.results,
      duration: Date.now() - currentRun.startTime
    });
    
    res.end();
    currentRun = null;
    
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    } else {
      sendEvent(res, 'error', { message: error.message });
      res.end();
    }
  }
});

/**
 * POST /api/stop
 * 停止当前计划
 */
runRouter.post('/stop', (req, res) => {
  if (currentRun && !currentRun.stopped) {
    currentRun.stopped = true;
    res.json({
      success: true,
      message: '任务已停止'
    });
  } else {
    res.json({
      success: true,
      message: '没有正在运行的任务'
    });
  }
});

/**
 * 执行任务列表
 */
async function executeTasks(run, res) {
  for (let i = 0; i < run.tasks.length; i++) {
    if (run.stopped) {
      sendEvent(res, 'taskSkipped', { index: i, reason: '用户停止' });
      continue;
    }
    
    const task = run.tasks[i];
    if (!task.enabled) {
      sendEvent(res, 'taskSkipped', { index: i, reason: '已禁用' });
      continue;
    }
    
    sendEvent(res, 'taskStart', { index: i, task });
    
    try {
      const result = await executeTask(task, run, res, i);
      run.results.push({ index: i, task, ...result });
      sendEvent(res, 'taskComplete', { index: i, result });
    } catch (error) {
      run.results.push({ index: i, task, error: error.message });
      sendEvent(res, 'taskError', { index: i, error: error.message });
    }
  }
}

/**
 * 执行单个任务
 */
async function executeTask(task, run, res, taskIndex) {
  const { importType, path: taskPath, extFilter, recursive, logname, options = {}, urlParams = {} } = task;
  
  const typeConfig = IMPORT_TYPE_MAP[importType];
  if (!typeConfig) {
    throw new Error(`不支持的导入类型: ${importType}`);
  }
  
  // 扫描文件
  const files = scanFiles(taskPath, extFilter || typeConfig.ext, recursive);
  
  // 通知前端该任务的文件总数
  sendEvent(res, 'taskScan', { index: taskIndex, totalFiles: files.length });
  
  if (files.length === 0) {
    return {
      success: true,
      total: 0,
      successCount: 0,
      failedCount: 0,
      files: []
    };
  }
  
  // 使用 batchImport 批量导入
  const stats = await batchImport({
    files: files.map(f => f.path),
    logname: logname || task.importType,
    urlParams,
    importFn: async ({ fileName, urlParams: fnUrlParams }) => {
      if (run.stopped) {
        throw new Error('任务已停止');
      }
      
      try {
        const result = await typeConfig.fn({
          fileName,
          logname: logname || fileName,
          ...options,
          urlParams: fnUrlParams
        });
        
        const ok = result !== null && result !== false && result !== undefined
          && !(typeof result === 'object' && result.status === 'error');

        sendEvent(res, 'fileProgress', {
          index: taskIndex,
          fileName,
          ...buildFileResult(result, ok)
        });
        
        return ok ? result : false;
      } catch (error) {
        sendEvent(res, 'fileProgress', {
          index: taskIndex,
          fileName,
          status: 'error',
          message: error.message,
          data: null
        });
        throw error;
      }
    },
    concurrency: run.concurrency
  });
  
  if (!stats) {
    return {
      success: false,
      total: files.length,
      successCount: 0,
      failedCount: files.length,
      failedFiles: files.map(f => f.path)
    };
  }
  
  return {
    success: stats.failCount === 0,
    total: stats.fileCount,
    successCount: stats.successCount,
    failedCount: stats.failCount,
    failedFiles: stats.failList,
    duration: stats.totalTime
  };
}

/**
 * 按「新模式通用文档」的统一返回格式整理单个文件的导入结果：
 * { fileName, status, message, data: { total, added, updated, skipped, failed,
 *   'sks:successSumTotal', 'sks:failSumTotal', 'sks:ignoreSumTotal', results } }
 * results 保留根对象行结构，子数组仅保留失败/忽略行，避免推送整份结果
 */
function buildFileResult(result, ok) {
  const status = (result && typeof result === 'object' && typeof result.status === 'string')
    ? result.status
    : (ok ? 'success' : 'error');
  const message = (result && typeof result === 'object' && typeof result.message === 'string')
    ? result.message
    : (ok ? '' : '导入失败');

  if (!result || typeof result !== 'object' || Array.isArray(result)) {
    return { status, message, data: null };
  }

  const rawData = (result.data && typeof result.data === 'object' && !Array.isArray(result.data))
    ? result.data : null;

  const num = (v) => (typeof v === 'number' ? v : Number(v) || 0);

  // 脚本型接口（如工作流 SKS.AUTOSCRIPT.WORKFLOW）返回
  // { status, message, summary:{total,success,failed}, result|actions/maxroles/workflows }
  if (result.summary && typeof result.summary === 'object') {
    const summary = result.summary;
    return {
      status,
      message,
      data: {
        total: num(summary.total),
        'sks:successSumTotal': num(summary.success),
        'sks:failSumTotal': num(summary.failed),
        'sks:ignoreSumTotal': 0,
        results: collectScriptRows(result)
      }
    };
  }
  const keys = ['total', 'added', 'updated', 'skipped', 'failed'];
  const sumKeys = ['sks:successSumTotal', 'sks:failSumTotal', 'sks:ignoreSumTotal'];
  const hasStats = rawData && (
    Array.isArray(rawData.results)
    || keys.some(k => rawData[k] !== undefined)
    || sumKeys.some(k => rawData[k] !== undefined)
  );

  if (!hasStats) {
    return { status, message, data: null };
  }

  const data = {};
  keys.forEach(k => {
    const v = rawData[k];
    if (v !== undefined) data[k] = num(v);
  });
  sumKeys.forEach(k => {
    data[k] = num(rawData[k] !== undefined ? rawData[k] : result[k]);
  });
  data.results = pruneResults(rawData.results);

  return { status, message, data };
}

/**
 * 将脚本型接口（工作流等）的逐条结果整理成与新模式一致的行结构，
 * 只保留失败行，供前端「明细」弹窗复用。
 */
function collectScriptRows(result) {
  const out = [];
  const push = (rows, objectName) => (rows || []).forEach(r => {
    if (!r || typeof r !== 'object') return;
    if (String(r.status || '').toLowerCase() === 'success') return;
    const name = r.processName || r.action || r.maxrole || r.name
      || (r.id !== undefined && r.id !== null ? String(r.id) : '');
    const rev = (r.processRev !== undefined && r.processRev !== null) ? `(${r.processRev})` : '';
    const warnings = Array.isArray(r.warnings)
      ? r.warnings.filter(Boolean).join('；')
      : (r.warnings || '');
    out.push({
      'sks:objectName': objectName,
      'sks:ref': name ? `${name}${rev}` : '未知',
      _status: 'failed',
      _operation: '',
      _message: [r.message, warnings].filter(Boolean).join('；')
    });
  });

  const sections = { actions: 'ACTION', maxroles: 'MAXROLE', workflows: 'WFPROCESS' };
  Object.entries(sections).forEach(([key, label]) => {
    const sec = result[key];
    if (sec && Array.isArray(sec.result)) push(sec.result, label);
  });
  if (Array.isArray(result.result)) push(result.result, '');

  return out;
}

/**
 * 保留根对象行，子级只保留 failed / skipped 行
 */
function pruneResults(rows) {
  return (rows || [])
    .filter(row => row && typeof row === 'object')
    .map(row => {
      const copy = { ...row };
      ['attributes', 'indexes', 'relationships'].forEach(key => {
        if (Array.isArray(row[key])) {
          copy[key] = row[key].filter(r => r && typeof r === 'object'
            && (r._status === 'failed' || r._status === 'skipped'));
        }
      });
      return copy;
    });
}

/**
 * 扫描目录文件
 */
function scanFiles(dirPath, extFilter, recursive) {
  const results = [];
  
  function scan(currentPath, depth = 0) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      
      if (entry.isFile()) {
        if (entry.name.toLowerCase().endsWith(extFilter.toLowerCase())) {
          results.push({
            name: entry.name,
            path: fullPath,
            relativePath: path.relative(dirPath, fullPath)
          });
        }
      } else if (entry.isDirectory() && recursive && depth < 10) {
        scan(fullPath, depth + 1);
      }
    }
  }
  
  scan(dirPath);
  return results;
}

/**
 * 发送 SSE 事件
 */
function sendEvent(res, event, data) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}
