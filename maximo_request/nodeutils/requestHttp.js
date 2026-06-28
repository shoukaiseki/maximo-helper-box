import http from 'http';
import https from 'https';
import axios from 'axios';
import { getConfig } from './config.js';
import logger from './logger.js';

// 完全禁用 TLS 证书验证（仅用于开发环境）
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

/**
 * 限制日志输出长度
 * @param {any} data 要输出的数据
 * @param {number} [maxLength=200] 最大长度，默认 200
 * @returns {{truncated: boolean, data: string}} true 表示未超出限制，false 表示已截断
 */
function limitLogOutput(data, maxLength = 200) {
  const str = typeof data === 'string' ? data : JSON.stringify(data);

  if (str.length <= maxLength) {
    return { truncated: false, data: str };
  } else {
    const truncated = str.substring(0, maxLength) + `...(${str.length}个字)`;
    return { truncated: true, data: truncated };
  }
}

// 创建axios实例
function createService() {
  const config = getConfig();
  const service = axios.create({
    baseURL: config.baseUrl,
    timeout: 50000,
    headers: {
      'User-Agent': 'RequestHttp'
    },
    noAuth: false,
    authType: 'apiKey',
  });

  // request拦截器
  service.interceptors.request.use(config => {
    const globalConfig = getConfig();
    logger.info('[Request] 开始处理请求');
    logger.info('[Request] URL:', config.url);
    logger.info('[Request] Method:', config.method);

    // 是否需要设置 token
    if (!config.noAuth) {
      if (config.authType == 'apiKey') {
        config.headers['apiKey'] = globalConfig.apiKey;
        logger.info('[Request] 设置 apiKey');
      } else {
        if (config.maxauth) {
          config.headers['maxauth'] = globalConfig.maxauth;
          logger.info('[Request] 设置 maxauth');
        }
      }
    }

    if (!config.headers['Content-Type']) config.headers['Content-Type'] = 'application/json;charset=utf-8';
    if (!config.headers['Accept']) config.headers['Accept'] = '*/*';
    if (!config.params) {
      config.params = {};
    }
    if (!(config.url.concat('_langcode') || config.params['_langcode'])) {
      config.params['_langcode'] = 'zh';
    }
    var url = `${config.method} ${globalConfig.baseUrl}${config.url}`;
    if (config.params && Object.keys(config.params).length > 0) {
      if (url.indexOf('?') > -1) {
        url += `&`;
      } else {
        url += `?`;
      }
      url += `${Object.entries(config.params).map(([key, value]) => `${key}=${value}`).join('&')}`;
    }
    let httpContent = `### ${url}\n`;
    httpContent += `${url}\n`;
    // 添加 headers（过滤掉一些自动添加的头）
    const skipHeaders = ['user-agent', 'content-length', 'host', 'accept-encoding', 'connection'];
    Object.entries(config.headers || {}).forEach(([key, value]) => {
      const lowerKey = key.toLowerCase();
      if (!skipHeaders.includes(lowerKey)) {
        httpContent += `${key}: ${value}\n`;
      }
    });
    if (config.data) {
      httpContent += `### Request Data\n${limitLogOutput(config.data).data}\n`;
    }
    logger.info(httpContent);
    logger.info('[Request] 请求准备完成，发送请求...');
    return config;
  }, error => {
    logger.debug(error);
    Promise.reject(error);
  });

  // 响应拦截器
  service.interceptors.response.use(res => {
    logger.info('[Response] 收到响应，状态码:', res.status);
    logger.info('[Response] 响应数据:', res.data);

    // 未设置状态码则默认成功状态
    const code = res.data?.code || res.status || 200;
    if (code >= 200 && code < 300) {
      return res.data;
    }

    // 处理各种错误状态码
    logger.error('[Response] 请求失败，状态码:', code);
    if (code === 401) {
      logger.error("无效的token");
      return Promise.reject(new Error('无效的token'));
    } else if (code === 500) {
      logger.error("服务器内部错误");
      return Promise.reject(new Error(res.data?.message || '服务器内部错误'));
    } else if (code > 200) {
      return Promise.reject(new Error(res.data?.message || `请求失败，状态码: ${code}`));
    } else {
      return Promise.reject(new Error('未知错误'));
    }
  }, error => {
    logger.error('[Response Error] 请求错误:', error.message);
    logger.debug('[Response Error] 错误对象:', error);

    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    }
    else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    }
    else if (message.includes("Request failed with status code")) {
      let code = message.substr(message.length - 3);
      if (code == '502') {
        message = "系统正在维护,请稍后再试";
      } else {
        message = "系统接口" + code + "异常";
      }
    }
    logger.error('[Response Error] 错误信息:', message);
    return Promise.reject(error);
  });

  return service;
}

// 延迟创建 service，确保配置已加载
let service = null;
function getService() {
  if (!service) {
    service = createService();
  }
  return service;
}

// 默认导出函数
const requestFn = (config) => getService()(config);
export default requestFn;
