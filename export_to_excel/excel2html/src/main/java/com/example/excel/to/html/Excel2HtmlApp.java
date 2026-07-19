package com.example.excel.to.html;

import com.example.excel.to.html.service.Excel2HtmlService;
import org.noear.solon.Solon;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;

public class Excel2HtmlApp {
    private static final Logger logger = LoggerFactory.getLogger(Excel2HtmlApp.class);

    public static void main(String[] args) {
        System.err.println("[Excel2Html] Starting...");
        Solon.start(Excel2HtmlApp.class, args);

        try {
            String input = parseArg(args, "input");
            if (input == null || input.isEmpty()) {
                System.err.println("[Excel2Html] Error: --input is required");
                printUsage();
                System.exit(1);
                return;
            }

            String output = parseArg(args, "output");
            if (output == null || output.isEmpty()) {
                output = input;
                int dot = output.lastIndexOf('.');
                if (dot > 0) output = output.substring(0, dot);
                output += ".html";
            }

            boolean noSheetName = hasArg(args, "no-sheet-name");

            System.err.println("[Excel2Html] input=" + input + ", output=" + output + ", noSheetName=" + noSheetName);

            Excel2HtmlService service = new Excel2HtmlService();
            service.convert(input, output, noSheetName);

            logger.info("HTML export completed: {}", output);
            System.err.println("[Excel2Html] Completed: " + new File(output).getAbsolutePath());
            System.exit(0);
        } catch (Exception e) {
            System.err.println("[Excel2Html] Error: " + e.getMessage());
            e.printStackTrace(System.err);
            logger.error("Error: {}", e.getMessage(), e);
            System.exit(1);
        } finally {
            Solon.stop();
        }
        System.exit(1);
    }

    private static boolean hasArg(String[] args, String key) {
        String prefix = "--" + key;
        for (String arg : args) {
            if (arg.equals(prefix)) return true;
        }
        return false;
    }

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
        System.err.println("Usage: java -jar excel2html.jar --input=<file.xlsx> [--output=<file.html>] [--no-sheet-name]");
        System.err.println("  --input          源 Excel 文件路径 (.xlsx)");
        System.err.println("  --output         输出 HTML 文件路径 (默认: 输入文件名.html)");
        System.err.println("  --no-sheet-name  不显示 sheet 名称 (参考 wb790 实现)");
    }
}
