package com.example.excel.to.html.service;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.*;

public class Excel2HtmlService {
    private static final Logger logger = LoggerFactory.getLogger(Excel2HtmlService.class);

    public void convert(String inputPath, String outputPath, boolean noSheetName) throws Exception {
        logger.info("Reading Excel: {}", inputPath);
        byte[] bytes = Files.readAllBytes(Paths.get(inputPath));
        String html;

        try (XSSFWorkbook wb = new XSSFWorkbook(new ByteArrayInputStream(bytes))) {
            html = buildHtml(wb, noSheetName);
        }

        File outFile = new File(outputPath);
        File parent = outFile.getParentFile();
        if (parent != null && !parent.exists()) parent.mkdirs();
        Files.write(outFile.toPath(), html.getBytes(StandardCharsets.UTF_8));
        logger.info("HTML written: {} ({} bytes)", outputPath, outFile.length());
    }

    private String buildHtml(XSSFWorkbook wb, boolean noSheetName) {
        StringBuilder sb = new StringBuilder();
        sb.append("<!DOCTYPE html>\n<html lang=\"zh-CN\">\n<head>\n");
        sb.append("<meta charset=\"UTF-8\">\n");
        sb.append("<meta name=\"viewport\" content=\"width=device-width,initial-scale=1.0\">\n");
        sb.append("<title>Excel Export</title>\n");
        sb.append("<style>\n");
        sb.append("body{font-family:'Microsoft YaHei',Arial,sans-serif;margin:20px;}\n");
        sb.append("table{border-collapse:collapse;margin-bottom:30px;}\n");
        sb.append("td,th{border:1px solid #999;padding:4px 8px;font-size:13px;white-space:nowrap;}\n");
        sb.append("</style>\n</head>\n<body>\n");

        for (int s = 0; s < wb.getNumberOfSheets(); s++) {
            Sheet sheet = wb.getSheetAt(s);
            if (sheet.getPhysicalNumberOfRows() <= 0) continue;

            // 收集合并区域
            Set<String> mergedSkip = new HashSet<>();
            for (int m = 0; m < sheet.getNumMergedRegions(); m++) {
                CellRangeAddress range = sheet.getMergedRegion(m);
                for (int r = range.getFirstRow(); r <= range.getLastRow(); r++)
                    for (int c = range.getFirstColumn(); c <= range.getLastColumn(); c++)
                        if (r != range.getFirstRow() || c != range.getFirstColumn())
                            mergedSkip.add(r + "," + c);
            }

            // 参考 wb790: 通过 --no-sheet-name 控制是否显示 sheet 名称
            if (!noSheetName) {
                sb.append("<div style=\"font-size:16px;font-weight:bold;margin:10px 0;\">")
                  .append(esc(sheet.getSheetName())).append("</div>\n");
            }
            sb.append("<table>\n");

            int firstRow = sheet.getFirstRowNum();
            int lastRow = sheet.getLastRowNum();
            int maxCol = 0;
            for (int r = firstRow; r <= lastRow; r++) {
                Row row = sheet.getRow(r);
                if (row != null && row.getLastCellNum() > maxCol)
                    maxCol = row.getLastCellNum();
            }
            if (maxCol <= 0) continue;

            for (int r = firstRow; r <= lastRow; r++) {
                Row row = sheet.getRow(r);
                if (row == null) continue;

                boolean hasData = false;
                for (int c = 0; c < maxCol; c++) {
                    Cell cell = row.getCell(c);
                    if (cell != null && cell.getCellType() != CellType.BLANK
                            && !isJxlsComment(cell)) {
                        hasData = true;
                        break;
                    }
                }
                if (!hasData) continue;

                sb.append("<tr>");
                for (int c = 0; c < maxCol; c++) {
                    if (mergedSkip.contains(r + "," + c)) continue;

                    Cell cell = row.getCell(c);
                    CellRangeAddress merged = getMergedRegion(sheet, r, c);
                    String val = getCellValue(cell);
                    String style = buildStyle(cell, wb, r, c);

                    boolean isHeader = r == firstRow;
                    sb.append(isHeader ? "<th" : "<td");
                    if (style != null) sb.append(" style=\"").append(style).append("\"");
                    if (merged != null) {
                        sb.append(" rowspan=\"").append(merged.getLastRow() - merged.getFirstRow() + 1).append("\"");
                        sb.append(" colspan=\"").append(merged.getLastColumn() - merged.getFirstColumn() + 1).append("\"");
                    }
                    sb.append(">").append(esc(val));
                    sb.append(isHeader ? "</th>" : "</td>");
                }
                sb.append("</tr>\n");
            }
            sb.append("</table>\n");
        }

        sb.append("</body>\n</html>");
        return sb.toString();
    }

