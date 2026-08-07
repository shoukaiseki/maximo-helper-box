import request from '../nodeutils/requestHttp.js'
import { readFileContent, readJsonFile, readXmlFile, resolveFilePath, listFiles } from './fileUtils.js'
import logger from './logger.js';
import { getConfig } from './config.js';
import os from 'os'
import path from 'path'

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
                _langcode: getConfig().langcode,
            },
            data: fileContent  // 将文件内容作为请求体发送
        })
        
        logger.info(`[${logname}]收到响应`);
        logger.info(`[${logname}]响应类型:`, typeof response);
        logger.debug(`[${logname}]响应内容:`, response);
        
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
                _langcode: getConfig().langcode,
            },
            data: fileContent
        })
        
        logger.info(`[${logname}]收到响应`);
        logger.info(`[${logname}]响应类型:`, typeof response);
        logger.debug(`[${logname}]响应内容:`, response);
        
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
                _langcode: getConfig().langcode,
            },
            data: fileContent  // 将文件内容作为请求体发送
        })
        
        logger.warn(`[${logname}]收到响应`);
        logger.warn(`[${logname}]响应类型:`, typeof response);
        logger.warn(`[${logname}]响应内容:`, response);
        
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
 * 保存脚本历史记录
 * @param {Object} options - 配置选项
 * @param {string} options.autoscript - 脚本名称
 * @param {string} options.source - 脚本内容
 * @param {string} options.version - 版本号
 * @param {string} options.aliasname - 别名
 * @param {string} options.hostname - 主机名
 * @returns {Promise<boolean>} 是否保存成功
 */
export async function saveScriptHistory({autoscript, source, version = '', aliasname = '', hostname = ''}) {
    try {
        logger.info(`[${autoscript}]保存脚本历史记录...`);
        
        const response = await request({
            url: '/api/script/SKS_AUTOSCRIPT_HISTORY_SAVE',
            method: 'post',
            params: {
                _langcode: getConfig().langcode,
            },
            data: {
                autoscript,
                source,
                version,
                aliasname,
                hostname
            }
        });
        
        logger.warn(`[${autoscript}]脚本历史记录保存成功`);
        return response !== null && response !== undefined;
    } catch (error) {
        logger.error(`[${autoscript}]保存脚本历史记录失败:`, error.message);
        return false;
    }
}


/**
 * 导入Maximo自动化脚本（1:1还原插件工具箱导入流程）
 * @param {Object} options - 配置选项
 * @param {string} options.fileName - JSON配置文件名（同目录下需有同名.js或.py文件）
 * @param {string} options.logname - 日志打印名称（可选，默认使用autoscript值）
 * @returns {Promise<boolean>} 是否导入成功
 */
