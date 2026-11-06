import express from 'express';
import { loadImportConfig } from '../../../nodeutils/importConfig.js';

const router = express.Router();

/**
 * GET /api/import-config
 * 返回导入接口配置（含备注 md 渲染后的 html），供 Web UI 展示参数与帮助
 */
router.get('/', (req, res) => {
  try {
    res.json({ success: true, data: loadImportConfig() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
