import request from '../nodeutils/requestHttp.js'
import { readJsonFile } from './fileUtils.js'

/**
 * 发送mock数据到TEST_MOCKDATA_ITEMA接口
 * @param {Object} options - 配置选项
 * @param {string} options.fileName - mock数据JSON文件名（相对于项目根目录或绝对路径）
 * @param {string} options.logname - 日志打印名称
 * @returns {Promise<boolean>} 是否发送成功
 */
export async function sendMockData({fileName, logname="mockdata"}) {
    try {
        // 读取JSON文件
        const jsonData = readJsonFile(fileName);
        
        if (!jsonData) {
            console.error(`[${logname}]JSON文件读取/解析失败: ${fileName}`);
            return false;
        }
        
        console.log(`[${logname}]成功读取文件: ${fileName}`);
        console.log(`[${logname}]申请单号: ${jsonData.APPLYNUM || 'N/A'}`);
        console.log(`[${logname}]明细行数: ${(jsonData.IBM_ITEM_APPLYLINE && jsonData.IBM_ITEM_APPLYLINE.length) || 0}`);
        
        // 发送请求到TEST_MOCKDATA_ITEMA接口
        console.log(`[${logname}]开始发送请求...`);
        const response = await request({
            url: '/api/script/TEST_MOCKDATA_ITEMA',
            method: 'post',
            data: jsonData  // 将JSON对象作为requestBody传入脚本
        })
        
        console.log(`[${logname}]收到响应`);
        console.log(`[${logname}]响应类型:`, typeof response);
        console.log(`[${logname}]响应内容:`, response);
        
        // 检查响应
        if (response !== null && response !== undefined) {
            console.log(`[${logname}]发送成功`)
            return true
        } else {
            console.error(`[${logname}]发送失败，响应为空或null`)
            console.error(`[${logname}]响应值:`, response)
            return false
        }
    } catch (error) {
        console.error(`[${logname}]请求出错:`, error.message)
        if (error.response) {
            console.error(`[${logname}]错误状态码:`, error.response.status)
            console.error(`[${logname}]错误响应数据:`, error.response.data)
        } else if (error.request) {
            console.error(`[${logname}]请求已发出但无响应`)
        } else {
            console.error(`[${logname}]错误详情:`, error)
        }
        return false
    }
}

/**
 * 批量发送mock数据（遍历指定目录下的所有JSON文件，或指定文件列表）
 * @param {Object} options - 配置选项
 * @param {string[]} options.files - mock数据JSON文件名列表
 * @param {string} options.logname - 日志打印名称
 * @returns {Promise<{total: number, success: number, fail: number}>} 统计结果
 */
export async function sendMockDataBatch({files, logname="mockdata"}) {
    const result = { total: files.length, success: 0, fail: 0 };
    
    for (let i = 0; i < files.length; i++) {
        const fileName = files[i];
        console.log(`\n========== [${logname}] 第 ${i + 1}/${files.length} 个 ==========`);
        console.log(`[${logname}]文件: ${fileName}`);
        
        const ok = await sendMockData({fileName, logname});
        if (ok) {
            result.success++;
        } else {
            result.fail++;
        }
    }
    
    console.log(`\n========== [${logname}] 批量导入完成 ==========`);
    console.log(`[${logname}]总计: ${result.total}, 成功: ${result.success}, 失败: ${result.fail}`);
    
    return result;
}

/**
 * 发送PO mock数据到MXPO OSLC API
 * @param {Object} options - 配置选项
 * @param {string} options.fileName - mock数据JSON文件名（包含PO数组）
 * @param {string} options.logname - 日志打印名称
 * @returns {Promise<{total: number, success: number, fail: number}>} 统计结果
 */
export async function sendPOMockData({fileName, logname="PO"}) {
    try {
        const jsonData = readJsonFile(fileName);
        if (!jsonData || !Array.isArray(jsonData)) {
            console.error(`[${logname}]JSON文件读取/解析失败或格式非数组: ${fileName}`);
            return { total: 0, success: 0, fail: 0 };
        }
        
        console.log(`[${logname}]成功读取文件: ${fileName}, 共 ${jsonData.length} 个PO`);
        
        const result = { total: jsonData.length, success: 0, fail: 0 };
        
        for (let i = 0; i < jsonData.length; i++) {
            const po = jsonData[i];
            console.log(`\n--- [${logname}] PO ${i + 1}/${jsonData.length} ---`);
            console.log(`[${logname}]VENDOR: ${po['spi:vendor']}, DESCRIPTION: ${po['spi:description']}`);
            console.log(`[${logname}]POLINE数: ${(po['spi:poline'] && po['spi:poline'].length) || 0}`);
            
            try {
                console.log(`[${logname}]开始发送请求...`);
                const response = await request({
                    url: '/api/os/MXPO',
                    method: 'post',
                    data: po
                });
                
                console.log(`[${logname}]响应:`, response);
                result.success++;
            } catch (error) {
                console.error(`[${logname}]PO创建失败:`, error.message);
                if (error.response) {
                    console.error(`[${logname}]错误状态码:`, error.response.status);
                    console.error(`[${logname}]错误响应:`, error.response.data);
                }
                result.fail++;
            }
        }
        
        console.log(`\n[${logname}]文件 ${fileName} 处理完成: 成功 ${result.success}, 失败 ${result.fail}`);
        return result;
    } catch (error) {
        console.error(`[${logname}]处理文件出错:`, error.message);
        return { total: 0, success: 0, fail: 0 };
    }
}

