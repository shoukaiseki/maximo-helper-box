import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import { loadConfig, getConfig } from '../../nodeutils/config.js';
import { envsRouter } from './routes/envs.js';
import { scanRouter } from './routes/scan.js';
import { runRouter } from './routes/run.js';
import { planRouter } from './routes/plan.js';
import { browseRouter } from './routes/browse.js';
import importConfigRouter from './routes/importConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function startWebServer(options = {}) {
  const { env = 'local', port = 8080 } = options;
  
  // 加载配置
  loadConfig(env);
  
  const app = express();
  
  // 中间件
  app.use(cors());
  app.use(express.json());
  
  // API 路由
  app.use('/api/envs', envsRouter);
  app.use('/api/scan', scanRouter);
  app.use('/api/run', runRouter);
  app.use('/api/plan', planRouter);
  app.use('/api/browse', browseRouter);
  app.use('/api/import-config', importConfigRouter);
  
  // 未匹配的 API 路由返回 JSON，避免被 SPA 回退成 HTML
  app.use('/api', (req, res) => {
    res.status(404).json({ success: false, message: `接口不存在: ${req.method} ${req.originalUrl}` });
  });
  
  // 静态文件（前端构建产物）
  const clientDist = path.join(__dirname, '../client/dist');
  app.use(express.static(clientDist));
  
  // SPA 回退
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
  
  // 启动服务
  const server = app.listen(port, '127.0.0.1', () => {
    console.log(`[Web] 服务已启动: http://127.0.0.1:${port}`);
    console.log(`[Web] 默认环境: ${env}`);
    console.log(`[Web] 按 Ctrl+C 停止`);
  });
  
  // 优雅关闭
  process.on('SIGINT', () => {
    console.log('\n[Web] 正在关闭服务...');
    server.close(() => {
      console.log('[Web] 服务已关闭');
      process.exit(0);
    });
  });
  
  return server;
}
