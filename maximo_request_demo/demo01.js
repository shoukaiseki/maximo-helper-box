// 全局安装后使用包名
import {importMaxScript,importMaxAppInfo, importMaxAutoKey,importMaxObject,importMaxDomain, importMaxPresentation, loadConfig } from 'sks-maximo-utils';



importMaxObject({fileName: "DBMESSAGEJSON/0618.json",logname:"MESSAGEJSON操作成功消息"})
importMaxObject({fileName: "DBMESSAGEJSON/0624001.json",logname:""})

importMaxDomain({fileName: "DBDOMIANJSON/DEMO_STATUS.json",logname:"演示状态"})

importMaxObject({fileName: "DBCONFIGJSON/TEST01.json",logname:"测试配置01"})
importMaxObject({fileName: "DBCONFIGJSON/TEST02.json",logname:"测试配置02"})
importMaxObject({fileName: "DBCONFIGJSON/AUTOSCRIPT01.json",logname:"AUTOSCRIPT01"})
importMaxObject({fileName: "DBCONFIGJSON/DEMO_VIEW.json",logname:"演示视图"})

importMaxAutoKey({fileName: "DBAUTOKEY/AUTOKEY01.json",logname:"自动键01"})

importMaxPresentation({fileName: "DBMAXAPPXML/autoscript.xml",logname:""})
importMaxPresentation({fileName: "DBMAXAPPXML/ibm_autoscript_history.xml",logname:"ibm_autoscript_history"})

await importMaxAppInfo({fileName: "DBMAXAPPINFO/PR002.json",logname:"删除PR文件夹相关签名选项"}) //删除的,不要启用,测试用的
await importMaxAppInfo({fileName: "DBMAXAPPINFO/PR001.json",logname:"新增PR文件夹相关签名选项"})
//node demo01.js loc;node demo01.js hd;node demo01.js dev