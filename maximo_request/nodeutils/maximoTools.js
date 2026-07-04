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
                _langcode: 'zh',
            },
            data: {
                autoscript,
                source,
                version,
                aliasname,
                hostname
            }
        });
        
        logger.info(`[${autoscript}]脚本历史记录保存成功`);
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
        const jsonContent = readJsonFile(fileName);
        
        if (!jsonContent) {
            logger.error(`文件读取失败: ${fileName}`);
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
        logger.info(`[${actualLogname}]成功读取配置文件: ${fileName}`);
        logger.info(`[${actualLogname}]脚本名称: ${autoscript}`);
        logger.info(`[${actualLogname}]脚本语言: ${scriptLanguage}`);
        
        const dirname = fileName.substring(0, fileName.lastIndexOf('/')) || fileName.substring(0, fileName.lastIndexOf('\\')) || '';
        const scriptFileName = dirname ? `${dirname}/${autoscript}${scriptExt}` : `${autoscript}${scriptExt}`;
        
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
            hostname: require('os').hostname()
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
        const checkUrl = `os/MXAPIAUTOSCRIPT?lean=1&oslc.select=autoscript&oslc.where=autoscript="${autoscript}"`;
        
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
        
        if (scriptExists && scriptHref) {
            deployUrl = scriptHref;
            deployMethod = 'PATCH';
        } else {
            deployUrl = 'os/MXAPIAUTOSCRIPT';
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
        if (customFields.source) {
            deployBody['spi:source'] = customFields.source;
        } else {
            deployBody['spi:source'] = '';
        }
        
        logger.info(`[${actualLogname}]步骤2: 发送${deployMethod}请求到: ${deployUrl}`);
        const deployResult = await request({
            url: deployUrl,
            method: deployMethod,
            headers: deployMethod === 'PATCH' ? {
                'Content-Type': 'application/merge-patch+json',
                'x-method-override': 'PATCH'
            } : {
                'Content-Type': 'application/json'
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