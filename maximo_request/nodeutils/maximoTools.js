import request from '../nodeutils/requestHttp.js'
import { readFileContent, readJsonFile, readXmlFile, resolveFilePath, listFiles } from './fileUtils.js'
import logger from './logger.js';
import { getConfig } from './config.js';
import os from 'os'
import path from 'path'

/**
 * 解析请求体内容：JSON 文件解析为对象，避免非法 JSON 字符串被 axios 当作普通字符串二次序列化；
 * 非 JSON 文件（如 XML）原样返回字符串。
 * @param {string} fileName - 文件名（用于判断是否为 JSON）
 * @param {string} fileContent - 文件内容
 * @param {string} logname - 日志打印名称
 * @returns {{ok: boolean, data: any}} ok 为 false 表示 JSON 解析失败
 */
function parseRequestBody(fileName, fileContent, logname) {
    if (fileName && fileName.toLowerCase().endsWith('.json')) {
        try {
            return { ok: true, data: JSON.parse(fileContent) };
        } catch (e) {
            logger.error(`[${logname}]JSON解析失败: ${e.message}`);
            return { ok: false, data: null };
        }
    }
    return { ok: true, data: fileContent };
}

/**
 * 导入Maximo对象配置（新接口 SKS_MIGRATEAPI_CONFIGUR）
 * 请求体为新模式导出 JSON（SKS_MIGRATE_<对象名>.js 的 getDetail 结果），
 * 支持 {maxObjects:[...]}、裸数组或单个对象定义三种格式。
 * 返回 { status, data:{ total, added, updated, skipped, failed, results, sks:*SumTotal }, message }
 * @param {Object} options - 配置选项
 * @param {string} options.fileName - 配置文件（JSON，支持 {maxObjects:[...]}、数组或单个对象定义）
 * @param {string} options.logname - 日志打印名称
 * @param {boolean} [options.dmDeploySet=false] - 迁移模式，显式设置 MAXTYPE/LENGTH/SCALE（含 0）
 * @param {boolean} [options.ignoreAttributes=false] - 跳过属性处理
 * @param {boolean} [options.ignoreRelationships=false] - 跳过关系处理
 * @param {boolean} [options.debug=false] - 返回 debugMsg 调试信息
 * @returns {Promise<Object|string|null>} 接口响应对象；请求失败返回 null
 */
export async function importMaxObject({fileName, logname, dmDeploySet = false, ignoreAttributes = false, ignoreRelationships = false, debug = false, urlParams = {}}) {
    if(!logname||logname===""||logname===null){
        logname = fileName
    }
    try {
        const fileContent = readFileContent(fileName);
        if (!fileContent) {
            logger.error(`[${logname}]文件读取失败: ${fileName}`);
            return null;
        }

        logger.info(`[${logname}]成功读取文件: ${fileName}`);
        logger.info(`[${logname}]文件大小: ${fileContent.length} 字节`);

        const body = parseRequestBody(fileName, fileContent, logname);
        if (!body.ok) {
            return null;
        }

        const params = {
            _action: 'import',
            _langcode: String(getConfig().langcode || 'zh').toUpperCase()
        };
        if (dmDeploySet) {
            params.dmDeploySet = 'true';
        }
        if (ignoreAttributes) {
            params.ignoreAttributes = 'true';
        }
        if (ignoreRelationships) {
            params.ignoreRelationships = 'true';
        }
        if (debug) {
            params._debug = 'true';
        }

        // urlParams 最后合并，允许覆盖以上默认参数
        Object.assign(params, urlParams);

        logger.info(`[${logname}]开始发送请求...`);
        const response = await request({
            url: '/api/script/SKS_MIGRATEAPI_CONFIGUR',
            method: 'post',
            params,
            data: body.data
        });

        logger.info(`[${logname}]收到响应`);

        // 接口返回的是 JSON 字符串，个别环境可能带 BOM 或前后空白
        let result = response;
        if (typeof response === 'string') {
            const text = response.replace(/^\uFEFF/, '').trim();
            try {
                result = JSON.parse(text);
            } catch (e) {
                logger.warn(`[${logname}]响应不是合法 JSON，按原始字符串返回`);
                return response;
            }
        }

        // 新接口返回 { status, data:{ results, sks:*SumTotal }, message }
        if (result && typeof result === 'object') {
            if (result.status === 'error') {
                logger.error(`[${logname}]导入失败: ${result.message || '未知错误'}`);
            } else {
                logger.warn(`[${logname}]${result.message || '导入完成'}`);
                const failSum = Number(result.data && result.data['sks:failSumTotal']) || 0;
                if (failSum > 0) {
                    const failedRows = [];
                    const collect = (rows) => (rows || []).forEach(row => {
                        if (!row || typeof row !== 'object') return;
                        if (row._status === 'failed') {
                            failedRows.push(`${row['sks:objectName']}(${row['sks:ref']}) ${row._message || ''}`);
                        }
                        collect(row.attributes);
                        collect(row.indexes);
                        collect(row.relationships);
                    });
                    collect(result.data.results);
                    logger.warn(`[${logname}]失败行数: ${failSum}，明细: ${failedRows.join('、')}`);
                }
            }
        }
        return result;
    } catch (error) {
        logger.error(`[${logname}]请求出错:`, error.message)
        if (error.response) {
            logger.error(`[${logname}]服务器返回错误:`, error.response.data)
        } else if (error.request) {
            logger.error(`[${logname}]请求已发出但无响应`)
        } else {
            logger.error(`[${logname}]错误详情:`, error)
        }
        return null
    }
}

