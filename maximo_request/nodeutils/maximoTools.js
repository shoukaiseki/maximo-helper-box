import request from '../nodeutils/requestHttp.js'
import { readFileContent, readJsonFile, readXmlFile } from './fileUtils.js'
import logger from './logger.js';

/**
 * 导入Maximo对象配置
 * @param {Object} options - 配置选项
 * @param {string} options.fileName - 配置文件名（JSON或XML）
 * @param {string} options.logname - 日志打印名称
 * @returns {Promise<boolean>} 是否导入成功
 */
export async function importMaxObject({fileName, logname}) {
    if(!logname||logname===""||logname===null){
        logname = fileName
    }
    try {
        // 根据文件扩展名选择读取方式
        let fileContent = null;
        fileContent = readFileContent(fileName);
        
        // 检查文件是否成功读取
        if (!fileContent) {
            logger.error(`[${logname}]文件读取失败: ${fileName}`);
            return false;
        }
        
        logger.info(`[${logname}]成功读取文件: ${fileName}`);
        logger.info(`[${logname}]文件大小: ${fileContent.length} 字节`);
        logger.info(`[${logname}]准备导入对象: ${logname || '未指定'}`);
        
        // 发送请求到Maximo API
        logger.info(`[${logname}]开始发送请求...`);
        const response = await request({
            url: '/api/script/SHARPTREE.AUTOSCRIPT.LIBRARY',
            method: 'post',
            params: {
                develop: true,
                _langcode: 'zh',
            },
            data: fileContent  // 将文件内容作为请求体发送
        })
        
        logger.info(`[${logname}]收到响应`);
        logger.info(`[${logname}]响应类型:`, typeof response);
        logger.info(`[${logname}]响应内容:`, response);
        
        // 检查响应 - requestHttp的响应拦截器已返回res.data
        if (response !== null && response !== undefined) {
            logger.warn(`[${logname}]导入成功`)
            return true
        } else {
            logger.error(`[${logname}]导入失败，响应为空或null`)
            logger.error(`[${logname}]响应值:`, response)
            return false
        }
    } catch (error) {
        logger.error(`[${logname}]请求出错:`, error.message)
        if (error.response) {
            // 服务器返回了错误状态码
            // logger.error(`[${logname}]错误状态码:`, error.response.status)
            // logger.error(`[${logname}]错误响应数据:`, error.response.data)
        } else if (error.request) {
            // 请求已发出但没有收到响应
            logger.error(`[${logname}]请求已发出但无响应`)
            // logger.error(`[${logname}]请求URL:`, error.request.url)
            // logger.error(`[${logname}]请求方法:`, error.request.method)
        } else {
            // 其他错误
            logger.error(`[${logname}]错误详情:`, error)
        }
        return false
    }
}


/**
 * 导入应用XML配置到Maximo
 * @param {Object} options - 配置选项
 * @param {string} options.fileName - XML配置文件名
 * @param {string} options.logname - 日志打印名称
 * @returns {Promise<boolean>} 是否导入成功
 */
export async function importMaxPresentation({fileName, logname}) {
    if(!logname||logname===""||logname===null){
        logname = fileName
    }
    try {
        let fileContent = null;
        fileContent = readFileContent(fileName);
        
        if (!fileContent) {
            logger.error(`[${logname}]文件读取失败: ${fileName}`);
            return false;
        }
        
        logger.info(`[${logname}]成功读取文件: ${fileName}`);
        logger.info(`[${logname}]文件大小: ${fileContent.length} 字节`);
        
        logger.info(`[${logname}]开始发送请求...`);
        const response = await request({
            url: '/api/script/SHARPTREE.AUTOSCRIPT.SCREENS',
            method: 'post',
              headers: {
                'Content-Type': 'application/xml'
            },
            params: {
                _langcode: 'zh',
            },
            data: fileContent
        })
        
        logger.info(`[${logname}]收到响应`);
        logger.info(`[${logname}]响应类型:`, typeof response);
        logger.info(`[${logname}]响应内容:`, response);
        
        if (response !== null && response !== undefined) {
            logger.warn(`[${logname}]导入成功`)
            return true
        } else {
            logger.error(`[${logname}]导入失败，响应为空或null`)
            logger.error(`[${logname}]响应值:`, response)
            return false
        }
    } catch (error) {
        logger.error(`[${logname}]请求出错:`, error.message)
        if (error.response) {
            // 服务器返回了错误状态码
        } else if (error.request) {
            logger.error(`[${logname}]请求已发出但无响应`)
        } else {
            logger.error(`[${logname}]错误详情:`, error)
        }
        return false
    }
}


/**
 * 导入Maximo域
 * @param {Object} options - 配置选项
 * @param {string} options.fileName - 配置文件名（JSON或XML）
 * @param {string} options.logname - 日志打印名称
 * @returns {Promise<boolean>} 是否导入成功
 */
export async function importMaxDomain({fileName, logname}) {
    if(!logname||logname===""||logname===null){
        logname = fileName
    }
    try {
        // 根据文件扩展名选择读取方式
        let fileContent = null;
        fileContent = readFileContent(fileName);
        
        // 检查文件是否成功读取
        if (!fileContent) {
            logger.error(`[${logname}]文件读取失败: ${fileName}`);
            return false;
        }
        
        logger.info(`[${logname}]成功读取文件: ${fileName}`);
        logger.info(`[${logname}]文件大小: ${fileContent.length} 字节`);
        logger.info(`[${logname}]准备导入domain: ${logname || '未指定'}`);
        
        // 发送请求到Maximo API
        logger.info(`[${logname}]开始发送请求...`);
        const response = await request({
            url: '/api/script/SKS_DEPLOY_DOMAIN',
            method: 'post',
            params: {
                develop: true,
                _langcode: 'zh',
            },
            data: fileContent  // 将文件内容作为请求体发送
        })
        
        logger.info(`[${logname}]收到响应`);
        logger.info(`[${logname}]响应类型:`, typeof response);
        logger.info(`[${logname}]响应内容:`, response);
        
        // 检查响应 - requestHttp的响应拦截器已返回res.data
        if (response !== null && response !== undefined) {
            logger.warn(`[${logname}]导入成功`)
            return true
        } else {
            logger.error(`[${logname}]导入失败，响应为空或null`)
            logger.error(`[${logname}]响应值:`, response)
            return false
        }
    } catch (error) {
        logger.error(`[${logname}]请求出错:`, error.message)
        if (error.response) {
            // 服务器返回了错误状态码
            // logger.error(`[${logname}]错误状态码:`, error.response.status)
            // logger.error(`[${logname}]错误响应数据:`, error.response.data)
        } else if (error.request) {
            // 请求已发出但没有收到响应
            logger.error(`[${logname}]请求已发出但无响应`)
            // logger.error(`[${logname}]请求URL:`, error.request.url)
            // logger.error(`[${logname}]请求方法:`, error.request.method)
        } else {
            // 其他错误
            logger.error(`[${logname}]错误详情:`, error)
        }
        return false
    }
}