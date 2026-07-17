package com.example.maximo.exporter;

import com.example.maximo.exporter.service.ExcelExportService;
import org.noear.solon.Solon;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ExcelExporterApp {
    private static final Logger logger = LoggerFactory.getLogger(ExcelExporterApp.class);

    public static void main(String[] args) {
        System.err.println("[ExcelExporter] Starting with args: " + java.util.Arrays.toString(args));
        Solon.start(ExcelExporterApp.class, args);

        try {
            String inputFile = parseArg(args, "input");
            if (inputFile == null || inputFile.isEmpty()) {
                System.err.println("[ExcelExporter] Error: --input is required");
                printUsage();
                System.exit(1);
                return;
            }

            String outputFile = parseArg(args, "output");
            String templateFile = parseArg(args, "template");

            if (templateFile == null || templateFile.isEmpty()) {
                System.err.println("[ExcelExporter] Error: --template is required");
                printUsage();
                System.exit(1);
                return;
            }

            System.err.println("[ExcelExporter] input=" + inputFile + ", output=" + outputFile + ", template=" + templateFile);

            String logDir = Solon.cfg().get("app.logDir", "./logs");
            System.setProperty("maximo.exporter.logDir", logDir);

            runJsonMode(inputFile, outputFile, templateFile);
            logger.info("Export completed!");
            System.err.println("[ExcelExporter] Export completed successfully!");
            System.exit(0);
        } catch (Exception e) {
            System.err.println("[ExcelExporter] Error: " + e.getMessage());
            e.printStackTrace(System.err);
            logger.error("Error occurred: {}", e.getMessage(), e);
            System.exit(1);
        } finally {
            Solon.stop();
        }
        // 兜底: 防止因异常未退出导致进程挂起
        System.exit(1);
    }

    private static void runJsonMode(String inputFile, String outputFile, String templateFile) throws Exception {
        if (outputFile == null) {
            String baseName = inputFile;
            int dotIdx = baseName.lastIndexOf('.');
            if (dotIdx > 0) {
                baseName = baseName.substring(0, dotIdx);
            }
            outputFile = baseName + ".xlsx";
        }

        logger.info("Export: input={}, output={}, template={}", inputFile, outputFile, templateFile);

        ExcelExportService exportService = new ExcelExportService();
        exportService.exportFromJsonWithTemplate(inputFile, templateFile, outputFile);
        logger.info("Excel export completed: {}", outputFile);
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
                "Usage: java -jar maximo-server-jxls.jar --input=<json-file> --template=<template.xlsx> [options]\n" +
                "\n" +
                "Required:\n" +
                "  --input=<file>         JSON 数据文件路径 (标准 JSON 对象)\n" +
                "  --template=<file>      JXLS 模板文件路径 (.xlsx)\n" +
                "\n" +
                "Options:\n" +
                "  --output=<file>        输出 Excel 文件路径 (默认: 输入文件名.xlsx)\n" +
                "\n" +
                "Config (来自 application.yml 或系统属性):\n" +
                "  app.logDir              日志输出目录 (默认: ./logs)\n" +
                "\n" +
                "Examples:\n" +
                "  java -jar maximo-server-jxls.jar --input=data.json --template=t.xlsx\n" +
                "  java -jar maximo-server-jxls.jar --input=data.json --template=t.xlsx --output=r.xlsx\n";
        System.err.println(usage);
    }
}
