package com.example.maximo.exporter.service;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * 轻量级 HSSF(.xls) 工作簿转 HTML 转换器。
 *
 * <p>背景：参考实现 {@code ExcelExtendUtils} 依赖 POI 4.1.2 及更早版本中的
 * {@code org.apache.poi.hssf.converter.ExcelToHtmlConverter}，该包在 POI 5.0 起已被移除。
 * 本工程以 maximo-server-jxls 的版本基准（POI 5.2.5）编写，为保持依赖版本与基准一致，
 * 按参考实现的转换语义自行实现了等价转换：
 * <ul>
 *   <li>不输出 Excel 列头（A/B/C...）与行号列（对应参考实现 setOutputColumnHeaders(false) / setOutputRowNumbers(false)）；</li>
 *   <li>不输出标签页标题（对应参考实现移除 &lt;h2&gt; 标签页名&lt;/h2&gt;）；</li>
 *   <li>保留单元格值（按单元格格式经 DataFormatter 格式化）、合并单元格、列宽、行高及常用样式。</li>
 * </ul>
 */
public final class HssfToHtmlConverter {

    private HssfToHtmlConverter() {
    }

    /**
     * 转换工作簿的第一个 sheet 为完整 HTML 文档字符串。
     *
     * @param workbook    HSSF 工作簿（由调用方负责关闭）
     * @param charsetName 输出字符集，用于 HTML 的 meta charset 声明
     */
    public static String convert(HSSFWorkbook workbook, String charsetName) {
        Sheet sheet = workbook.getSheetAt(0);
        int firstRow = sheet.getFirstRowNum();
        int lastRow = sheet.getLastRowNum();
        int maxCols = maxColumns(sheet);

        List<CellRangeAddress> merges = new ArrayList<>();
        for (int i = 0; i < sheet.getNumMergedRegions(); i++) {
            merges.add(sheet.getMergedRegion(i));
        }
        // 合并区域中被覆盖（非左上角）的单元格，输出时跳过
        Set<String> covered = new HashSet<>();
        // 合并区域左上角 -> 区域
        Map<String, CellRangeAddress> rangeAt = new HashMap<>();
        for (CellRangeAddress range : merges) {
            for (int r = range.getFirstRow(); r <= range.getLastRow(); r++) {
                for (int c = range.getFirstColumn(); c <= range.getLastColumn(); c++) {
                    String key = r + ":" + c;
                    if (r == range.getFirstRow() && c == range.getFirstColumn()) {
                        rangeAt.put(key, range);
                    } else {
                        covered.add(key);
                    }
                }
            }
            maxCols = Math.max(maxCols, range.getLastColumn() + 1);
            lastRow = Math.max(lastRow, range.getLastRow());
        }

        double defaultRowHeight = sheet.getDefaultRowHeightInPoints();
        if (defaultRowHeight <= 0) {
            defaultRowHeight = 14;
        }

        Map<CellStyle, String> styleClassCache = new HashMap<>();
        StringBuilder styleDef = new StringBuilder();
        StringBuilder body = new StringBuilder();

        body.append("<table class=\"xls\">\n<colgroup>\n");
        for (int c = 0; c < maxCols; c++) {
            double width = safeColumnWidth(sheet, c);
            body.append("<col style=\"width:").append(Math.round(width)).append("px\"/>\n");
        }
        body.append("</colgroup>\n");

        DataFormatter formatter = new DataFormatter();
        for (int r = firstRow; r <= lastRow; r++) {
            Row row = sheet.getRow(r);
            double height = row == null ? defaultRowHeight : row.getHeightInPoints();
            if (height <= 0) {
                height = defaultRowHeight;
            }
            body.append("<tr style=\"height:").append(Math.round(height * 4.0 / 3.0)).append("px\">\n");
            for (int c = 0; c < maxCols; c++) {
                String key = r + ":" + c;
                if (covered.contains(key)) {
                    continue;
                }
                CellRangeAddress range = rangeAt.get(key);
                Cell cell = row == null ? null : row.getCell(c);

                body.append("<td");
                if (range != null) {
                    int rows = range.getLastRow() - range.getFirstRow() + 1;
                    int cols = range.getLastColumn() - range.getFirstColumn() + 1;
                    if (rows > 1) {
                        body.append(" rowspan=\"").append(rows).append("\"");
                    }
                    if (cols > 1) {
                        body.append(" colspan=\"").append(cols).append("\"");
                    }
                }
                if (cell != null) {
                    String styleClass = styleClassCache.get(cell.getCellStyle());
                    if (styleClass == null) {
                        styleClass = "x" + styleClassCache.size();
                        styleClassCache.put(cell.getCellStyle(), styleClass);
                        styleDef.append(".xls td.").append(styleClass).append('{')
                                .append(cssFor(workbook, cell.getCellStyle())).append("}\n");
                    }
                    body.append(" class=\"").append(styleClass).append("\"");
                }
                String value = cell == null ? "" : formatCell(formatter, cell);
                body.append(">").append(escapeHtml(value)).append("</td>\n");
            }
            body.append("</tr>\n");
        }
        body.append("</table>");

        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html>\n<html>\n<head>\n");
        html.append("<meta charset=\"").append(charsetName == null || charsetName.isEmpty() ? "UTF-8" : charsetName).append("\"/>\n");
        html.append("<title>Excel</title>\n<style>\n");
        html.append("table.xls{border-collapse:collapse;}\n");
        html.append(styleDef);
        html.append("</style>\n</head>\n<body>\n");
        html.append(body);
        html.append("\n</body>\n</html>\n");
        return html.toString();
    }

