// @ts-check
/* eslint-disable no-redeclare */
/* eslint-disable indent */
/* eslint-disable quotes */
/* eslint-disable no-undef */
// @ts-nocheck
/// <reference path="@javaapi/global.d.ts" />
// load('nashorn:mozilla_compat.js');
//-------------------------------------------
// 直接调用方法的脚本,无任何隐式变量可以使用
var scriptName="EXPEXCEL_JXLS_UTILS"//service.getScriptName()
/** @type {java.lang.System} */
System = Java.type("java.lang.System");
/** @type {org.apache.log4j.Level} */
Level = Java.type("org.apache.log4j.Level");
/** @type {psdi.util.logging.MXLoggerFactory} */
MXLoggerFactory = Java.type("psdi.util.logging.MXLoggerFactory");
/** @type {psdi.util.logging.MXLogger} */
var loggerMX = MXLoggerFactory.getLogger("maximo.script." + scriptName);
/** @type {psdi.util.MXApplicationException} */
MXApplicationException = Java.type("psdi.util.MXApplicationException");//8
loggerMX.info("["+scriptName+"]----------");

/** @type {psdi.server.MXServer} */
MXServer = Java.type("psdi.server.MXServer");//13

/** @type {jscustom.AnsiLogger} */
var logger=null
/** @type {jscustom.sksLogAnsiUtils} */
var sksLogAnsiUtils=null


/**
 * 初始化日志记录器,在通用脚本中,每次都需要调用该方法以初始化logger
 * @param {com.ibm.tivoli.maximo.script.ScriptService} service - 脚本服务
 */
function initLogger(service){
    if(logger!=null){
        return
    }
    sksLogAnsiUtils = service.invokeScript("SKS_LOG_ANSI_UTILS");
    logger = sksLogAnsiUtils.newAnsiLogger({ logger: loggerMX, ansiOpen: true, printModel:true})
// logger.setLevel(Level.INFO);

    logger.info("[" + scriptName + "] initialize")
}

/**
 * ibm.expexcel.jxls.jarpath  jar路径
 *   /opt/ibm/maximo/DOCLINKS/java_project/excel_jxls/maximo-server-jxls.jar
 * ibm.expexcel.jxls.javacmdpath  java可执行文件路径
 *   /opt/java/openjdk/bin/java
 */
/**
 * 多次调用方式,脚本配置中 interface=0
    var result = service.invokeScript("EXPEXCEL_JXLS_UTILS","exportExcelEJxls",[service,conf]);

    var conf = {
      //模板文件路径
      tempFilepath: filePath,
      //临时目录,该目录会自动清理
      tempDir: tempDir,
      //导出文件名，包含路径
      extFilename: tempDir + "/" + filename,
      //要保存到json str的数据
      jsonData: jsonData,
    }

 *  被调用的方法
 * @param {com.ibm.tivoli.maximo.script.ScriptService} service - 脚本服务
 * @param {psdi.mbo.Mbo} mbo - MBO对象
 * @returns {string}
 * 
 */
