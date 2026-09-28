package com.example.maximo.exporter.service;

import com.example.maximo.exporter.jxls.JxlsAutumnUtils;
import com.example.maximo.exporter.jxls.JxlsDateUtils;
import com.example.maximo.exporter.jxls.JxlsNumberUtils;
import com.example.maximo.exporter.jxls.JxlsStringUtils;
import com.example.maximo.exporter.jxls.JxlsUtils;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.poi.hssf.usermodel.HSSFClientAnchor;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.ss.usermodel.Comment;
import org.apache.poi.ss.usermodel.Drawing;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.jxls.common.Context;
import org.jxls.util.JxlsHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;

/**
 * Excel 模板转 HTML 服务。
 *
 * <p>以 maximo-server-jxls 的工程骨架为基准编写，核心逻辑移植自参考实现
 * autumn-wb790-core 的 {@code ExcelExtendUtils}：
 * <ul>
 *   <li>{@link #processExcelTemplate}：对应 {@code ExcelExtendUtils.processExcelTemplate}，
 *       渲染 JXLS 模板并向 Context 注册 dateUtils/numUtils/autUtils/strUtils/utils 工具 bean；</li>
 *   <li>{@link #excelToHtml}：对应 {@code ExcelExtendUtils.excelToHtml}，
 *       渲染后转为 HTML 字符串（转换细节见 {@link HssfToHtmlConverter}）；</li>
 *   <li>{@link #readExcel}：对应 {@code ExcelExtendUtils.readExcel}。</li>
 * </ul>
 *
 * <p>与原实现的差异：参考实现通过 net.sf.jxls 的 XLSTransformer 对渲染结果二次解析取得
 * HSSFWorkbook（模板已由 JxlsHelper 完成全部表达式求值，此处等价地直接解析渲染字节流，
 * 避免引入 jxls 1.x 依赖）；HTML 转换仅支持 HSSF(.xls)，与参考实现一致。
 * 由于 POI 5.0 起移除了 {ExcelToHtmlConverter}，本工程在保持基准依赖版本（POI 5.2.5）不变的前提下，
 * 以 {@link HssfToHtmlConverter} 实现等价转换。
 */
public class ExcelToHtmlService {

    private static final Logger logger = LoggerFactory.getLogger(ExcelToHtmlService.class);

    /**
     * HTML 输出字符集；为空时使用 UTF-8。
     * 对应参考实现中的 AutumnConfig.excelToHtmlCharsetName（Windows 下可配 "GBK"）。
     */
    private final String excelToHtmlCharsetName;

    public ExcelToHtmlService() {
        this("");
    }

    public ExcelToHtmlService(String excelToHtmlCharsetName) {
        this.excelToHtmlCharsetName = excelToHtmlCharsetName == null ? "" : excelToHtmlCharsetName;
    }

    // ==================== 模板渲染（移植自 ExcelExtendUtils.processExcelTemplate） ====================

    /**
     * 渲染 JXLS 模板到输出流。
     *
     * @param tempPath     模板路径，支持相对/绝对路径，兼容 "classpath:" 前缀
     * @param data         模板上下文数据
     * @param outputStream 渲染结果输出流
     */
    public void processExcelTemplate(String tempPath, Map<String, ?> data, OutputStream outputStream) throws Exception {
        try (InputStream tempInputStream = openTemplateStream(tempPath)) {
            Context context = new Context();
            for (Map.Entry<String, ?> entry : data.entrySet()) {
                context.putVar(entry.getKey(), entry.getValue());
            }
            // 注册模板内可用的工具 bean（与参考实现一致）
            // 模板中可直接使用，如 ${dateUtils.format('yyyy-MM-dd', dateUtils.getNowDate())}
            context.putVar("dateUtils", JxlsDateUtils.getInstance());
            context.putVar("numUtils", JxlsNumberUtils.getInstance());
            context.putVar("autUtils", JxlsAutumnUtils.getInstance());
            context.putVar("strUtils", new JxlsStringUtils());
            context.putVar("utils", new JxlsUtils());

            JxlsHelper.getInstance().processTemplate(tempInputStream, outputStream, context);
        }
    }

