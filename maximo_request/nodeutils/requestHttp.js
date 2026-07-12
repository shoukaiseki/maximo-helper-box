import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import os from 'os';
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

function joinUrl(base, path) {
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

function getLogDir() {
  return path.join(os.homedir(), '.sks', 'nodeutils', 'logs');
}

function saveRequestLog(config, globalConfig) {
  try {
    const logDir = getLogDir();
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const method = config.method?.toUpperCase() || 'GET';
    let url = joinUrl(globalConfig.baseUrl, config.url);
    
    if (config.params && Object.keys(config.params).length > 0) {
      const paramsStr = Object.entries(config.params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
      url += url.includes('?') ? `&${paramsStr}` : `?${paramsStr}`;
    }

    let httpContent = `### ${method} ${url}\n`;
    httpContent += `${method} ${url}\n`;

    const skipHeaders = ['user-agent', 'content-length', 'host', 'accept-encoding', 'connection'];
    Object.entries(config.headers || {}).forEach(([key, value]) => {
      const lowerKey = key.toLowerCase();
      if (!skipHeaders.includes(lowerKey)) {
        httpContent += `${key}: ${value}\n`;
      }
    });

    httpContent += '\n';
    if (config.data) {
      if (typeof config.data === 'string') {
        httpContent += config.data;
      } else {
        httpContent += JSON.stringify(config.data, null, 2);
      }
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `request-${method}-${timestamp}.http`;
    const filePath = path.join(logDir, fileName);
    fs.writeFileSync(filePath, httpContent, 'utf-8');

    logger.error(`[HTTP Log] 请求日志已保存: ${filePath}`);
  } catch (error) {
    logger.error('[HTTP Log] 保存请求日志失败:', error.message);
  }
}

function saveErrorLog(error) {
  try {
    const logDir = getLogDir();
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const method = error.config?.method?.toUpperCase() || 'GET';
    const fullUrl = error.config ? joinUrl(getConfig().baseUrl, error.config.url) : 'unknown';
    
    const errorLog = {
      timestamp: timestamp,
      method: method,
      url: fullUrl,
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      headers: error.response?.headers,
      data: error.response?.data || error.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        params: error.config?.params,
        data: error.config?.data
      }
    };

    const fileName = `response-error-${method}-${timestamp}.json`;
    const filePath = path.join(logDir, fileName);

    fs.writeFileSync(filePath, JSON.stringify(errorLog, null, 2), 'utf-8');

    logger.warn(`[HTTP Log] 错误日志已保存: ${filePath}`);
  } catch (e) {
    logger.error('[HTTP Log] 保存错误日志失败:', e.message);
  }
}
function saveResponseLog(response) {
  try {
    const logDir = getLogDir();
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const method = response.config.method?.toUpperCase() || 'GET';
    const fullUrl = joinUrl(getConfig().baseUrl, response.config.url);
    
    const responseLog = {
      timestamp: timestamp,
      method: method,
      url: fullUrl,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data
    };

    const fileName = `response-${method}-${timestamp}.json`;
    const filePath = path.join(logDir, fileName);

    fs.writeFileSync(filePath, JSON.stringify(responseLog, null, 2), 'utf-8');

    logger.warn(`[HTTP Log] 响应日志已保存: ${filePath}`);
  } catch (error) {
    logger.error('[HTTP Log] 保存响应日志失败:', error.message);
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
    if (!config.params['_langcode']) {
      config.params['_langcode'] = globalConfig.langcode || 'zh';
    }
    var url = `${config.method} ${joinUrl(globalConfig.baseUrl, config.url)}`;
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
    
    saveRequestLog(config, globalConfig);
    
    return config;
  }, error => {
    logger.debug(error);
    Promise.reject(error);
  });

  // 响应拦截器
  service.interceptors.response.use(res => {
    logger.info('[Response] 收到响应，状态码:', res.status);
    logger.debug('[Response] 响应数据:', res.data);
    
    saveResponseLog(res);

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
    try{
      if(error){
        logger.error('[Response Error] 请求错误:', error.message);
        saveErrorLog(error);
        logger.debug('[Response Error] 错误对象:', error);
        if (error.data) {
          logger.info('[Response Error] 错误error.data:', error.data);
        }
        if (error.response&&error.response.data) {
          logger.info('[Response Error] 错误error.response.data:', error.response.data);
          if (error.response.data['oslc:Error']) {
            if (error.response.data['oslc:Error']['oslc:extendedError']) {
              if (error.response.data['oslc:Error']['oslc:extendedError']['oslc:moreInfo']) {
                logger.error('[Response Error] 错误error.response.data:', error.response.data['oslc:Error']['oslc:extendedError']['oslc:moreInfo']);

              }
            } else {
              if(error.response.data['oslc:Error']['oslc:message']){
                logger.error('[Response Error] 错误error.response.data.oslc:Error.oslc:message:', error.response.data['oslc:Error']['oslc:message']);
              }else{
                logger.error('[Response Error] 错误error.response.data.oslc:Error.oslc:message:', error.response.data['oslc:Error']);
              }
            }
          }
        }
      }
    }catch(e){}

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
