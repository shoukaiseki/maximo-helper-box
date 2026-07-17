// @ts-check
/* eslint-disable no-redeclare */
/* eslint-disable indent */
/* eslint-disable quotes */
/* eslint-disable no-undef */
// @ts-nocheck
/// <reference path="@javaapi/global.d.ts" />
//可用于控制字段只读

// load('nashorn:mozilla_compat.js');
// importPackage(java.io);
// importPackage(java.sql);

/** @type {psdi.util.MXException} */
MXException = Java.type("psdi.util.MXException");

/** @type {psdi.util.MXApplicationException} */
MXApplicationException = Java.type("psdi.util.MXApplicationException");//8

/** @type {psdi.server.MXServer} */
MXServer = Java.type("psdi.server.MXServer");//13

/** @type {java.util.HashMap} */
HashMap = Java.type("java.util.HashMap");

/** @type {com.ibm.json.java.JSONArray} */
JSONArray = Java.type("com.ibm.json.java.JSONArray");
/** @type {com.ibm.json.java.JSONObject} */
JSONObject = Java.type("com.ibm.json.java.JSONObject");

/** @type {psdi.mbo.MboConstants} */
MboConstants = Java.type("psdi.mbo.MboConstants");
var scriptName=service.getScriptName()

/** @type {java.lang.System} */
System = Java.type("java.lang.System");
/** @type {org.apache.log4j.Level} */
Level = Java.type("org.apache.log4j.Level");
/** @type {psdi.util.logging.MXLoggerFactory} */
MXLoggerFactory = Java.type("psdi.util.logging.MXLoggerFactory");
/** @type {psdi.util.logging.MXLogger} */
var loggerMX = MXLoggerFactory.getLogger("maximo.script." + service.getScriptName());
var sksLogAnsiUtils=service.invokeScript("SKS_LOG_ANSI_UTILS");
loggerMX.error("["+scriptName+"]----------1");
/** @type {jscustom.AnsiLogger} */
var logger =sksLogAnsiUtils.newAnsiLogger({logger:loggerMX, ansiOpen:true})
// logger.setLevel(Level.INFO);
logger.info("["+scriptName+"]----------------Starting execution of script " + service.getScriptName());
logger.info("["+scriptName+"]-------------webclientsession=" + service.webclientsession())



/** @type {java.lang.String} */
var requestBodyTmp=requestBody

/** @type {psdi.security.UserInfo} */
var userInfoTmp=userInfo

/** @type {com.ibm.tivoli.maximo.oslc.provider.OslcRequest} */
var requestTmp=request

/** @type {java.util.HashMap} */
var responseHeadersTmp=responseHeaders

/** @type {java.lang.String} */
var httpMethodTmp=httpMethod


// var clientsession = service.webclientsession();
//接口中获取不到的
// clientsession.showMessageBox(clientsession.getCurrentEvent(), "Warnning", "----删除----" + mbo.getString("STATUS"), 1);
// clientsession.showMessageBox(clientsession.getCurrentEvent(), new MXApplicationException("fusion", "TestOk"));


// service.
// /** @type {psdi.security.UserInfo} */
// var profile = userInfo.getProfile()


// ============================================================
// 查询 IBM_AUTOSCRIPT_HISTORY 数据, 写入 JSON, 执行 jar 生成 Excel
// ============================================================

var File = Java.type("java.io.File");
var FileWriter = Java.type("java.io.FileWriter");
var ProcessBuilder = Java.type("java.lang.ProcessBuilder");
var BufferedReader = Java.type("java.io.BufferedReader");
var InputStreamReader = Java.type("java.io.InputStreamReader");

// 获取 Maximo 可写缓存目录 (系统会自动清理)
var tempDir = null;
var tempPaths = [
    "/tmp/jxls_temp",
    "/data/ibm/mas/DOCLINKS/jxls/tmp"
];
try {
    // 尝试从 MXServer 获取工作目录
    var mxServerTmp = MXServer.getMXServer();
    var workDir = mxServerTmp.getProperty("mxe.dir.work");
    if (workDir) {
        tempDir = new File(workDir, "tabledownload");
    }
} catch (e) {
    // fallback
}
if (tempDir == null) {
    tempDir = new File(tempPaths[0]);
}
tempDir.mkdirs();
logger.info("[" + scriptName + "] exportExcel tempDir=" + tempDir);