    private InputStream openTemplateStream(String tempPath) throws IOException {
        if (tempPath.startsWith("classpath:")) {
            String resourcePath = tempPath.substring("classpath:".length());
            InputStream is = ExcelToHtmlService.class.getClassLoader().getResourceAsStream(resourcePath);
            if (is == null) {
                throw new FileNotFoundException("classpath resource not found: " + resourcePath);
            }
            return is;
        }
        return new FileInputStream(new File(tempPath));
    }

    // ==================== HTML 转换（移植自 ExcelExtendUtils.excelToHtml） ====================

    /**
     * 渲染 JXLS 模板并转换为 HTML 字符串。
     *
     * @return HTML 内容（已去掉 Excel 列头、行号、标签页标题）
     */
    public String excelToHtml(String tempPath, Map<String, ?> data) throws Exception {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        processExcelTemplate(tempPath, data, byteArrayOutputStream);

        HSSFWorkbook workbook = toHssfWorkbook(byteArrayOutputStream.toByteArray(), tempPath);
        return workbookToHtml(workbook);
    }

    /**
     * 渲染结果解析为 HSSFWorkbook。
     *
     * <p>参考实现通过 XLSTransformer.transformXLS 二次解析取得 HSSFWorkbook；
     * 由于模板已由 JxlsHelper 完成全部表达式求值，这里直接解析渲染后的字节流等价。
     * HTML 转换（HssfToHtmlConverter）仅支持 HSSF，因此渲染结果为 .xlsx 时给出明确提示。
     */
    private HSSFWorkbook toHssfWorkbook(byte[] mergedBytes, String tempPath) throws IOException {
        if (mergedBytes.length >= 4 && (mergedBytes[0] & 0xFF) == 0x50 && (mergedBytes[1] & 0xFF) == 0x4B) {
            // ZIP 魔数(PK..) => OOXML(.xlsx)
            throw new IOException("模板 \"" + tempPath + "\" 渲染结果为 OOXML(.xlsx)，"
                    + "但 HTML 转换（HssfToHtmlConverter）仅支持 HSSF(.xls)。"
                    + "请使用 .xls 模板（或将 .xlsx 另存为 .xls）后再转换为 HTML。");
        }
        return new HSSFWorkbook(new ByteArrayInputStream(mergedBytes));
    }

    /**
     * HSSFWorkbook 转 HTML（对应 ExcelExtendUtils.excelToHtml 的后半段语义：
     * 去掉列头/行号、去掉标签页标题、按配置字符集输出）。
     */
    public String workbookToHtml(HSSFWorkbook workbook) throws Exception {
        try {
            return HssfToHtmlConverter.convert(workbook, excelToHtmlCharsetName);
        } finally {
            workbook.close();
        }
    }

    // ==================== CLI 入口（对应基准 ExcelExportService.exportFromJsonWithTemplate） ====================

    /**
     * 读取 JSON 数据文件，渲染 JXLS 模板并写出 HTML 文件。
     */
    public void exportFromJsonWithTemplate(String inputJsonPath, String templatePath, String outputHtmlPath) throws Exception {
        logger.info("Reading JSON from: {} with template: {}", inputJsonPath, templatePath);

        Map<String, Object> data = readJsonMap(inputJsonPath);
        logger.info("JSON loaded: keys={}", data.keySet());

        String html = excelToHtml(templatePath, data);
        writeHtml(html, outputHtmlPath);
        logger.info("HTML export completed: {}", outputHtmlPath);
    }