    private boolean isJxlsComment(Cell cell) {
        try {
            Comment comment = cell.getCellComment();
            return comment != null && comment.getString().getString().contains("jx:");
        } catch (Exception e) {
            return false;
        }
    }

    private CellRangeAddress getMergedRegion(Sheet sheet, int row, int col) {
        for (int m = 0; m < sheet.getNumMergedRegions(); m++) {
            CellRangeAddress range = sheet.getMergedRegion(m);
            if (range.getFirstRow() == row && range.getFirstColumn() == col)
                return range;
        }
        return null;
    }

    private String buildStyle(Cell cell, XSSFWorkbook wb, int row, int col) {
        if (cell == null) return null;
        CellStyle style = cell.getCellStyle();
        if (style == null) return null;

        StringBuilder sb = new StringBuilder();

        // 字体
        Font font = wb.getFontAt(style.getFontIndex());
        if (font != null) {
            if (font.getBold()) sb.append("font-weight:bold;");
            if (font.getItalic()) sb.append("font-style:italic;");
            if (font.getUnderline() != Font.U_NONE) sb.append("text-decoration:underline;");
            // 字体颜色
            if (font instanceof XSSFFont) {
                XSSFColor fontColor = ((XSSFFont) font).getXSSFColor();
                if (fontColor != null) {
                    byte[] rgb = fontColor.getRGB();
                    if (rgb != null && rgb.length >= 3) {
                        sb.append("color:#").append(hex(rgb[0])).append(hex(rgb[1])).append(hex(rgb[2])).append(";");
                    }
                }
            }
        }

        // 对齐
        HorizontalAlignment ha = style.getAlignment();
        if (ha == HorizontalAlignment.CENTER || ha == HorizontalAlignment.CENTER_SELECTION)
            sb.append("text-align:center;");
        else if (ha == HorizontalAlignment.RIGHT)
            sb.append("text-align:right;");
        else if (ha == HorizontalAlignment.LEFT)
            sb.append("text-align:left;");

        VerticalAlignment va = style.getVerticalAlignment();
        if (va == VerticalAlignment.TOP) sb.append("vertical-align:top;");
        else if (va == VerticalAlignment.BOTTOM) sb.append("vertical-align:bottom;");
        else if (va == VerticalAlignment.CENTER) sb.append("vertical-align:middle;");

        // 背景色
        try {
            Color color = style.getFillForegroundColorColor();
            if (color instanceof XSSFColor) {
                byte[] rgb = ((XSSFColor) color).getRGB();
                if (rgb != null && rgb.length >= 3) {
                    sb.append("background-color:#").append(hex(rgb[0])).append(hex(rgb[1])).append(hex(rgb[2])).append(";");
                }
            }
        } catch (Exception ignored) {}

        return sb.length() > 0 ? sb.toString() : null;
    }

    private String hex(byte b) {
        return String.format("%02x", b & 0xFF);
    }

    private String getCellValue(Cell cell) {
        if (cell == null) return "";
        try {
            switch (cell.getCellType()) {
                case STRING: return cell.getStringCellValue();
                case NUMERIC:
                    if (DateUtil.isCellDateFormatted(cell)) {
                        Date d = cell.getDateCellValue();
                        if (d != null) return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(d);
                        return "";
                    }
                    double v = cell.getNumericCellValue();
                    if (v == Math.floor(v) && !Double.isInfinite(v))
                        return new DecimalFormat("#").format(v);
                    return String.valueOf(v);
                case BOOLEAN: return String.valueOf(cell.getBooleanCellValue());
                case FORMULA:
                    try { return String.valueOf(cell.getNumericCellValue()); }
                    catch (Exception e) {
                        try { return cell.getStringCellValue(); }
                        catch (Exception e2) { return cell.getCellFormula(); }
                    }
                default: return "";
            }
        } catch (Exception e) {
            return "";
        }
    }

    private String esc(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                .replace("\"", "&quot;").replace("'", "&#39;");
    }
}
