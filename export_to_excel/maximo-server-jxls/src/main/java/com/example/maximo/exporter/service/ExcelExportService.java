package com.example.maximo.exporter.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.ss.util.CellReference;
import org.jxls.common.Context;
import org.jxls.util.JxlsHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeSet;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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

        formatOutputWorkbook(outputExcelPath, data);

        logger.info("JXLS template export completed: {}", outputExcelPath);
    }

    /**
     * 按 excelTmpl 配置处理合并：
     * MERGECOLUMNS：指定列中上下相邻且值相同的单元格纵向合并，如 ["A","B"]；
     * MERGETITLEROW：首行标题横向合并到最后一个有数据的供应商列。
     * 另外，若数据中存在 VENDORS 列表，则在每个询价行的供应商价格中，
     * 最低价标红，第二、第三低价加粗斜体。
     */
    @SuppressWarnings("unchecked")
    private void formatOutputWorkbook(String outputExcelPath, Map<String, Object> data) throws IOException {
        Object tmpl = data.get("excelTmpl");
        if (!(tmpl instanceof Map)) {
            return;
        }
        Map<String, Object> tmplMap = (Map<String, Object>) tmpl;
        Object colsObj = tmplMap.get("MERGECOLUMNS");
        List<Object> cols = (colsObj instanceof List) ? (List<Object>) colsObj : null;
        // 默认合并首行标题，只有显式配置 false 时才关闭
        Object titleFlag = tmplMap.get("MERGETITLEROW");
        boolean mergeTitle = true;
        if (titleFlag instanceof Boolean) {
            mergeTitle = (Boolean) titleFlag;
        } else if (titleFlag != null) {
            mergeTitle = !"false".equalsIgnoreCase(String.valueOf(titleFlag));
        }
        Object vendorsObj = data.get("VENDORS");
        int vendorCount = (vendorsObj instanceof List) ? ((List<Object>) vendorsObj).size() : 0;
        boolean highlight = vendorCount > 0;
        if (!mergeTitle && !highlight && (cols == null || cols.isEmpty())) {
            return;
        }

        byte[] content;
        try (InputStream is = new FileInputStream(outputExcelPath)) {
            content = readAll(is);
        }

        try (Workbook wb = WorkbookFactory.create(new ByteArrayInputStream(content))) {
            Sheet sheet = wb.getSheetAt(0);
            if (mergeTitle) {
                mergeTitleRow(sheet);
            }
            if (cols != null) {
                for (Object colObj : cols) {
                    mergeColumn(sheet, CellReference.convertColStringToIndex(String.valueOf(colObj).trim()));
                }
            }
            if (vendorCount > 0) {
                formatTierLabels(sheet);
                int lastCol = lastColumnIndex(sheet);
                highlightLowestPrices(wb, sheet, lastCol - vendorCount + 1, lastCol);
            }
            try (OutputStream os = new FileOutputStream(outputExcelPath)) {
                wb.write(os);
            }
        }
        logger.info("Formatted output, titleRow={}, columns={}, vendorCount={}", mergeTitle, cols, vendorCount);
    }

    /** E列货量段显示名：LTL2 -> 2T、LTL5 -> 5T、LTL10 -> 10T 等 */
    private void formatTierLabels(Sheet sheet) {
        Pattern pattern = Pattern.compile("^LTL(\\d+)$");
        for (int r = 3; r <= sheet.getLastRowNum(); r++) {
            Row row = sheet.getRow(r);
            if (row == null) {
                continue;
            }
            Cell cell = row.getCell(4);
            if (cell == null || cell.getCellType() != CellType.STRING) {
                continue;
            }
            Matcher matcher = pattern.matcher(cell.getStringCellValue().trim());
            if (matcher.matches()) {
                cell.setCellValue(matcher.group(1) + "T");
            }
        }
    }

    /** 每个数据行的供应商价格：最低价红字，第二、三低价加粗斜体 */
    private void highlightLowestPrices(Workbook wb, Sheet sheet, int startCol, int lastCol) {
        if (startCol < 0 || startCol > lastCol) {
            return;
        }
        Font redFont = wb.createFont();
        redFont.setColor(Font.COLOR_RED);
        Font boldItalicFont = wb.createFont();
        boldItalicFont.setBold(true);
        boldItalicFont.setItalic(true);
        Map<String, CellStyle> styleCache = new HashMap<>();

        for (int r = 3; r <= sheet.getLastRowNum(); r++) {
            Row row = sheet.getRow(r);
            if (row == null) {
                continue;
            }
            List<Cell> cells = new ArrayList<>();
            List<Double> values = new ArrayList<>();
            for (int c = startCol; c <= lastCol; c++) {
                Cell cell = row.getCell(c);
                Double v = numericValue(cell);
                if (v != null) {
                    cells.add(cell);
                    values.add(v);
                }
            }
            if (values.isEmpty()) {
                continue;
            }
            List<Double> distinct = new ArrayList<>(new TreeSet<>(values));
            double first = distinct.get(0);
            Double second = distinct.size() > 1 ? distinct.get(1) : null;
            Double third = distinct.size() > 2 ? distinct.get(2) : null;
            for (int i = 0; i < values.size(); i++) {
                double v = values.get(i);
                int variant;
                if (v == first) {
                    variant = 0;
                } else if ((second != null && v == second) || (third != null && v == third)) {
                    variant = 1;
                } else {
                    continue;
                }
                applyStyle(wb, cells.get(i), variant == 0 ? redFont : boldItalicFont, variant, styleCache);
            }
        }
    }

    private void applyStyle(Workbook wb, Cell cell, Font font, int variant, Map<String, CellStyle> cache) {
        int baseIndex = cell.getCellStyle().getIndex();
        String key = baseIndex + "|" + variant;
        CellStyle style = cache.get(key);
        if (style == null) {
            style = wb.createCellStyle();
            style.cloneStyleFrom(cell.getCellStyle());
            style.setFont(font);
            cache.put(key, style);
        }
        cell.setCellStyle(style);
    }

    private Double numericValue(Cell cell) {
        if (cell == null) {
            return null;
        }
        if (cell.getCellType() == CellType.NUMERIC) {
            return cell.getNumericCellValue();
        }
        if (cell.getCellType() == CellType.STRING) {
            String text = cell.getStringCellValue().trim().replace(",", "");
            if (text.isEmpty()) {
                return null;
            }
            try {
                return Double.parseDouble(text);
            } catch (NumberFormatException ignored) {
                return null;
            }
        }
        return null;
    }

    /** 整张表最大列下标 */
    private int lastColumnIndex(Sheet sheet) {
        int lastCol = 0;
        for (int r = 0; r <= sheet.getLastRowNum(); r++) {
            Row row = sheet.getRow(r);
            if (row != null && row.getLastCellNum() > lastCol) {
                lastCol = row.getLastCellNum();
            }
        }
        return lastCol - 1;
    }

    /** 首行标题合并到最后一个有数据的列 */
    private void mergeTitleRow(Sheet sheet) {
        int lastCol = lastColumnIndex(sheet);
        if (lastCol <= 0) {
            return;
        }
        // 先移除标题行已有的合并区域，再按实际供应商列数重新合并
        for (int i = sheet.getNumMergedRegions() - 1; i >= 0; i--) {
            CellRangeAddress region = sheet.getMergedRegion(i);
            if (region.getFirstRow() == 0 && region.getLastRow() == 0) {
                sheet.removeMergedRegion(i);
            }
        }
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, lastCol));
    }

    private void mergeColumn(Sheet sheet, int col) {
        if (col < 0) {
            return;
        }
        DataFormatter formatter = new DataFormatter();
        int lastRow = sheet.getLastRowNum();
        int start = -1;
        String prev = null;

        for (int r = sheet.getFirstRowNum(); r <= lastRow; r++) {
            String value = cellText(sheet, r, col, formatter);
            if (value.isEmpty()) {
                if (start >= 0) {
                    mergeRange(sheet, col, start, r - 1);
                    start = -1;
                    prev = null;
                }
                continue;
            }
            if (start >= 0 && value.equals(prev)) {
                continue;
            }
            if (start >= 0) {
                mergeRange(sheet, col, start, r - 1);
            }
            start = r;
            prev = value;
        }
        if (start >= 0) {
            mergeRange(sheet, col, start, lastRow);
        }
    }

    /** 纵向合并 start..end 行，保留首行值，清空其余单元格 */
    private void mergeRange(Sheet sheet, int col, int start, int end) {
        if (end <= start) {
            return;
        }
        for (int r = start + 1; r <= end; r++) {
            Row row = sheet.getRow(r);
            if (row != null) {
                Cell cell = row.getCell(col);
                if (cell != null) {
                    cell.setBlank();
                }
            }
        }
        sheet.addMergedRegion(new CellRangeAddress(start, end, col, col));
    }

    private String cellText(Sheet sheet, int rowIndex, int col, DataFormatter formatter) {
        Row row = sheet.getRow(rowIndex);
        if (row == null) {
            return "";
        }
        Cell cell = row.getCell(col);
        return cell == null ? "" : formatter.formatCellValue(cell).trim();
    }

    private byte[] readAll(InputStream is) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        byte[] buf = new byte[8192];
        int len;
        while ((len = is.read(buf)) != -1) {
            out.write(buf, 0, len);
        }
        return out.toByteArray();
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