/**
 * 批量发送PO mock数据
 * @param {Object} options - 配置选项
 * @param {string[]} options.files - mock数据JSON文件名列表
 * @param {string} options.logname - 日志打印名称
 * @returns {Promise<{total: number, success: number, fail: number}>} 统计结果
 */
export async function sendPOMockDataBatch({files, logname="PO"}) {
    const result = { total: 0, success: 0, fail: 0 };
    
    for (let i = 0; i < files.length; i++) {
        const fileName = files[i];
        console.log(`\n========== [${logname}] 文件 ${i + 1}/${files.length} ==========`);
        
        const r = await sendPOMockData({fileName, logname});
        result.total += r.total;
        result.success += r.success;
        result.fail += r.fail;
    }
    
    console.log(`\n========== [${logname}] 全部完成 ==========`);
    console.log(`[${logname}]总计: ${result.total}, 成功: ${result.success}, 失败: ${result.fail}`);
    
    return result;
}

/**
 * 批量发送RL_IMPORT mock数据到TEST_MOCKDATA_RLIMPORT脚本接口
 * @param {Object} options - 配置选项
 * @param {number} options.loopCount - 循环调用次数，默认1
 * @param {number} options.rlCount - 每次调用创建的IBM_RL主表记录数，默认5
 * @param {number} options.minImportsPerRL - 每条主表最少子表记录数，默认100
 * @param {number} options.maxImportsPerRL - 每条主表最多子表记录数，默认500
 * @param {number} options.apprPercent - STATUS=APPR的比例(%)，默认90
 * @param {string} options.logname - 日志打印名称，默认RL_IMPORT
 * @returns {Promise<{loopCount: number, totalRL: number, totalImports: number, success: number, fail: number}>} 统计结果
 */
export async function sendRlImportMockDataBatch({
    loopCount = 1,
    rlCount = 5,
    minImportsPerRL = 100,
    maxImportsPerRL = 500,
    apprPercent = 90,
    logname = "RL_IMPORT"
} = {}) {
    const result = {
        loopCount,
        totalRL: 0,
        totalImports: 0,
        success: 0,
        fail: 0
    };

    const body = {
        rlCount,
        minImportsPerRL,
        maxImportsPerRL,
        apprPercent
    };

    console.log(`\n========== [${logname}] 开始批量生成 ==========`);
    console.log(`[${logname}]循环次数: ${loopCount}, 每次创建${rlCount}条IBM_RL`);
    console.log(`[${logname}]每条主表子表数: ${minImportsPerRL}~${maxImportsPerRL}`);
    console.log(`[${logname}]APPR比例: ${apprPercent}% (REQSOURCE/RLTYPE/PARTTYPE由脚本随机取域值)`);
    console.log(`[${logname}]预计总IBM_RL: ${loopCount * rlCount} 条`);
    console.log(`[${logname}]预计总IBM_RLIMPORT: ${loopCount * rlCount * Math.floor((minImportsPerRL + maxImportsPerRL) / 2)} 条(估算)`);

    const startTime = Date.now();

    for (let i = 0; i < loopCount; i++) {
        console.log(`\n--- [${logname}] 第 ${i + 1}/${loopCount} 次调用 ---`);
        try {
            const response = await request({
                url: '/api/script/TEST_MOCKDATA_RLIMPORT',
                method: 'post',
                data: body
            });

            if (response !== null && response !== undefined) {
                // 解析脚本返回的统计信息
                let parsed = null;
                try {
                    parsed = (typeof response === 'string') ? JSON.parse(response) : response;
                } catch (parseErr) {
                    parsed = null;
                }

                if (parsed && parsed.status === 'success') {
                    const rlCreated = parsed.rlCount || rlCount;
                    const importsCreated = parsed.totalImports || 0;
                    result.totalRL += rlCreated;
                    result.totalImports += importsCreated;
                    result.success++;
                    console.log(`[${logname}]成功: RL=${rlCreated}, IMPORT=${importsCreated}, APPR=${parsed.apprCount || '?'}, DRAFT=${parsed.draftCount || '?'}`);
                } else {
                    result.success++;
                    result.totalRL += rlCount;
                    console.log(`[${logname}]成功(响应无统计): 按默认${rlCount}条RL计算`);
                    console.log(`[${logname}]响应:`, response);
                }
            } else {
                result.fail++;
                console.error(`[${logname}]第${i + 1}次调用失败，响应为空`);
            }
        } catch (error) {
            result.fail++;
            console.error(`[${logname}]第${i + 1}次调用出错:`, error.message);
            if (error.response) {
                console.error(`[${logname}]错误状态码:`, error.response.status);
                console.error(`[${logname}]错误响应:`, error.response.data);
            }
        }
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n========== [${logname}] 批量生成完成 ==========`);
    console.log(`[${logname}]循环次数: ${loopCount}, 成功: ${result.success}, 失败: ${result.fail}`);
    console.log(`[${logname}]总IBM_RL: ${result.totalRL} 条`);
    console.log(`[${logname}]总IBM_RLIMPORT: ${result.totalImports} 条`);
    console.log(`[${logname}]耗时: ${elapsed} 秒`);

    return result;
}