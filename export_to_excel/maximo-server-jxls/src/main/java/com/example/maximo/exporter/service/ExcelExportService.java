package com.example.maximo.exporter.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jxls.common.Context;
import org.jxls.util.JxlsHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.util.Map;

public class ExcelExportService {
    private static final Logger logger = LoggerFactory.getLogger(ExcelExportService.class);

    /**
     * 使用 JXLS 模板导出 Excel
     * <p>JSON 文件直接转为 Map，不做任何转换，原样传给 JXLS 模板处理。</p>
     */
    public void exportFromJsonWithTemplate(String inputJsonPath, String templatePath, String outputExcelPath) throws IOException {
        logger.info("Reading JSON from: {} with template: {}", inputJsonPath, templatePath);

        // JSON 直接解析为 Map，不做任何处理
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> data = mapper.readValue(readFileWithoutBom(inputJsonPath),
                new TypeReference<Map<String, Object>>() {});

        logger.info("JSON loaded: keys={}", data.keySet());

        // 原样传入 JXLS Context，模板里用 ${key} 直接访问
        Context context = new Context();
        for (Map.Entry<String, Object> entry : data.entrySet()) {
            context.putVar(entry.getKey(), entry.getValue());
        }

        File outputFile = new File(outputExcelPath);
        File parentDir = outputFile.getParentFile();
        if (parentDir != null && !parentDir.exists()) {
            parentDir.mkdirs();
        }

        try (InputStream templateIs = new FileInputStream(templatePath);
             OutputStream outputOs = new FileOutputStream(outputExcelPath)) {
            JxlsHelper.getInstance().processTemplate(templateIs, outputOs, context);
        }

        logger.info("JXLS template export completed: {}", outputExcelPath);
    }

    /**
     * 读取文件内容为字符串，自动去除 UTF-8 BOM 头
     */
    private String readFileWithoutBom(String path) throws IOException {
        File file = new File(path);
        byte[] bytes = new byte[(int) file.length()];
        try (FileInputStream fis = new FileInputStream(file)) {
            int read = fis.read(bytes);
            if (read <= 0) {
                return "";
            }
        }
        int offset = 0;
        while (offset + 2 < bytes.length
                && (bytes[offset] & 0xFF) == 0xEF
                && (bytes[offset + 1] & 0xFF) == 0xBB
                && (bytes[offset + 2] & 0xFF) == 0xBF) {
            offset += 3;
        }
        return new String(bytes, offset, bytes.length - offset, "UTF-8");
    }
}