    private static int maxColumns(Sheet sheet) {
        int max = 0;
        int first = sheet.getFirstRowNum();
        int last = sheet.getLastRowNum();
        for (int r = first; r <= last; r++) {
            Row row = sheet.getRow(r);
            if (row != null) {
                max = Math.max(max, row.getLastCellNum());
            }
        }
        return max < 0 ? 0 : max;
    }

    private static double safeColumnWidth(Sheet sheet, int col) {
        try {
            double width = sheet.getColumnWidthInPixels(col);
            return width > 0 ? width : 64;
        } catch (Exception e) {
            return 64;
        }
    }

    private static String formatCell(DataFormatter formatter, Cell cell) {
        try {
            String value = formatter.formatCellValue(cell);
            return value == null ? "" : value;
        } catch (Exception e) {
            return "";
        }
    }

    /** 根据单元格样式生成 CSS 声明串。 */
    private static String cssFor(HSSFWorkbook workbook, CellStyle style) {
        StringBuilder css = new StringBuilder();
        Font font = workbook.getFontAt(style.getFontIndex());

        String fontFamily = font.getFontName();
        if (!fontFamily.isEmpty()) {
            css.append("font-family:").append(fontFamily).append(';');
        }
        if (font.getBold()) {
            css.append("font-weight:bold;");
        }
        if (font.getItalic()) {
            css.append("font-style:italic;");
        }
        short fontSize = font.getFontHeightInPoints();
        if (fontSize > 0) {
            css.append("font-size:").append(Math.round(fontSize * 4.0 / 3.0)).append("px;");
        }
        // POI 5 中字体颜色为调色板索引（short），经 HSSF 调色板解析为 rgb
        String fontColor = toCssColor(workbook, font.getColor());
        if (fontColor != null) {
            css.append("color:").append(fontColor).append(';');
        }

        if (style.getFillPattern() != null && style.getFillPattern() != FillPatternType.NO_FILL) {
            String rgb = toCssColor(workbook, style.getFillForegroundColor());
            if (rgb != null) {
                css.append("background-color:").append(rgb).append(';');
            }
        }

        appendBorder(css, "border-top", style.getBorderTop());
        appendBorder(css, "border-bottom", style.getBorderBottom());
        appendBorder(css, "border-left", style.getBorderLeft());
        appendBorder(css, "border-right", style.getBorderRight());

        if (style.getAlignment() != null) {
            HorizontalAlignment aligns = style.getAlignment();
            switch (aligns) {
                case CENTER:
                case CENTER_SELECTION:
                case FILL:
                    css.append("text-align:center;");
                    break;
                case RIGHT:
                    css.append("text-align:right;");
                    break;
                case JUSTIFY:
                    css.append("text-align:justify;");
                    break;
                default:
                    css.append("text-align:left;");
            }
        }
        if (style.getVerticalAlignment() != null) {
            VerticalAlignment aligns = style.getVerticalAlignment();
            switch (aligns) {
                case CENTER:
                    css.append("vertical-align:middle;");
                    break;
                case BOTTOM:
                    css.append("vertical-align:bottom;");
                    break;
                default:
                    css.append("vertical-align:top;");
            }
        }
        if (style.getWrapText()) {
            css.append("white-space:pre-wrap;");
        }
        return css.toString();
    }

    private static void appendBorder(StringBuilder css, String prop, BorderStyle border) {
        if (border == null || border == BorderStyle.NONE) {
            return;
        }
        int width;
        switch (border) {
            case MEDIUM:
                width = 2;
                break;
            case THICK:
                width = 3;
                break;
            default:
                width = 1;
        }
        css.append(prop).append(':').append(width).append("px solid #000000;");
    }

    /** 调色板索引（IndexedColors 或自定义调色板）转 CSS rgb，解析失败返回 null。 */
    private static String toCssColor(HSSFWorkbook workbook, short index) {
        try {
            HSSFColor color = workbook.getCustomPalette().getColor(index);
            if (color != null) {
                short[] triplet = color.getTriplet();
                return "rgb(" + triplet[0] + "," + triplet[1] + "," + triplet[2] + ")";
            }
        } catch (Exception ignored) {
            // 无法解析时返回 null，不输出颜色
        }
        return null;
    }

    private static String escapeHtml(String value) {
        if (value.isEmpty()) {
            return "";
        }
        return value.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("\n", "<br/>");
    }
}