var JXLS_HOME = "/data/ibm/mas/DOCLINKS/jxls";
var libDir = JXLS_HOME + "/lib";

// 可用的表名称列表及其查询、shee名、标题等配置
var tableConfigs = {
    "IBM_AUTOSCRIPT_HISTORY": {
        query: "IBM_AUTOSCRIPT_HISTORYID, AUTOSCRIPT, ALIASNAME, VERSION, HOSTNAME, CREATEPERSON, CREATETIME",
        sheetName: "脚本历史记录",
        title: "脚本历史记录导出",
        headers: ["ID", "脚本名称", "别名", "版本", "主机名", "创建人", "创建时间"],
        orderBy: "CREATETIME DESC"
    }
};

// 解析请求参数 (支持 requestBody JSON 和 URL 查询参数两种方式)
var params = {};
try {
    if (requestBody && requestBody.trim()) {
        var parsed = JSON.parse(requestBody);
        for (var pk in parsed) {
            if (parsed.hasOwnProperty(pk)) {
                params[pk] = parsed[pk];
            }
        }
    }
} catch (e) {
    logger.warn("["+scriptName+"] 解析 requestBody 失败: " + e);
}
try {
    // 从 URL 查询参数读取 (例如 ?deleteJson=true&tableName=xxx)
    if (request) {
        try {
            // OslcRequest 可以通过 getHttpServletRequest() 获取底层 HttpServletRequest
            var httpReq = null;
            try {
                httpReq = request.getHttpServletRequest();
                logger.info("["+scriptName+"] httpReq类型: " + (httpReq ? httpReq.getClass().getName() : "null"));
            } catch (e) {
                logger.warn("["+scriptName+"] getHttpServletRequest 失败: " + e);
                httpReq = request;
            }
            if (httpReq) {
                var knownParams = ["deleteJson", "tableName", "templatePath"];
                for (var pi = 0; pi < knownParams.length; pi++) {
                    try {
                        var pv = httpReq.getParameter(knownParams[pi]);
                        if (pv != null) {
                            params[knownParams[pi]] = pv;
                            logger.info("["+scriptName+"] URL参数: " + knownParams[pi] + "=" + pv);
                        }
                    } catch (e) {
                        logger.warn("["+scriptName+"] getParameter(" + knownParams[pi] + ") 失败: " + e);
                    }
                }
            }
        } catch (e) {
            logger.warn("["+scriptName+"] request 处理失败: " + e);
        }
    }
} catch (e) {
    logger.warn("["+scriptName+"] 解析 URL 参数失败: " + e);
}
logger.info("["+scriptName+"] 最终参数: " + JSON.stringify(params));

// 默认使用 IBM_AUTOSCRIPT_HISTORY, 可通过参数指定 tableName
var tableName = params.tableName || "IBM_AUTOSCRIPT_HISTORY";
var cfg = tableConfigs[tableName];
if (!cfg) {
    responseBody = JSON.stringify({"status": "error", "message": "不支持的表格: " + tableName + ", 可选: " + Object.keys(tableConfigs).join(", ")});
    throw new Error("不支持的表格: " + tableName);
}

// 查找 jar 文件: 先查 lib/ 目录, 没有就查 JXLS_HOME 根目录(上传服务上传到这里)
var jarPath = libDir + "/maximo-server-jxls-1.0.0.jar";
var jarFile = new File(jarPath);

if (!jarFile.exists()) {
    logger.info("["+scriptName+"] lib 目录下未找到 jar, 查找 JXLS_HOME 根目录...");
    var jxlsDir = new File(JXLS_HOME);
    var files = jxlsDir.listFiles();
    var latestJar = null;
    for (var i = 0; files != null && i < files.length; i++) {
        var fname = files[i].getName();
        if (fname.indexOf("maximo-server-jxls") >= 0 && fname.endsWith(".jar")) {
            if (latestJar == null || files[i].lastModified() > latestJar.lastModified()) {
                latestJar = files[i];
            }
        }
    }
    if (latestJar != null) {
        jarPath = latestJar.getAbsolutePath();
        jarFile = latestJar;
        logger.info("["+scriptName+"] 找到 jar 文件: " + jarPath);
    }
}