/**
 * 导入Maximo消息配置（新模式 SKS_MIGRATEAPI_MAXMESSAGES）
 * 请求体支持 {messages:[...]} 或裸数组（自动包装为 {messages:[...]}）。
 * 返回 { status, data:{ total, added, updated, deleted, failed, results, sks:*SumTotal }, message }
 * @param {Object} options - 配置选项
 * @param {string} options.fileName - 消息配置文件（JSON）
 * @param {string} options.logname - 日志打印名称
 * @param {boolean} [options.dmDeploySet=false] - 迁移模式
 * @param {boolean} [options.allLangcode=false] - 同时处理所有语言（_allLangcode）
 * @param {Object} [options.urlParams={}] - 覆盖/追加接口 URL 参数，优先级最高
 * @returns {Promise<Object|string|null>} 接口响应对象；请求失败返回 null
 */
export async function importMaxMessage({fileName, logname, dmDeploySet = false, allLangcode = false, urlParams = {}}) {
    if(!logname||logname===""||logname===null){
        logname = fileName
    }
    try {
        const fileContent = readFileContent(fileName);
        if (!fileContent) {
            logger.error(`[${logname}]文件读取失败: ${fileName}`);
            return null;
        }

        logger.info(`[${logname}]成功读取文件: ${fileName}`);
        logger.info(`[${logname}]文件大小: ${fileContent.length} 字节`);

        const body = parseRequestBody(fileName, fileContent, logname);
        if (!body.ok) {
            return null;
        }

        // 脚本要求 {messages:[...]}，裸数组时自动包装
        const data = Array.isArray(body.data) ? { messages: body.data } : body.data;

        const params = {
            _action: 'import',
            _langcode: String(getConfig().langcode || 'zh').toUpperCase()
        };
        if (dmDeploySet) {
            params.dmDeploySet = 'true';
        }
        if (allLangcode) {
            params._allLangcode = 'true';
        }

        // urlParams 最后合并，允许覆盖以上默认参数
        Object.assign(params, urlParams);

        logger.info(`[${logname}]开始发送请求...`);
        const response = await request({
            url: '/api/script/SKS_MIGRATEAPI_MAXMESSAGES',
            method: 'post',
            params,
            data
        });

        logger.info(`[${logname}]收到响应`);

        let result = response;
        if (typeof response === 'string') {
            const text = response.replace(/^\uFEFF/, '').trim();
            try {
                result = JSON.parse(text);
            } catch (e) {
                logger.warn(`[${logname}]响应不是合法 JSON，按原始字符串返回`);
                return response;
            }
        }

        if (result && typeof result === 'object') {
            if (result.status === 'error') {
                logger.error(`[${logname}]导入失败: ${result.message || '未知错误'}`);
            } else {
                logger.warn(`[${logname}]${result.message || '导入完成'}`);
                const failSum = Number(result.data && result.data['sks:failSumTotal']) || 0;
                if (failSum > 0) {
                    const failedRows = (result.data.results || [])
                        .filter(row => row && row._status === 'failed')
                        .map(row => `${row['sks:objectName']}(${row['sks:ref']}) ${row._message || ''}`);
                    logger.warn(`[${logname}]失败行数: ${failSum}，明细: ${failedRows.join('、')}`);
                }
            }
        }
        return result;
    } catch (error) {
        logger.error(`[${logname}]请求出错:`, error.message)
        if (error.response) {
            logger.error(`[${logname}]服务器返回错误:`, error.response.data)
        } else if (error.request) {
            logger.error(`[${logname}]请求已发出但无响应`)
        } else {
            logger.error(`[${logname}]错误详情:`, error)
        }
        return null
    }
}