    public Map<String, Object> readJsonMap(String inputJsonPath) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(readFileWithoutBom(inputJsonPath), new TypeReference<Map<String, Object>>() {
        });
    }

    /**
     * 读取 Excel 文件（移植自 ExcelExtendUtils.readExcel）。
     */
    public static Workbook readExcel(String postfix, InputStream is) throws IOException {
        if (".xls".equals(postfix)) {
            return new HSSFWorkbook(is);
        } else if (".xlsx".equals(postfix)) {
            return new XSSFWorkbook(is);
        }
        return null;
    }

    private void writeHtml(String html, String outputHtmlPath) throws IOException {
        File outputFile = new File(outputHtmlPath);
        File parentDir = outputFile.getParentFile();
        if (parentDir != null && !parentDir.exists()) {
            parentDir.mkdirs();
        }
        String charsetName = resolveCharsetName();
        try (OutputStream os = new FileOutputStream(outputHtmlPath);
             OutputStreamWriter writer = new OutputStreamWriter(os, charsetName.isEmpty() ? "UTF-8" : charsetName)) {
            writer.write(html);
        }
    }

    /**
     * 读取文件内容为字符串，自动去除 UTF-8 BOM 头（对应基准 ExcelExportService.readFileWithoutBom）。
     */
    private String readFileWithoutBom(String path) throws IOException {
        byte[] bytes = Files.readAllBytes(Paths.get(path));
        int offset = 0;
        while (offset + 2 < bytes.length
                && (bytes[offset] & 0xFF) == 0xEF
                && (bytes[offset + 1] & 0xFF) == 0xBB
                && (bytes[offset + 2] & 0xFF) == 0xBF) {
            offset += 3;
        }
        return new String(bytes, offset, bytes.length - offset, StandardCharsets.UTF_8);
    }

    private void addComment(Sheet sheet, Cell cell, String commentText) {
        Drawing<?> drawing = sheet.createDrawingPatriarch();
        Comment comment = drawing.createCellComment(new HSSFClientAnchor());
        comment.setString(new HSSFRichTextString(commentText));
        cell.setCellComment(comment);
    }

    private String resolveCharsetName() {
        return excelToHtmlCharsetName == null ? "" : excelToHtmlCharsetName.trim();
    }

    // ==================== Demo 模板生成 ====================

    /**
     * 生成 demo 用的 JXLS 模板（.xls / HSSF）。
     *
     * <p>模板结构（遵循 jxls 2.x 约定：jx 命令写在单元格批注中，表达式写在单元格文本里）：
     * <pre>
     * 批注 A1: jx:area(lastCell="G5")  —— 定义整个模板区域 A1:G5，使区域内的
     *                                      普通表达式（标题/时间/合计行）被求值
     * 第 1 行：标题 ${title}                              （合并 A1:G1）
     * 第 2 行：导出时间 ${dateUtils.format(...)}           （合并 A2:G2）
     * 第 3 行：表头 ID/脚本名称/别名/版本/主机名/创建人/创建时间
     * 批注 A4: jx:each(items="data" var="row" lastCell="G4")   —— 数据区网格命令
     * 第 4 行：数据区，首列 ${utils.lineNum(data, row)}
     * 第 5 行：合计 ${data.size()} 条记录                   （合并 A5:G5）
     * </pre>
     */
    public void createDemoTemplate(String path) throws IOException {
        if (!path.toLowerCase().endsWith(".xls")) {
            throw new IllegalArgumentException("仅支持生成 .xls (HSSF) 模板，实际路径: " + path);
        }
        try (HSSFWorkbook wb = new HSSFWorkbook()) {
            Sheet sheet = wb.createSheet("模板");
            int[] widths = {8, 24, 14, 10, 14, 12, 22};
            for (int i = 0; i < widths.length; i++) {
                sheet.setColumnWidth(i, widths[i] * 256);
            }

            CellStyle titleStyle = wb.createCellStyle();
            titleStyle.setAlignment(HorizontalAlignment.CENTER);
            titleStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            Font titleFont = wb.createFont();
            titleFont.setBold(true);
            titleFont.setFontHeightInPoints((short) 14);
            titleStyle.setFont(titleFont);

            CellStyle timeStyle = wb.createCellStyle();
            timeStyle.setAlignment(HorizontalAlignment.LEFT);
            timeStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            CellStyle headerStyle = wb.createCellStyle();
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setBorderTop(org.apache.poi.ss.usermodel.BorderStyle.THIN);
            headerStyle.setBorderBottom(org.apache.poi.ss.usermodel.BorderStyle.THIN);
            headerStyle.setBorderLeft(org.apache.poi.ss.usermodel.BorderStyle.THIN);
            headerStyle.setBorderRight(org.apache.poi.ss.usermodel.BorderStyle.THIN);
            Font headerFont = wb.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            CellStyle dataStyle = wb.createCellStyle();
            dataStyle.setAlignment(HorizontalAlignment.CENTER);
            dataStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            dataStyle.setBorderTop(org.apache.poi.ss.usermodel.BorderStyle.THIN);
            dataStyle.setBorderBottom(org.apache.poi.ss.usermodel.BorderStyle.THIN);
            dataStyle.setBorderLeft(org.apache.poi.ss.usermodel.BorderStyle.THIN);
            dataStyle.setBorderRight(org.apache.poi.ss.usermodel.BorderStyle.THIN);

            // 第 1 行：标题（批注 jx:area 定义模板整体区域 A1:G5，
            // 区域内的普通表达式（标题/时间/表头/合计）由 jxls 静态转换求值）
            Row titleRow = sheet.createRow(0);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("${title}");
            titleCell.setCellStyle(titleStyle);
            addComment(sheet, titleCell, "jx:area(lastCell=\"G5\")");
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 6));

            // 第 2 行：导出时间
            Row timeRow = sheet.createRow(1);
            Cell timeCell = timeRow.createCell(0);
            timeCell.setCellValue("导出时间：${dateUtils.format('yyyy-MM-dd HH:mm:ss', dateUtils.getNowDate())}");
            timeCell.setCellStyle(timeStyle);
            sheet.addMergedRegion(new CellRangeAddress(1, 1, 0, 6));

            // 第 3 行：表头
            String[] headers = {"ID", "脚本名称", "别名", "版本", "主机名", "创建人", "创建时间"};
            Row headerRow = sheet.createRow(2);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // 第 4 行：数据区（jx:each 命令写在 A4 批注中，扩张区域 A4:G4）
            Row dataRow = sheet.createRow(3);
            dataRow.setHeightInPoints(20);
            String[] exps = {"${utils.lineNum(data, row)}", "${row[0]}", "${row[1]}", "${row[2]}", "${row[3]}", "${row[4]}", "${row[5]}"};
            Cell cmdCell = dataRow.createCell(0);
            cmdCell.setCellValue(exps[0]);
            cmdCell.setCellStyle(dataStyle);
            addComment(sheet, cmdCell, "jx:each(items=\"data\" var=\"row\" lastCell=\"G4\")");
            for (int i = 1; i < exps.length; i++) {
                Cell cell = dataRow.createCell(i);
                cell.setCellValue(exps[i]);
                cell.setCellStyle(dataStyle);
            }

            // 第 5 行：合计
            Row sumRow = sheet.createRow(4);
            Cell sumCell = sumRow.createCell(0);
            sumCell.setCellValue("合计：${data.size()} 条记录");
            sumCell.setCellStyle(timeStyle);
            sheet.addMergedRegion(new CellRangeAddress(4, 4, 0, 6));

            File parent = new File(path).getParentFile();
            if (parent != null && !parent.exists()) {
                parent.mkdirs();
            }
            try (FileOutputStream fos = new FileOutputStream(path)) {
                wb.write(fos);
            }
        }
        logger.info("Demo template created: {}", path);
    }
}