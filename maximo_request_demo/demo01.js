// 全局安装后使用包名
import {callMaxScript,importMaxScript,importMaxAppInfo, importMaxAutoKey,importMaxObject,importMaxDomain, importMaxPresentation, loadConfig, batchImport, printBatchStats } from 'sks-maximo-utils';



// await importMaxObject({fileName: "DBMESSAGEJSON/0618.json",logname:"MESSAGEJSON操作成功消息"})
// await importMaxObject({fileName: "DBMESSAGEJSON/0624001.json",logname:""})

// await importMaxDomain({fileName: "DBDOMIANJSON/DEMO_STATUS.json",logname:"演示状态"})

// await importMaxObject({fileName: "DBCONFIGJSON/TEST01.json",logname:"测试配置01"})
// await importMaxObject({fileName: "DBCONFIGJSON/TEST02.json",logname:"测试配置02"})
// await importMaxObject({fileName: "DBCONFIGJSON/AUTOSCRIPT01.json",logname:"AUTOSCRIPT01"})
// await importMaxObject({fileName: "DBCONFIGJSON/DEMO_VIEW.json",logname:"演示视图"})

// await importMaxAutoKey({fileName: "DBAUTOKEY/AUTOKEY01.json",logname:"自动键01"})

// await importMaxPresentation({fileName: "DBMAXAPPXML/autoscript.xml",logname:""})
// await importMaxPresentation({fileName: "DBMAXAPPXML/ibm_autoscript_history.xml",logname:"ibm_autoscript_history"})

// await importMaxAppInfo({fileName: "DBMAXAPPINFO/PR002.json",logname:"删除PR文件夹相关签名选项"}) //删除的,不要启用,测试用的
// await importMaxAppInfo({fileName: "DBMAXAPPINFO/PR001.json",logname:"新增PR文件夹相关签名选项"})

// await callMaxScript({apiScriptName:"SKS_LOGGER_MANAGE",fileName: "DBMXLOGGER/MXLOGGERSQL.json",logname:"MXLOGGERSQL"})

// ============ 通用批量导入 ============

// 方式一: 指定目录自动列出文件批量导入
// const stats = await batchImport({
//     dirName: "DBCONFIGJSON",        // 目录名（与files二选一）
//     extFilter: ".json",             // 扩展名过滤
//     importFn: importMaxObject,      // 导入函数（可换成 importMaxScript/importMaxDomain/importMaxAppInfo/importMaxPresentation 等）
//     logname: "批量导入对象",
//     concurrency: 1                  // 并发数，默认1串行
// });
// printBatchStats(stats);             // 打印批量导入统计结果

// 方式二: 直接指定文件列表批量导入
// const stats2 = await batchImport({
//     files: ["DBCONFIGJSON/TEST01.json", "DBCONFIGJSON/TEST02.json", "DBCONFIGJSON/DEMO_VIEW.json"],
//     importFn: importMaxObject,
//     logname: "批量导入指定文件"
// });
// printBatchStats(stats2);

// 方式三: 批量导入脚本（传入脚本文件路径，自动找同目录同名JSON配置）
 //const stats3 = await batchImport({
//     dirName: "DBMESSAGEJSON",
//     extFilter: ".json",
//     importFn: importMaxObject,
//     logname: "批量导入消息"
// });
 //printBatchStats(stats3);

//node demo01.js loc;node demo01.js hd;node demo01.js dev
