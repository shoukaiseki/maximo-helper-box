// 全局安装后使用包名
import {fileUtils,callMaxScript,importMaxScript,importMaxAppInfo, importMaxAutoKey,importMaxObject,importMaxDomain, importMaxPresentation, loadConfig } from 'sks-maximo-utils';
var fileNames=[];


// ========== 导入依赖脚本 ==========
// 导入通用工具脚本 (调用jar生成excel)
await importMaxScript({fileName: "EXPEXCEL_JXLS_UTILS.json", logname:"更新jar调用方法exportExcelEJxls"});
// 导入测试脚本
await importMaxScript({fileName: "TEST_SKS_EXCEL_JXLS02.json", logname:"导入测试脚本"});


// ========== 执行测试 ==========
await callMaxScript({apiScriptName:"TEST_SKS_EXCEL_JXLS02",fileName: "none.json",logname:"",params:{}})

//node nodetasks/0715001.js loc;node nodetasks/0715001.js hd;node nodetasks/0715001.js dev