export async function importMaxScript({fileName, logname}) {
    try {
        // 使用通用路径转换方法解析路径
        const resolvedFilePath = resolveFilePath(fileName);
        const fileExt = path.extname(resolvedFilePath).toLowerCase();
        
        // 如果不是JSON文件（如直接传入了.js/.py脚本文件路径），自动找同目录下的同名JSON配置文件
        let jsonFilePath = resolvedFilePath;
        if (fileExt !== '.json') {
            const dir = path.dirname(resolvedFilePath);
            const baseName = path.basename(resolvedFilePath, fileExt);
            jsonFilePath = path.join(dir, `${baseName}.json`);
            logger.info(`[导入脚本] 传入的是脚本文件，尝试查找配置文件: ${jsonFilePath}`);
        }
        
        const jsonContent = readJsonFile(jsonFilePath);
        
        if (!jsonContent) {
            logger.error(`配置文件读取失败: ${jsonFilePath}`);
            return false;
        }
        
        const requiredFields = ['autoscript', 'description', 'scriptlanguage'];
        const missingFields = requiredFields.filter(field => !jsonContent[field]);
        if (missingFields.length > 0) {
            logger.error(`配置文件缺少必需字段: ${missingFields.join(', ')}`);
            return false;
        }
        
        const autoscript = jsonContent.autoscript;
        const scriptLanguage = jsonContent.scriptlanguage.toLowerCase();
        const isPython = (scriptLanguage === 'python' || scriptLanguage === 'jython');
        const scriptExt = isPython ? '.py' : '.js';
        
        const actualLogname = logname || autoscript;
        logger.info(`[${actualLogname}]成功读取配置文件: ${jsonFilePath}`);
        logger.warn(`[${actualLogname}]脚本名称: ${autoscript}`);
        logger.warn(`[${actualLogname}]脚本语言: ${scriptLanguage}`);
        
        // 脚本文件路径：在配置文件同目录下，按 autoscript 名称查找
        const dirname = path.dirname(jsonFilePath);
        const scriptFileName = path.join(dirname, `${autoscript}${scriptExt}`);
        
        const fileContent = readFileContent(scriptFileName);
        
        if (!fileContent) {
            logger.error(`[${actualLogname}]脚本文件读取失败: ${scriptFileName}`);
            return false;
        }
        
        logger.info(`[${actualLogname}]成功读取脚本文件: ${scriptFileName}`);
        logger.info(`[${actualLogname}]文件大小: ${fileContent.length} 字节`);
        
        await saveScriptHistory({
            autoscript: autoscript,
            source: fileContent,
            version: 'deploy',
            aliasname: '_script_',
            hostname: os.hostname()
        });
        
        const ignoreFields = ['BINARYSCRIPTSOURCE', 'AUTOSCRIPTID'];
        
        const customFields = {};
        for (const [key, value] of Object.entries(jsonContent)) {
            if (ignoreFields.includes(key)) {
                continue;
            }
            if (key === 'SOURCE') {
                continue;
            }
            customFields[key.toLowerCase()] = value;
        }
        
        customFields.autoscript = autoscript;
        customFields.description = jsonContent.description;
        customFields.source = fileContent.replace(/\r\n/g, '\n');
        customFields.scriptlanguage = jsonContent.scriptlanguage;
        
        if (jsonContent.active !== undefined) {
            customFields.active = jsonContent.active === true || jsonContent.active === 1 || jsonContent.active === '1';
        } else {
            customFields.active = true;
        }
        
        logger.info(`[${actualLogname}]步骤1: 检查脚本是否存在...`);
        const checkUrl = `api/os/MXAPIAUTOSCRIPT?lean=1&oslc.select=autoscript&oslc.where=autoscript="${autoscript}"`;
        
        let scriptExists = false;
        let scriptHref = null;
        
        try {
            const checkResult = await request({
                url: checkUrl,
                method: 'GET'
            });
            
            if (checkResult && checkResult.member) {
                const memberCount = checkResult.member.length;
                if (memberCount === 1) {
                    scriptExists = true;
                    scriptHref = checkResult.member[0].href;
                }
            }
        } catch (error) {
            logger.error(`[${actualLogname}]检查脚本失败:`, error.message);
        }
        
        if (scriptExists) {
            logger.info(`[${actualLogname}]脚本已存在，将执行更新操作`);
        } else {
            logger.info(`[${actualLogname}]脚本不存在，将执行创建操作`);
        }
        
        let deployUrl;
        let deployMethod = 'POST';
        
        var headers={};
        if (scriptExists && scriptHref) {
            deployUrl = scriptHref;
            deployMethod = 'POST';
            headers =  {
                'Content-Type': 'application/merge-patch+json',
                'x-method-override': 'PATCH'
            };
            
        } else {
            deployUrl = 'api/os/MXAPIAUTOSCRIPT';
            headers =  {
                'Content-Type': 'application/json'
            };
        }
        
        const deployBody = {};
        
        for (const key in customFields) {
            if (customFields.hasOwnProperty(key)) {
                if (key.toLowerCase() === 'autoscript' || key.toLowerCase() === 'description' || key.toLowerCase() === 'source') {
                    continue;
                }
                if (key.toLowerCase().startsWith('sks:')) {
                    continue;
                }
                if (key.toLowerCase().startsWith('sks:')
                    || key.toLowerCase() === 'changedate'
                    || key.toLowerCase() === 'statusdate'
                ) {
                    // 跳过 sks: 开头的字段
                    continue;
                }
                
                if (key.toLowerCase() === 'launchpoints') {
                    const launchPointsTmp = [];
                    for (const launchPoint of customFields[key]) {
                        const launchPointTmp = {};
                        const ignoreFieldsLaunchpoints = ['eventtype'];
                        for (const lpKey in launchPoint) {
                            if (ignoreFieldsLaunchpoints.includes(lpKey.toLowerCase())) {
                                continue;
                            }
                            if (lpKey.startsWith('sks:')) {
                                continue;
                            }
                            if (launchPoint.hasOwnProperty(lpKey)) {
                                const prefixedKey = `spi:${lpKey.toLowerCase()}`;
                                launchPointTmp[prefixedKey] = launchPoint[lpKey];
                            }
                        }
                        launchPointsTmp.push(launchPointTmp);
                    }
                    deployBody['spi:scriptlaunchpoint'] = launchPointsTmp;
                    continue;
                }
                
                if (key.toLowerCase() === 'variables') {
                    const variablesTmp = [];
                    for (const variable of customFields[key]) {
                        const variableTmp = {};
                        for (const lpKey in variable) {
                            if (variable.hasOwnProperty(lpKey)) {
                                const prefixedKey = `spi:${lpKey.toLowerCase()}`;
                                variableTmp[prefixedKey] = variable[lpKey];
                            }
                        }
                        variablesTmp.push(variableTmp);
                    }
                    deployBody['spi:autoscriptvars'] = variablesTmp;
                    continue;
                }
                
                const prefixedKey = `spi:${key.toLowerCase()}`;
                deployBody[prefixedKey] = customFields[key];
            }
        }
        
        if (!deployBody['spi:autoscript']) {
            deployBody['spi:autoscript'] = autoscript;
        }
        if (!deployBody['spi:description']) {
            deployBody['spi:description'] = customFields.description;
        }
        if (!deployBody['spi:scriptlanguage']) {
            deployBody['spi:scriptlanguage'] = customFields.scriptlanguage;
        }
        if (deployBody['spi:active'] === undefined) {
            deployBody['spi:active'] = customFields.active;
        }
        if (deployBody['spi:version'] === undefined || deployBody['spi:version'] === '') {
            deployBody['spi:version'] = '1.0.0';
        }
        if (customFields.source) {
            deployBody['spi:source'] = customFields.source;
        } else {
            deployBody['spi:source'] = '';
        }
        
        logger.info(`[${actualLogname}]步骤2: 发送${deployMethod}请求到: ${deployUrl}`);
        const deployResult = await request({
            url: deployUrl,
            method: deployMethod,
            headers:  {
                ...headers
            },
            data: deployBody
        });
        
        logger.info(`[${actualLogname}]收到响应`);
        
        if (deployResult !== null && deployResult !== undefined) {
            logger.warn(`[${actualLogname}]导入成功`)
            return true
        } else {
            logger.error(`[${actualLogname}]导入失败，响应为空或null`)
            return false
        }
    } catch (error) {
        logger.error(`请求出错:`, error.message)
        if (error.response) {
            // 服务器返回了错误状态码
        } else if (error.request) {
            logger.error(`请求已发出但无响应`)
        } else {
            logger.error(`错误详情:`, error)
        }
        return false
    }
}


