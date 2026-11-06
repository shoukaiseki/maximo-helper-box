import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_FILE = path.join(__dirname, 'importConfig.json');

/**
 * 读取导入接口配置文件，并把 remark 指向的 md 文档渲染成 html
 * @returns {Object} 以方法名为 key 的配置对象
 */
export function loadImportConfig() {
  if (!fs.existsSync(CONFIG_FILE)) {
    return {};
  }

  const raw = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8').replace(/^\uFEFF/, ''));
  const result = {};

  for (const [key, item] of Object.entries(raw)) {
    const entry = { key, ...item };

    if (item.remark) {
      const remarkPath = path.resolve(__dirname, item.remark);
      if (fs.existsSync(remarkPath)) {
        try {
          const md = fs.readFileSync(remarkPath, 'utf-8');
          entry.remarkContent = md;
          entry.remarkHtml = marked.parse(md);
        } catch (e) {
          entry.remarkHtml = `<p>读取备注失败: ${e.message}</p>`;
        }
      } else {
        entry.remarkHtml = `<p>备注文件不存在: ${item.remark}</p>`;
      }
    }

    result[key] = entry;
  }

  return result;
}

/**
 * 按方法名或 CLI 命令名查找配置项
 * @param {string} name - 方法名（importMaxObject）或命令名（import-object）
 * @returns {Object|null}
 */
export function getImportConfigItem(name) {
  const config = loadImportConfig();
  if (config[name]) {
    return config[name];
  }
  return Object.values(config).find(item => item.command === name) || null;
}

/**
 * 由配置项生成默认 URL 参数
 * @param {Object} item - 配置项
 * @returns {Object} 参数名 -> 默认值
 */
export function getDefaultUrlParams(item) {
  const params = {};
  if (!item || !Array.isArray(item.params)) {
    return params;
  }
  for (const p of item.params) {
    if (!p || !p.name || p.name === '*') continue;
    if (p.default === '' || p.default === null || p.default === undefined) continue;
    params[p.name] = p.default;
  }
  return params;
}
