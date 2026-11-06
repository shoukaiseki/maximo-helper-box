import { Router } from 'express';
import { getConfig, getRawConfig } from '../../../nodeutils/config.js';

export const envsRouter = Router();

/**
 * GET /api/envs
 * 返回配置中的环境列表及 baseUrl
 */
envsRouter.get('/', (req, res) => {
  try {
    const rawConfig = getRawConfig();
    const envs = rawConfig.envs || {};
    const defaultEnv = rawConfig.defaultEnv || 'local';
    
    const result = Object.entries(envs).map(([key, envConfig]) => ({
      key,
      baseUrl: envConfig.baseUrl,
      langcode: envConfig.langcode || rawConfig.langcode || 'zh',
      authType: envConfig.authType || 'apiKey'
    }));
    
    // 当前环境优先取启动时加载的环境
    let currentEnv = defaultEnv;
    try {
      currentEnv = getConfig().env || defaultEnv;
    } catch (e) {
      // 配置未加载时回退 defaultEnv
    }
    
    res.json({
      success: true,
      data: result,
      currentEnv
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