function exportExcelEJxls(service,conf){
    service.log("["+scriptName+"] exportExcelEJxls start")
    initLogger(service);
    logger.info("[" + scriptName + "] exportExcelEJxls start2")
    var jarPath = MXServer.getMXServer().getProperty("ibm.expexcel.jxls.jarpath");
    var javaCmdPath = MXServer.getMXServer().getProperty("ibm.expexcel.jxls.javacmdpath");

    logger.info("[" + scriptName + "] exportExcelEJxls start3")
    logger.info("[" + scriptName + "] jarPath=" + jarPath)
    logger.info("[" + scriptName + "] javaCmdPath=" + javaCmdPath)

    if (!jarPath) {
        logger.error("[" + scriptName + "] 系统属性 ibm.expexcel.jxls.jarpath 未配置")
        throw new MXApplicationException("#", "系统属性 ibm.expexcel.jxls.jarpath 未配置")
    }
    if (!javaCmdPath) {
        javaCmdPath = "java"
        logger.info("[" + scriptName + "] 未配置 ibm.expexcel.jxls.javacmdpath, 使用默认: " + javaCmdPath)
    }

    /** @type {java.io.File} */
    var File = Java.type("java.io.File")
    /** @type {java.io.FileWriter} */
    var FileWriter = Java.type("java.io.FileWriter")
    /** @type {java.lang.ProcessBuilder} */
    var ProcessBuilder = Java.type("java.lang.ProcessBuilder")
    /** @type {java.io.BufferedReader} */
    var BufferedReader = Java.type("java.io.BufferedReader")
    /** @type {java.io.InputStreamReader} */
    var InputStreamReader = Java.type("java.io.InputStreamReader")

    // 从 conf 中获取路径配置
    var tempDir = conf.tempDir
    var tempFilepath = conf.tempFilepath   // 模板文件路径
    var extFilename = conf.extFilename     // 输出 Excel 文件路径
    var jsonData = conf.jsonData           // JSON 数据字符串

    if (!tempDir) {
        logger.error("[" + scriptName + "] conf.tempDir 为空")
        throw new MXApplicationException("#", "conf.tempDir 为空")
    }
    if (!tempFilepath) {
        logger.error("[" + scriptName + "] conf.tempFilepath 为空")
        throw new MXApplicationException("#", "conf.tempFilepath 为空")
    }
    if (!extFilename) {
        logger.error("[" + scriptName + "] conf.extFilename 为空")
        throw new MXApplicationException("#", "conf.extFilename 为空")
    }
    if (!jsonData) {
        // 如果没有 jsonData, 使用传入的 jsonStr 序列化
        throw new MXApplicationException("#", "jsonData 为空")
    }

    // 确保临时目录存在
    var tempDirFile = new File(tempDir)
    if (!tempDirFile.exists()) {
        tempDirFile.mkdirs()
    }

    // 生成临时 JSON 文件
    var timestamp = java.lang.System.currentTimeMillis()
    var jsonFile = tempDir + "/jxls_data_" + timestamp + ".json"
    logger.info("[" + scriptName + "] 写入 JSON 文件: " + jsonFile)

    var fw = new FileWriter(jsonFile)
    fw.write(jsonData)
    fw.close()
    logger.info("[" + scriptName + "] JSON 文件已写入")

    // 检查模板文件是否存在
    var templateFile = new File(tempFilepath)
    if (!templateFile.exists()) {
        logger.error("[" + scriptName + "] 模板文件不存在: " + tempFilepath)
        try {
            new File(jsonFile).delete()
        } catch (e2) {}
        throw new MXApplicationException("#", "模板文件不存在: " + tempFilepath)
    }

    // 检查 jar 文件是否存在
    var jarFile = new File(jarPath)
    if (!jarFile.exists()) {
        logger.error("[" + scriptName + "] jar 文件不存在: " + jarPath)
        try {
            new File(jsonFile).delete()
        } catch (e2) {}
        throw new MXApplicationException("#", "jar 文件不存在: " + jarPath)
    }

    // 确保输出目录存在
    var outputFileObj = new File(extFilename)
    var parentDir = outputFileObj.getParentFile()
    if (parentDir != null && !parentDir.exists()) {
        parentDir.mkdirs()
    }

    // 执行 jar 生成 Excel
    var cmdArgs = [javaCmdPath, "-jar", jarPath,
        "--input=" + jsonFile,
        "--template=" + tempFilepath,
        "--output=" + extFilename
    ]
    logger.info("[" + scriptName + "] 执行命令: " + cmdArgs.join(" "))

    var pb = new ProcessBuilder(cmdArgs)
    pb.redirectErrorStream(true)
    var process = pb.start()

    var reader = new BufferedReader(new InputStreamReader(process.getInputStream()))
    var line
    while ((line = reader.readLine()) != null) {
        logger.info("[" + scriptName + "] [jar] " + line)
    }

    var exitCode = process.waitFor()
    logger.info("[" + scriptName + "] jar 执行完成, exitCode=" + exitCode)

    // 删除临时 JSON 文件
    try {
        new File(jsonFile).delete()
        logger.info("[" + scriptName + "] 临时 JSON 文件已删除: " + jsonFile)
    } catch (e) {
        logger.warn("[" + scriptName + "] 删除 JSON 文件失败: " + e)
        throw new MXApplicationException("#", "删除 JSON 文件失败: " + e)
    }

    if (exitCode == 0 && outputFileObj.exists()) {
        logger.info("[" + scriptName + "] Excel 文件生成成功: " + extFilename + ", 大小=" + outputFileObj.length() + " bytes")
        return true
    } else {
        logger.error("[" + scriptName + "] Excel 文件生成失败, exitCode=" + exitCode + ", fileExists=" + outputFileObj.exists())
        return false
    }
}


