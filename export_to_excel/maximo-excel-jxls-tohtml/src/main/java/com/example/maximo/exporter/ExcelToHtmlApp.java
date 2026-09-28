package com.example.maximo.exporter;

import com.example.maximo.exporter.service.ExcelToHtmlService;
import org.noear.solon.Solon;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 入口：以 maximo-server-jxls 的 ExcelExporterApp 为基准编写的 HTML 导出版本。
 */
public class ExcelToHtmlApp {
    private static final Logger logger = LoggerFactory.getLogger(ExcelToHtmlApp.class);

    public static void main(String[] args) {
        System.err.println("[ExcelToHtml] Starting with args: " + java.util.Arrays.toString(args));

        // 特殊模式：仅生成 demo 模板后退出，无需启动 Solon
        String demoTemplate = parseArg(args, "create-demo-template");
        if (demoTemplate != null && !demoTemplate.isEmpty()) {
            try {
                new ExcelToHtmlService().createDemoTemplate(demoTemplate);
                System.err.println("[ExcelToHtml] Demo template created: " + demoTemplate);
                System.exit(0);
            } catch (Exception e) {
                System.err.println("[ExcelToHtml] Error: " + e.getMessage());
                e.printStackTrace(System.err);
                System.exit(1);
            }
            return;
        }

        Solon.start(ExcelToHtmlApp.class, args);

        try {
            String inputFile = parseArg(args, "input");
            if (inputFile == null || inputFile.isEmpty()) {
                System.err.println("[ExcelToHtml] Error: --input is required");
                printUsage();
                System.exit(1);
                return;
            }

            String outputFile = parseArg(args, "output");
            String templateFile = parseArg(args, "template");

            if (templateFile == null || templateFile.isEmpty()) {
                System.err.println("[ExcelToHtml] Error: --template is required");
                printUsage();
                System.exit(1);
                return;
            }

            System.err.println("[ExcelToHtml] input=" + inputFile + ", output=" + outputFile + ", template=" + templateFile);

            String logDir = Solon.cfg().get("app.logDir", "./logs");
            System.setProperty("maximo.exporter.logDir", logDir);
            String excelToHtmlCharsetName = Solon.cfg().get("app.excelToHtmlCharsetName", "");

            runJsonMode(inputFile, outputFile, templateFile, excelToHtmlCharsetName);
            logger.info("Export completed!");
            System.err.println("[ExcelToHtml] Export completed successfully!");
            System.exit(0);
        } catch (Exception e) {
            System.err.println("[ExcelToHtml] Error: " + e.getMessage());
            e.printStackTrace(System.err);
            logger.error("Error occurred: {}", e.getMessage(), e);
            System.exit(1);
        } finally {
            Solon.stop();
        }
        // 兜底: 防止因异常未退出导致进程挂起
        System.exit(1);
    }

    private static void runJsonMode(String inputFile, String outputFile, String templateFile, String excelToHtmlCharsetName) throws Exception {
        if (outputFile == null) {
            String baseName = inputFile;
            int dotIdx = baseName.lastIndexOf('.');
            if (dotIdx > 0) {
                baseName = baseName.substring(0, dotIdx);
            }
            outputFile = baseName + ".html";
        }

        logger.info("Export: input={}, output={}, template={}", inputFile, outputFile, templateFile);

        ExcelToHtmlService exportService = new ExcelToHtmlService(excelToHtmlCharsetName);
        exportService.exportFromJsonWithTemplate(inputFile, templateFile, outputFile);
        logger.info("HTML export completed: {}", outputFile);
    }

    /**
     * 从 args 中查找 --key=value 或 --key value
     */
    private static String parseArg(String[] args, String key) {
        String prefix = "--" + key + "=";
        for (int i = 0; i < args.length; i++) {
            if (args[i].startsWith(prefix)) {
                return args[i].substring(prefix.length());
            }
            if (args[i].equals("--" + key) && i + 1 < args.length) {
                return args[i + 1];
            }
        }
        return null;
    }

    private static void printUsage() {
        String usage = "\n" +
                "Usage: java -jar maximo-excel-jxls-tohtml.jar --input=<json-file> --template=<template.xls> [options]\n" +
                "\n" +
                "Required:\n" +
                "  --input=<file>         JSON 数据文件路径 (标准 JSON 对象)\n" +
                "  --template=<file>      JXLS 模板文件路径 (.xls, HTML 转换仅支持 HSSF 格式)\n" +
                "\n" +
                "Options:\n" +
                "  --output=<file>        输出 HTML 文件路径 (默认: 输入文件名.html)\n" +
                "  --create-demo-template=<file>  生成 demo 用的 JXLS 模板文件 (.xls) 后退出\n" +
                "\n" +
                "Config (来自 application.yml 或系统属性):\n" +
                "  app.logDir                  日志输出目录 (默认: ./logs)\n" +
                "  app.excelToHtmlCharsetName  HTML 输出字符集 (默认 UTF-8; Windows 下可设 \"GBK\")\n" +
                "\n" +
                "Examples:\n" +
                "  java -jar maximo-excel-jxls-tohtml.jar --input=data.json --template=t.xls\n" +
                "  java -jar maximo-excel-jxls-tohtml.jar --input=data.json --template=t.xls --output=r.html\n";
        System.err.println(usage);
    }
}