/**
 * 导入Maximo AutoKey配置
 * @param {Object} options - 配置选项
 * @param {string} options.fileName - 配置文件名（JSON或XML）
 * @param {string} options.logname - 日志打印名称
 * @returns {Promise<boolean>} 是否导入成功
 */
export async function importMaxAutoKey({fileName, logname}) {
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
        logger.info(`[${logname}]准备导入autokey: ${logname || '未指定'}`);
        
        logger.info(`[${logname}]开始发送请求...`);
        const response = await request({
            url: '/api/script/SKS_DEPLOY_AUTOKEY',
            method: 'post',
            params: {
                develop: true,
                _langcode: getConfig().langcode,
            },
            data: fileContent
        })
        
        logger.info(`[${logname}]收到响应`);
        logger.info(`[${logname}]响应类型:`, typeof response);
        logger.debug(`[${logname}]响应内容:`, response);
        
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
 * 导入Maximo应用信息配置
 * @param {Object} options - 配置选项
 * @param {string} options.fileName - 配置文件名（JSON或XML）
 * @param {string} options.logname - 日志打印名称
 * @returns {Promise<boolean>} 是否导入成功
 */
export async function importMaxAppInfo({fileName, logname}) {
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
        logger.info(`[${logname}]准备导入应用信息: ${logname || '未指定'}`);
        
        logger.info(`[${logname}]开始发送请求...`);
        const response = await request({
            url: '/api/script/SKS_IMP_MAXAPPINFO',
            method: 'post',
            params: {
                develop: true,
                _langcode: getConfig().langcode,
            },
            data: fileContent
        })
        
        logger.info(`[${logname}]收到响应`);
        logger.info(`[${logname}]响应类型:`, typeof response);
        logger.debug(`[${logname}]响应内容:`, response);
        
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
export async function callMaxScript({ apiScriptName, fileName, params = {}, logname }) {
    if (!apiScriptName) {
        logger.error('[callMaxScript]脚本名称不能为空')
        return false
    }
    
    const actualLogname = logname || apiScriptName
    
    try {
        logger.info(`[${actualLogname}]开始调用脚本: ${apiScriptName}`)
        
        let data = null
        if (fileName) {
            const fileContent = readFileContent(fileName)
            if (!fileContent) {
                logger.error(`[${actualLogname}]文件读取失败: ${fileName}`)
                return false
            }
            logger.info(`[${actualLogname}]已读取请求体文件: ${fileName}`)
            
            if (fileName.endsWith('.json')) {
                try {
                    data = JSON.parse(fileContent)
                } catch (e) {
                    logger.error(`[${actualLogname}]JSON解析失败: ${e.message}`)
                    return false
                }
            } else {
                data = fileContent
            }
        }
        
        const requestConfig = {
            url: `/api/script/${apiScriptName}`,
            method: data ? 'POST' : 'GET',
            params: {
                ...params,
                _langcode: getConfig().langcode,
            }
        }
        
        if (data !== null) {
            requestConfig.data = data
        }
        
        const response = await request(requestConfig)
        
        logger.info(`[${actualLogname}]收到响应`)
        logger.warn(`[${actualLogname}]响应内容:`, response)
        
        if (response !== null && response !== undefined) {
            logger.info(`[${actualLogname}]调用成功`)
            return response
        } else {
            logger.error(`[${actualLogname}]调用失败，响应为空或null`)
            return null
        }
    } catch (error) {
        logger.error(`[${actualLogname}]请求出错:`, error.message)
        if (error.response) {
            logger.error(`[${actualLogname}]服务器返回错误:`, error.response.data)
        } else if (error.request) {
            logger.error(`[${actualLogname}]请求已发出但无响应`)
        } else {
            logger.error(`[${actualLogname}]错误详情:`, error)
        }
        return null
    }
}

/**
 * 通用批量导入 - 支持各种导入功能（对象、脚本、应用信息、域、应用XML等）的批量处理
 * @param {Object} options - 配置选项
 * @param {string} [options.dirName] - 目录名（与files二选一），自动列出目录下符合条件的文件
 * @param {string[]} [options.files] - 文件路径数组（与dirName二选一），直接指定要导入的文件
 * @param {string} [options.extFilter] - 扩展名过滤，如 '.json'、'.xml'（配合dirName使用）
 * @param {boolean} [options.recursive=true] - 是否递归检索子目录（配合dirName使用）
 * @param {Function} options.importFn - 导入函数，接收 {fileName, logname} 参数，如 importMaxObject、importMaxScript 等
 * @param {string} [options.logname] - 日志打印名称
 * @param {number} [options.concurrency=1] - 并发数量，默认1串行执行
 * @param {boolean} [options.continueOnError=true] - 单个文件失败时是否继续，默认继续
 * @returns {Promise<Object>} 批量导入统计结果
 */
export async function batchImport({ dirName, files, extFilter, recursive = true, importFn, logname = '批量导入', concurrency = 1, continueOnError = true }) {
    if (typeof importFn !== 'function') {
        logger.error('[batchImport]必须指定importFn导入函数')
        return null;
    }
    
    let fileNames = [];
    if (files && Array.isArray(files) && files.length > 0) {
        fileNames = files;
    } else if (dirName) {
        fileNames = listFiles(dirName, extFilter, recursive);
    } else {
        logger.error('[batchImport]必须指定dirName或files');
        return null;
    }
    
    if (fileNames.length === 0) {
        logger.warn('[batchImport]没有找到需要导入的文件');
        return null;
    }
    
    const stats = {
        fileCount: fileNames.length,
        successCount: 0,
        failCount: 0,
        successList: [],
        failList: [],
        startTime: new Date().getTime(),
        endTime: null,
        totalTime: null
    };
    
    logger.warn(`[${logname}]开始批量导入，共 ${fileNames.length} 个文件，并发数: ${concurrency}`);
    
    // 并发池处理
    let index = 0;
    const worker = async () => {
        while (index < fileNames.length) {
            const cur = index++;
            const filename = fileNames[cur];
            try {
                const result = await importFn({ fileName: filename, logname });
                if (result) {
                    stats.successCount++;
                    stats.successList.push(filename);
                } else {
                    stats.failCount++;
                    stats.failList.push(filename);
                }
            } catch (error) {
                stats.failCount++;
                stats.failList.push(filename);
                logger.error(`[${logname}]导入异常: ${filename}`, error.message);
                if (!continueOnError) {
                    throw error;
                }
            }
            logger.warn(`[${logname}]进度: ${cur + 1}/${fileNames.length} 成功: ${stats.successCount} 失败: ${stats.failCount}`);
        }
    };
    
    const workerCount = Math.max(1, Math.min(concurrency, fileNames.length));
    await Promise.all(Array.from({ length: workerCount }, () => worker()));
    
    stats.endTime = new Date().getTime();
    stats.totalTime = stats.endTime - stats.startTime;
    
    logger.warn(`[${logname}]批量导入完成，耗时: ${stats.totalTime}ms，成功: ${stats.successCount}，失败: ${stats.failCount}`);
    if (stats.failList.length > 0) {
        logger.warn(`[${logname}]失败文件列表:`);
        stats.failList.forEach(f => logger.warn(`  ${f}`));
    }
    
    return stats;
}

/**
 * 打印批量导入统计结果
 * @param {Object} stats - batchImport 返回的统计结果
 * @param {string} [logname] - 日志打印名称
 */
export function printBatchStats(stats, logname = '批量导入') {
    if (!stats) {
        logger.warn(`[${logname}]无统计结果可打印`);
        return;
    }
    const formatDateTime = (timestamp) => {
        const d = new Date(timestamp);
        const pad = n => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };
    logger.warn(`[${logname}]========== 批量导入统计 ==========`);
    logger.warn(`[${logname}]总文件数: ${stats.fileCount}`);
    logger.warn(`[${logname}]成功数量: ${stats.successCount}`);
    logger.warn(`[${logname}]失败数量: ${stats.failCount}`);
    logger.warn(`[${logname}]开始时间: ${formatDateTime(stats.startTime)} 结束时间: ${formatDateTime(stats.endTime)} 耗时: ${stats.totalTime}ms`);
    logger.warn(`[${logname}]成功文件列表:`);
    stats.successList.forEach(f => logger.warn(`  ${f}`));
    logger.warn(`[${logname}]失败文件列表:`);
    stats.failList.forEach(f => logger.warn(`  ${f}`));
    logger.warn(`[${logname}]====================================`);
}