/**
 * 导入Maximo工作流（SKS.AUTOSCRIPT.WORKFLOW）
 * 默认参数: _type=workflows&_action=import&_impMode=add&_enable=true
 * 请求体支持导出结果原样回导（{actions,maxroles,workflows} 迁移包）、{workflows:[...]}、裸数组或单对象。
 * 返回解析后的响应对象 { status, message, impMode, summary:{total,success,failed}, result, workflows? }
 * @param {Object} options - 配置选项
 * @param {string} options.fileName - 工作流配置文件（JSON）
 * @param {string} options.logname - 日志打印名称
 * @param {string} [options.type=workflows] - _type: workflows / actions / maxroles
 * @param {string} [options.impMode=add] - _impMode: add(不存在则新增，存在则跳过) / migration(存在则修改)
 * @param {boolean} [options.enable=true] - _enable: 导入后是否按源定义激活流程
 * @param {Object} [options.urlParams={}] - 覆盖/追加接口 URL 参数，优先级最高
 * @returns {Promise<Object|string|null>} 接口响应对象；请求失败返回 null
 */
export async function importMaxWorkflow({fileName, logname, type = 'workflows', impMode = 'add', enable = true, urlParams = {}}) {
    if(!logname||logname===""||logname===null){
        logname = fileName
    }
    try {
        const fileContent = readFileContent(fileName);
        if (!fileContent) {
            logger.error(`[${logname}]文件读取失败: ${fileName}`);
            return null;
        }

        logger.info(`[${logname}]成功读取文件: ${fileName}`);
        logger.info(`[${logname}]文件大小: ${fileContent.length} 字节`);

        const body = parseRequestBody(fileName, fileContent, logname);
        if (!body.ok) {
            return null;
        }

        const params = {
            _type: type,
            _action: 'import',
            _impMode: impMode,
            _enable: String(enable),
            _langcode: getConfig().langcode
        };

        // urlParams 最后合并，允许覆盖以上默认参数
        Object.assign(params, urlParams);

        logger.info(`[${logname}]开始发送请求...`);
        const response = await request({
            url: '/api/script/SKS.AUTOSCRIPT.WORKFLOW',
            method: 'post',
            params,
            data: body.data
        });

        logger.info(`[${logname}]收到响应`);

        let result = response;
        if (typeof response === 'string') {
            const text = response.replace(/^\uFEFF/, '').trim();
            try {
                result = JSON.parse(text);
            } catch (e) {
                logger.warn(`[${logname}]响应不是合法 JSON，按原始字符串返回`);
                return response;
            }
        }

        if (result && typeof result === 'object') {
            if (result.status === 'error') {
                logger.error(`[${logname}]导入失败: ${result.message || '未知错误'}`);
                return result;
            }
            const summary = result.summary || {};
            logger.warn(`[${logname}]${result.message || '导入完成'} 总计:${summary.total ?? 0} 成功:${summary.success ?? 0} 失败:${summary.failed ?? 0}`);
            // 逐条失败明细：迁移包分别在 actions / maxroles / workflows.result，单类型在 result
            const rows = [];
            ['actions', 'maxroles', 'workflows'].forEach(section => {
                const sec = result[section];
                if (sec && Array.isArray(sec.result)) {
                    rows.push(...sec.result);
                }
            });
            if (Array.isArray(result.result)) {
                rows.push(...result.result);
            }
            rows.filter(r => r && r.status === 'FAILED').forEach(r => {
                const name = r.processName || r.action || r.maxrole || r.id || '未知';
                const rev = r.processRev !== undefined ? `(${r.processRev})` : '';
                logger.error(`[${logname}]  - ${name}${rev}: ${r.message || '失败'}`);
            });
        }
        return result;
    } catch (error) {
        logger.error(`[${logname}]请求出错:`, error.message)
        if (error.response) {
            logger.error(`[${logname}]服务器返回错误:`, error.response.data)
        } else if (error.request) {
            logger.error(`[${logname}]请求已发出但无响应`)
        } else {
            logger.error(`[${logname}]错误详情:`, error)
        }
        return null
    }
}

