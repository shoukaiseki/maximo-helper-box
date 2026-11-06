import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

export const planRouter = Router();

// 计划详情目录: ~/.sks/nodeutils/import-plan/<uuid>.json（名称可能重复，用 uuid 关联）
const PLAN_DIR = path.join(os.homedir(), '.sks', 'nodeutils', 'import-plan');
// 计划索引文件: ~/.sks/nodeutils/import-plan.json
const INDEX_FILE = path.join(os.homedir(), '.sks', 'nodeutils', 'import-plan.json');

// uuid 不带 -
function genId() {
  return crypto.randomUUID().replace(/-/g, '');
}

// 仅允许合法 uuid（防止路径穿越）
function isValidId(id) {
  return typeof id === 'string' && /^[0-9a-f]{32}$/i.test(id);
}

function planFilePath(id) {
  return path.join(PLAN_DIR, `${id}.json`);
}

function ensurePlanDir() {
  if (!fs.existsSync(PLAN_DIR)) {
    fs.mkdirSync(PLAN_DIR, { recursive: true });
  }
}

/**
 * 读取索引文件
 */
function readIndex() {
  if (!fs.existsSync(INDEX_FILE)) {
    return { plans: [] };
  }
  try {
    const data = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf-8'));
    if (Array.isArray(data.plans)) {
      return data;
    }
  } catch (e) {
    // 索引损坏时重建
  }
  return { plans: [] };
}

function writeIndex(index) {
  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2), 'utf-8');
}

/**
 * GET /api/plan/default
 * 返回默认计划 ID
 */
planRouter.get('/default', (req, res) => {
  try {
    const index = readIndex();
    res.json({ success: true, data: { defaultId: index.defaultId || null } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/plan/default
 * 设置默认计划（body: { id }）
 */
planRouter.post('/default', (req, res) => {
  try {
    const { id } = req.body;
    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: '计划ID无效' });
    }
    const file = planFilePath(id);
    if (!fs.existsSync(file)) {
      return res.status(404).json({ success: false, message: '计划不存在' });
    }
    const index = readIndex();
    index.defaultId = id;
    writeIndex(index);
    res.json({ success: true, message: '已设为默认计划' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/plan/list
 * 返回索引中的所有计划（过滤掉详情文件已丢失的记录）
 */
planRouter.get('/list', (req, res) => {
  try {
    const index = readIndex();
    const valid = index.plans.filter(p => p.id && isValidId(p.id) && fs.existsSync(planFilePath(p.id)));
    if (valid.length !== index.plans.length) {
      index.plans = valid;
      writeIndex(index);
    }
    valid.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
    res.json({ success: true, data: valid, defaultId: index.defaultId || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/plan?id=xxx
 * 读取指定计划详情
 */
planRouter.get('/', (req, res) => {
  try {
    const { id } = req.query;
    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: '计划ID无效' });
    }

    const file = planFilePath(id);
    if (!fs.existsSync(file)) {
      return res.json({ success: true, data: null });
    }

    const plan = JSON.parse(fs.readFileSync(file, 'utf-8'));
    res.json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/plan
 * 保存计划：
 * 1. 无 id 时生成 uuid（不带 -）
 * 2. 详情写入 import-plan/<uuid>.json（不存在则新建）
 * 3. 索引按 id 新增/更新记录（名称允许重复）
 */
planRouter.post('/', (req, res) => {
  try {
    const { plan } = req.body;

    if (!plan || !plan.name || !String(plan.name).trim()) {
      return res.status(400).json({ success: false, message: '计划名称不能为空' });
    }

    plan.name = String(plan.name).trim();
    ensurePlanDir();

    if (!isValidId(plan.id)) {
      plan.id = genId();
    }

    fs.writeFileSync(planFilePath(plan.id), JSON.stringify(plan, null, 2), 'utf-8');

    const index = readIndex();
    const record = {
      id: plan.id,
      name: plan.name,
      env: plan.env || '',
      updatedAt: new Date().toISOString()
    };
    const pos = index.plans.findIndex(p => p.id === plan.id);
    if (pos >= 0) {
      index.plans[pos] = record;
    } else {
      index.plans.push(record);
    }
    writeIndex(index);

    res.json({
      success: true,
      message: '计划已保存',
      data: { id: plan.id, name: plan.name }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/plan/rename
 * 按 uuid 重命名计划（body: { id, newName }）
 */
planRouter.post('/rename', (req, res) => {
  try {
    const { id, newName } = req.body;
    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: '计划ID无效' });
    }
    if (!newName || !String(newName).trim()) {
      return res.status(400).json({ success: false, message: '新名称不能为空' });
    }

    const file = planFilePath(id);
    if (!fs.existsSync(file)) {
      return res.status(404).json({ success: false, message: '计划不存在' });
    }

    const plan = JSON.parse(fs.readFileSync(file, 'utf-8'));
    plan.name = String(newName).trim();
    fs.writeFileSync(file, JSON.stringify(plan, null, 2), 'utf-8');

    const index = readIndex();
    const record = index.plans.find(p => p.id === id);
    if (record) {
      record.name = plan.name;
      record.updatedAt = new Date().toISOString();
      writeIndex(index);
    }

    res.json({ success: true, message: '计划已重命名', data: { id, name: plan.name } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * DELETE /api/plan?id=xxx
 * 删除计划详情文件并从索引移除记录
 */
planRouter.delete('/', (req, res) => {
  try {
    const { id } = req.query;
    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: '计划ID无效' });
    }

    const file = planFilePath(id);
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }

    const index = readIndex();
    index.plans = index.plans.filter(p => p.id !== id);
    writeIndex(index);

    res.json({ success: true, message: '计划已删除' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