if (!jarFile.exists()) {
    var errMsg = "jar 文件不存在: " + jarPath;
    logger.error("["+scriptName+"] " + errMsg);
    // 添加调试信息
    var debugInfo = {
        "status": "error",
        "message": errMsg,
        "jarPath": jarPath,
        "JXLS_HOME_exists": new File(JXLS_HOME).exists(),
        "libDir_exists": new File(libDir).exists()
    };
    var jxlsDir2 = new File(JXLS_HOME);
    var files2 = jxlsDir2.listFiles();
    if (files2 != null) {
        var fileNames = [];
        for (var fi = 0; fi < files2.length; fi++) {
            fileNames.push(files2[fi].getName());
        }
        debugInfo.filesInJxlsHome = fileNames;
    } else {
        debugInfo.filesInJxlsHome = "listFiles() returned null";
    }
    responseBody = JSON.stringify(debugInfo);
} else {
    logger.info("["+scriptName+"] jar 文件存在, 大小=" + jarFile.length() + " bytes");

    var timestamp = java.lang.System.currentTimeMillis();
    var jsonFile = tempDir.getAbsolutePath() + "/" + tableName + "_" + timestamp + ".json";
    var excelFile = tempDir.getAbsolutePath() + "/" + tableName + "_" + timestamp + ".xlsx";
    logger.info("["+scriptName+"] jsonFile=" + jsonFile + ", excelFile=" + excelFile);

    // 1. 查询数据 (使用 JDBC 绕过 MboSet 的 5000 条限制)
    var mxServer = MXServer.getMXServer();
    var dbManager = mxServer.getDBManager();
    var connKey = userInfo.getConnectionKey();
    var conn = null;
    var stmt = null;
    var rs = null;
    var dataArray = new JSONArray();
    var rowNum = 0;
    var jsonObj = new JSONObject();
    logger.info("["+scriptName+"] 开始查询 " + tableName + " 数据 (JDBC)...");
    try {
        conn = dbManager.getConnection(connKey);
        var sql = "SELECT " + cfg.query + " FROM " + tableName;
        if (cfg.orderBy) {
            sql += " ORDER BY " + cfg.orderBy;
        }
        logger.info("["+scriptName+"] SQL: " + sql);
        stmt = conn.createStatement(java.sql.ResultSet.TYPE_FORWARD_ONLY, java.sql.ResultSet.CONCUR_READ_ONLY);
        rs = stmt.executeQuery(sql);

        jsonObj.put("sheetName", cfg.sheetName);
        jsonObj.put("title", cfg.title);

        var headers = new JSONArray();
        for (var hi = 0; hi < cfg.headers.length; hi++) {
            headers.add(cfg.headers[hi]);
        }
        jsonObj.put("headers", headers);

        // 从查询字段中提取列名 (按逗号分割,去掉空格和别名)
        var fieldNames = [];
        var fieldParts = cfg.query.split(",");
        for (var fi = 0; fi < fieldParts.length; fi++) {
            var part = fieldParts[fi].trim();
            // 取 AS 后面的部分作为列名, 否则直接用字段名
            var asIdx = part.toUpperCase().lastIndexOf(" AS ");
            if (asIdx >= 0) {
                fieldNames.push(part.substring(asIdx + 4).trim());
            } else {
                // 去掉表名前缀如 "T." 
                var dotIdx = part.lastIndexOf(".");
                if (dotIdx >= 0) {
                    fieldNames.push(part.substring(dotIdx + 1));
                } else {
                    fieldNames.push(part);
                }
            }
        }
        logger.info("["+scriptName+"] 字段列表: " + JSON.stringify(fieldNames));

        while (rs.next()) {
            rowNum++;
            var row = new JSONArray();
            for (var fi = 0; fi < fieldNames.length; fi++) {
                row.add(rs.getString(fieldNames[fi]));
            }
            dataArray.add(row);
            if (rowNum % 1000 == 0) {
                logger.info("["+scriptName+"] 已处理 " + rowNum + " 条");
            }
        }
        jsonObj.put("data", dataArray);
        logger.info("["+scriptName+"] JDBC 查询完成, 共 " + rowNum + " 条记录");
    } catch (e) {
        logger.error("["+scriptName+"] JDBC 查询失败: " + e);
        jsonObj.put("data", dataArray);
        jsonObj.put("headers", new JSONArray());
        throw e;
    } finally {
        // 确保 JDBC 资源按顺序关闭
        if (rs != null) { try { rs.close(); } catch (e) {} }
        if (stmt != null) { try { stmt.close(); } catch (e) {} }
        if (conn != null) {
            try { dbManager.freeConnection(connKey, conn); } catch (e) {
                try { conn.close(); } catch (e2) {}
            }
        }
    }

    // 3. 写入 JSON 文件
    var fw = new FileWriter(jsonFile);
    fw.write(jsonObj.serialize());
    fw.close();
    logger.info("["+scriptName+"] JSON 文件已写入: " + jsonFile + ", 记录数=" + rowNum);

    // 4. 执行 jar 生成 Excel
    var cmdArgs = ["java", "-jar", jarPath, "--input", jsonFile, "--output", excelFile];

    // jar 现在必须传 --template
    // 先查 templates/ 目录, 没有就查 JXLS_HOME 根目录 (上传服务上传到这里)
    var templatePath = params.templatePath;
    if (!templatePath) {
        var templatesDir = new File(JXLS_HOME + "/templates");
        var templateFileInDir = new File(templatesDir, "test_template.xlsx");
        if (templateFileInDir.exists()) {
            templatePath = templateFileInDir.getAbsolutePath();
            logger.info("["+scriptName+"] 在 templates/ 目录找到模板: " + templatePath);
        } else {
            logger.info("["+scriptName+"] templates/ 目录未找到模板, 查找 JXLS_HOME 根目录...");
            var jxlsDir = new File(JXLS_HOME);
            var files = jxlsDir.listFiles();
            var latestTemplate = null;
            for (var i = 0; files != null && i < files.length; i++) {
                var fname = files[i].getName();
                if (fname.indexOf("test_template") >= 0 && fname.endsWith(".xlsx")) {
                    if (latestTemplate == null || files[i].lastModified() > latestTemplate.lastModified()) {
                        latestTemplate = files[i];
                    }
                }
            }
            if (latestTemplate != null) {
                templatePath = latestTemplate.getAbsolutePath();
                logger.info("["+scriptName+"] 找到模板文件: " + templatePath);
            } else {
                templatePath = JXLS_HOME + "/templates/test_template.xlsx";
                logger.warn("["+scriptName+"] 未找到模板文件, 使用默认路径: " + templatePath);
            }
        }
    } else {
        logger.info("["+scriptName+"] 使用传入的模板路径: " + templatePath);
    }
    cmdArgs.push("--template");
    cmdArgs.push(templatePath);
    var pb = new ProcessBuilder(cmdArgs);
    pb.directory(new File(JXLS_HOME));
    pb.redirectErrorStream(true);

    var startTime = java.lang.System.currentTimeMillis();
    var process = pb.start();

    var reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
    var line;
    var output = "";
    while ((line = reader.readLine()) != null) {
        output += line + "\n";
        logger.info("["+scriptName+"] [jar] " + line);
    }

    var exitCode = process.waitFor();
    var endTime = java.lang.System.currentTimeMillis();
    var duration = endTime - startTime;

    logger.info("["+scriptName+"] jar 执行完成, exitCode=" + exitCode + ", 耗时=" + duration + "ms");

    // 5. 检查输出文件并返回结果
    var excelFileObj = new File(excelFile);
    if (exitCode == 0 && excelFileObj.exists()) {
        logger.info("["+scriptName+"] Excel 文件生成成功: " + excelFile + ", 大小=" + excelFileObj.length() + " bytes");

        // 如果传入了 deleteJson=true 参数, 生成 Excel 后删除 JSON 文件
        if (params.deleteJson) {
            try {
                var jsonFileObj = new File(jsonFile);
                if (jsonFileObj.exists()) {
                    jsonFileObj.delete();
                    logger.info("["+scriptName+"] JSON 文件已删除: " + jsonFile);
                }
            } catch (e) {
                logger.warn("["+scriptName+"] 删除 JSON 文件失败: " + e);
            }
        }

        responseBody = JSON.stringify({
            "status": "success",
            "message": "Excel 导出成功",
            "file": excelFile,
            "fileName": excelFileObj.getName(),
            "fileSize": excelFileObj.length(),
            "recordCount": rowNum,
            "duration": duration,
            "jarOutput": output,
            "debugParams": {
                "deleteJson": params.deleteJson,
                "tableName": params.tableName,
                "templatePath": params.templatePath
            }
        });
    } else {
        var errMsg = "Excel 文件生成失败, exitCode=" + exitCode;
        logger.error("["+scriptName+"] " + errMsg);
        responseBody = JSON.stringify({
            "status": "error",
            "message": errMsg,
            "jarOutput": output
        });
    }
}
