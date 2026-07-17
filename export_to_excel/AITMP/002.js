// 全局安装后使用包名
import {fileUtils,callMaxScript,importMaxScript,importMaxAppInfo, importMaxAutoKey,importMaxObject,importMaxDomain, importMaxPresentation, loadConfig } from 'sks-maximo-utils';
var fileNames=[];


// await importMaxPresentation({fileName: "xmltmp/dev/ibm_po.xml",logname:""})
// await importMaxObject({fileName: "DBCONFIGJSON/260704001.json",logname:""})
// await importMaxObject({fileName: "DBMESSAGEJSON/260704001.json",logname:""})
// await importMaxScript({fileName: "E:/gitwork/wushiling/jsproject/masscript/ibm/system/doclinks/DOCLINKS.IBM_EXCEL.SAVE.js",logname:"SKS_IMP_MAXAPPINFO"})
// await importMaxAppInfo({fileName: "DBMAXAPPINFO/PR001.json",logname:"新增PR文件夹相关签名选项"})
// await importMaxAutoKey({fileName: "DBAUTOKEY/0629001.json",logname:"自动键"})
// await importMaxDomain({fileName: "DBDOMIANJSON/IBM_PRXLSTYPE.json",logname:"提货清单状态"})



//0715
// await importMaxObject({fileName: "DBCONFIGJSON/260714002.json",logname:""})
// await importMaxObject({fileName: "DBCONFIGJSON/260714003.json",logname:""})
// await importMaxObject({fileName: "DBCONFIGJSON/260714004.json",logname:""})
// await importMaxObject({fileName: "DBCONFIGJSON/IBM_PRLRPOOL.json",logname:""})


// await callMaxScript({scriptName:"TEST_SKS_EXCEL_JXLS01",params:{}})
await callMaxScript({apiScriptName:"TEST_SKS_EXCEL_JXLS01",fileName: "none.json",logname:"",params:{gnoreDefVal:true}})

//node nodetasks/0715001.js loc;node nodetasks/0715001.js hd;node nodetasks/0715001.js dev