/**
 * 导入Maximo对象配置（旧版接口 SKS.AUTOSCRIPT.LIBRARY）
 * @param {Object} options - 配置选项
 * @param {string} options.fileName - 配置文件名（JSON或XML）
 * @param {string} options.logname - 日志打印名称
 * @returns {Promise<boolean>} 是否导入成功
 */
export async function importMaxObjectV1({fileName, logname, urlParams = {}}) {
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
        
        const body = parseRequestBody(fileName, fileContent, logname);
        if (!body.ok) {
            return false;
        }

        // 发送请求到Maximo API
        logger.info(`[${logname}]开始发送请求...`);
        const response = await request({
            url: '/api/script/SKS.AUTOSCRIPT.LIBRARY',
            method: 'post',
            params: {
                develop: true,
                _langcode: getConfig().langcode,
                ...urlParams,
            },
            data: body.data,  // 将文件内容作为请求体发送
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
export async function importMaxPresentation({fileName, logname, urlParams = {}}) {
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
        
        const body = parseRequestBody(fileName, fileContent, logname);
        if (!body.ok) {
            return false;
        }

        logger.info(`[${logname}]开始发送请求...`);
        const response = await request({
            url: '/api/script/SKS.AUTOSCRIPT.SCREENS',
            method: 'post',
              headers: {
                'Content-Type': 'application/xml'
            },
            params: {
                _langcode: getConfig().langcode,
                ...urlParams,
            },
            data: body.data
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
 * 解析 SKS.AUTOSCRIPT.OBJECTS 导入响应，统一处理字符串/对象
 * @param {any} response
 * @returns {Object|null}
 */
function parseImportResponse(response) {
    if (response === null || response === undefined) return null;
    if (typeof response === 'string') {
        try { return JSON.parse(response); } catch (e) { return null; }
    }
    return response;
}

/**
 * 判断 SKS.AUTOSCRIPT.OBJECTS 批量导入是否真正成功(HTTP 200 但 summary.failed>0 视为失败)
 * @param {any} response
 * @returns {{ok: boolean, summary: Object|null, result: Array}}
 */
function checkImportResult(response) {
    const data = parseImportResponse(response);
    if (!data || data.status !== 'success' || !data.summary) {
        return { ok: false, summary: data ? data.summary : null, result: data ? (data.result || []) : [] };
    }
    const failed = data.summary.failed || 0;
    if (failed > 0) {
        return { ok: false, summary: data.summary, result: data.result || [] };
    }
    return { ok: true, summary: data.summary, result: data.result || [] };
}

/**
 * 导入Maximo域
 * 走 SKS.AUTOSCRIPT.OBJECTS (_type=domains&_action=import), body 支持域数组 / {domains:[...]} / 单域对象
 * @param {Object} options - 配置选项
 * @param {string} options.fileName - 配置文件名(JSON)
 * @param {string} options.logname - 日志打印名称
 * @returns {Promise<boolean>} 是否导入成功
 */
export async function importMaxDomain({fileName, logname, urlParams = {}}) {
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
        logger.info(`[${logname}]准备导入domain: ${logname || '未指定'}`);

        const body = parseRequestBody(fileName, fileContent, logname);
        if (!body.ok) {
            return false;
        }

        logger.info(`[${logname}]开始发送请求...`);
        const response = await request({
            url: '/api/script/SKS.AUTOSCRIPT.OBJECTS',
            method: 'post',
            params: {
                _type: 'domains',
                _action: 'import',
                syncFlag: true,
                _langcode: getConfig().langcode,
                ...urlParams,
            },
            data: body.data
        })

        const { ok, summary, result } = checkImportResult(response);
        if (ok) {
            logger.warn(`[${logname}]导入成功 总计:${summary.total} 成功:${summary.success}`)
            return true
        } else {
            logger.error(`[${logname}]导入失败, 响应:`, response)
            if (result && result.length > 0) {
                result.filter(r => r.status === 'FAILED').forEach(r => {
                    logger.error(`[${logname}]  - ${r.domainid || r.id || '未知'}: ${r.message}`)
                })
            }
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
 * 导入Maximo对象结构(Integration Object / 发布通道)
 * 走 SKS.AUTOSCRIPT.OBJECTS (_type=integrationobjects&_action=import), body 为 {integrationobjects:[...]}
 * @param {Object} options - 配置选项
 * @param {string} options.fileName - 配置文件名(JSON)
 * @param {string} options.logname - 日志打印名称
 * @returns {Promise<boolean>} 是否导入成功
 */
export async function importMaxIntObject({fileName, logname, urlParams = {}}) {
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
        logger.info(`[${logname}]准备导入对象结构: ${logname || '未指定'}`);

        const body = parseRequestBody(fileName, fileContent, logname);
        if (!body.ok) {
            return false;
        }

        logger.info(`[${logname}]开始发送请求...`);
        const response = await request({
            url: '/api/script/SKS.AUTOSCRIPT.OBJECTS',
            method: 'post',
            params: {
                _type: 'integrationobjects',
                _action: 'import',
                _langcode: getConfig().langcode,
                ...urlParams,
            },
            data: body.data
        })

        const { ok, summary, result } = checkImportResult(response);
        if (ok) {
            logger.warn(`[${logname}]导入成功 总计:${summary.total} 成功:${summary.success}`)
            return true
        } else {
            logger.error(`[${logname}]导入失败, 响应:`, response)
            if (result && result.length > 0) {
                result.filter(r => r.status === 'FAILED').forEach(r => {
                    logger.error(`[${logname}]  - ${r.intobjectname || r.id || '未知'}: ${r.message}`)
                })
            }
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
export async function importMaxScript({fileName, logname, urlParams = {}}) {
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
            // Maximo 的资源 ID 是标准 base64 且把填充位 = 替换为 -（如 ...Uw== → ...Uw--），
            // 不能用 base64url（直接去掉填充会导致服务端找不到资源而返回 404）。
            const scriptId = Buffer.from(autoscript).toString('base64').replace(/=+$/, m => '-'.repeat(m.length));
            deployUrl = `api/os/MXSCRIPT/_${scriptId}`;
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
            params: {
                ...urlParams
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
export async function importMaxAutoKey({fileName, logname, urlParams = {}}) {
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
        
        const body = parseRequestBody(fileName, fileContent, logname);
        if (!body.ok) {
            return false;
        }

        logger.info(`[${logname}]开始发送请求...`);
        const response = await request({
            url: '/api/script/SKS_DEPLOY_AUTOKEY',
            method: 'post',
            params: {
                develop: true,
                _langcode: getConfig().langcode,
                ...urlParams,
            },
            data: body.data
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
 * 导入Maximo应用信息配置（旧版接口 SKS_IMP_MAXAPPINFO）
 * @param {Object} options - 配置选项
 * @param {string} options.fileName - 配置文件名（JSON或XML）
 * @param {string} options.logname - 日志打印名称
 * @returns {Promise<boolean>} 是否导入成功
 */
export async function importMaxAppInfoV1({fileName, logname, urlParams = {}}) {
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
        
        const body = parseRequestBody(fileName, fileContent, logname);
        if (!body.ok) {
            return false;
        }

        logger.info(`[${logname}]开始发送请求...`);
        const response = await request({
            url: '/api/script/SKS_IMP_MAXAPPINFO',
            method: 'post',
            params: {
                develop: true,
                _langcode: getConfig().langcode,
                ...urlParams,
            },
            data: body.data
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
 * 导入Maximo应用信息配置（新接口，SKS.AUTOSCRIPT.SCREENS 的 _action=importAppInfo）
 * 与 V1 不同：使用 JS 调用时返回与接口一致的响应对象，可直接读取逐条导入结果。
 * @param {Object} options - 配置选项
 * @param {string} options.fileName - 应用信息 JSON 文件
 * @param {string} options.logname - 日志打印名称
 * @param {boolean} [options.dmDeploySet=false] - 迁移模式，对应接口的 dmDeploySet
 * @param {boolean} [options.errorAssert=false] - 单行失败立即中止，对应接口的 _errorAssert
 * @returns {Promise<Object|string|null>} 接口响应对象；失败返回 null
 */
export async function importMaxAppInfo({fileName, logname, dmDeploySet = false, errorAssert = false, urlParams = {}}) {
    if (!logname || logname === "" || logname === null) {
        logname = fileName
    }
    try {
        const fileContent = readFileContent(fileName)
        if (!fileContent) {
            logger.error(`[${logname}]文件读取失败: ${fileName}`)
            return null
        }

        logger.info(`[${logname}]成功读取文件: ${fileName}`)
        logger.info(`[${logname}]文件大小: ${fileContent.length} 字节`)

        const body = parseRequestBody(fileName, fileContent, logname)
        if (!body.ok) {
            return null
        }

        const params = {
            _action: 'importAppInfo',
            _langcode: String(getConfig().langcode || 'zh').toUpperCase()
        }
        if (dmDeploySet) {
            params.dmDeploySet = 'true'
        }
        if (errorAssert) {
            params._errorAssert = 'true'
        }
        // urlParams 最后合并，允许覆盖以上默认参数
        Object.assign(params, urlParams)

        logger.info(`[${logname}]开始发送请求...`)
        const response = await request({
            url: '/api/script/SKS.AUTOSCRIPT.SCREENS',
            method: 'post',
            params,
            data: body.data
        })

        logger.info(`[${logname}]收到响应`)

        // 接口返回的是 JSON 字符串，个别环境可能带 BOM 或前后空白
        if (typeof response === 'string') {
            const text = response.replace(/^\uFEFF/, '').trim()
            try {
                return JSON.parse(text)
            } catch (e) {
                logger.warn(`[${logname}]响应不是合法 JSON，按原始字符串返回`)
                return response
            }
        }
        return response
    } catch (error) {
        logger.error(`[${logname}]请求出错:`, error.message)
        if (error.response) {
            logger.error(`[${logname}]服务器返回错误:`, error.response.data)
        } else if (error.request) {
            logger.error(`[${logname}]请求已发出但无响应`)
        } else {
            logger.error(`[${logname}]错误详情:`, error)
        }
        return null
    }
}

export async function callMaxScript({ apiScriptName, fileName, params = {}, logname, urlParams = {} }) {
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
                // urlParams 优先级最高，存在同名属性时覆盖以上参数
                ...urlParams,
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
export async function batchImport({ dirName, files, extFilter, recursive = true, importFn, logname = '批量导入', concurrency = 1, continueOnError = true, urlParams = {} }) {
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
                const result = await importFn({ fileName: filename, logname, urlParams });
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
