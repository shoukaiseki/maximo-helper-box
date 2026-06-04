package com.example.maximo.exporter.service;

import com.example.maximo.exporter.entity.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class ExcelExportService {
    private static final Logger logger = LoggerFactory.getLogger(ExcelExportService.class);
    private final DataService dataService;

    public ExcelExportService(DataService dataService) {
        this.dataService = dataService;
    }

    public void export(String outputPath) throws IOException, SQLException {
        logger.info("Starting Excel export to: {}", outputPath);
        
        try (Workbook workbook = new XSSFWorkbook()) {
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle dataStyle = createDataStyle(workbook);
            CellStyle titleStyle = createTitleStyle(workbook);

            List<MaxObject> objects = dataService.getMaxObjects();
            Set<String> allDomainIds = collectAllDomainIds(objects);

            createSheet1(workbook, objects, headerStyle, dataStyle, titleStyle);
            createSheet2(workbook, allDomainIds, headerStyle, dataStyle, titleStyle);

            Path output = Paths.get(outputPath);
            Files.createDirectories(output.getParent());
            try (FileOutputStream fos = new FileOutputStream(outputPath)) {
                workbook.write(fos);
            }
            
            logger.info("Excel export completed successfully");
        }
    }

    private Set<String> collectAllDomainIds(List<MaxObject> objects) throws SQLException {
        Set<String> domainIds = new HashSet<>();
        for (MaxObject obj : objects) {
            List<MaxAttribute> attributes = dataService.getMaxAttributes(obj.getObjectName());
            for (MaxAttribute attr : attributes) {
                if (attr.getDomainId() != null && !attr.getDomainId().isEmpty()) {
                    domainIds.add(attr.getDomainId());
                }
            }
        }
        logger.info("Collected {} unique domain IDs", domainIds.size());
        return domainIds;
    }

    private void createSheet1(Workbook workbook, List<MaxObject> objects, 
                              CellStyle headerStyle, CellStyle dataStyle, CellStyle titleStyle) throws SQLException {
        Sheet sheet = workbook.createSheet("表结构信息");
        
        int currentRow = 0;
        
        for (MaxObject obj : objects) {
            currentRow = writeTableInfo(sheet, obj, currentRow, headerStyle, dataStyle, titleStyle);
            currentRow += 2;
        }
        
        sheet.setColumnWidth(0, 3500);
        sheet.setColumnWidth(1, 3500);
        sheet.setColumnWidth(2, 3000);
        sheet.setColumnWidth(3, 1500);
        sheet.setColumnWidth(4, 2500);
        sheet.setColumnWidth(5, 1200);
        sheet.setColumnWidth(6, 1500);
        sheet.setColumnWidth(7, 2000);
        sheet.setColumnWidth(8, 1200);
        sheet.setColumnWidth(9, 1500);
        sheet.setColumnWidth(10, 2500);
        sheet.setColumnWidth(11, 1500);
        sheet.setColumnWidth(12, 6000);
        
        sheet.setColumnWidth(13, 3000);
        sheet.setColumnWidth(14, 3000);
        sheet.setColumnWidth(15, 8000);
        sheet.setColumnWidth(16, 1500);
        sheet.setColumnWidth(17, 6000);
        
        sheet.setColumnWidth(18, 3000);
        sheet.setColumnWidth(19, 3000);
        sheet.setColumnWidth(20, 1500);
        sheet.setColumnWidth(21, 5000);
    }

    private int writeTableInfo(Sheet sheet, MaxObject obj, int startRow,
                               CellStyle headerStyle, CellStyle dataStyle, CellStyle titleStyle) throws SQLException {
        int rowNum = startRow;
        
        Row titleRow = sheet.createRow(rowNum++);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("表名: " + obj.getObjectName());
        titleCell.setCellStyle(titleStyle);
        sheet.addMergedRegion(new CellRangeAddress(rowNum - 1, rowNum - 1, 0, 14));

        rowNum = writeAttributeSection(sheet, obj.getObjectName(), rowNum, headerStyle, dataStyle);
        rowNum++;
        
        rowNum = writeRelationshipSection(sheet, obj.getObjectName(), rowNum, headerStyle, dataStyle);
        rowNum++;
        
        rowNum = writeIndexSection(sheet, obj.getObjectName(), rowNum, headerStyle, dataStyle);
        
        return rowNum;
    }

    private int writeAttributeSection(Sheet sheet, String objectName, int startRow,
                                      CellStyle headerStyle, CellStyle dataStyle) throws SQLException {
        int rowNum = startRow;
        
        Row headerRow = sheet.createRow(rowNum++);
        String[] attrHeaders = {"中文标题", "英文标题", "属性名", "属性号", "域", "正向", "长度", 
                               "数据类型", "必需", "主键序列", "等同对象", "小数位数", "备注"};
        for (int i = 0; i < attrHeaders.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(attrHeaders[i]);
            cell.setCellStyle(headerStyle);
        }

        List<MaxAttribute> attributes = dataService.getMaxAttributes(objectName);
        for (MaxAttribute attr : attributes) {
            Row dataRow = sheet.createRow(rowNum++);
            writeCell(dataRow, 0, attr.getTitle(), dataStyle);
            writeCell(dataRow, 1, attr.getLTitle(), dataStyle);
            writeCell(dataRow, 2, attr.getAttributeName(), dataStyle);
            writeCell(dataRow, 3, attr.getAttributeNo(), dataStyle);
            writeCell(dataRow, 4, attr.getDomainId(), dataStyle);
            writeCell(dataRow, 5, attr.getIsPositive(), dataStyle);
            writeCell(dataRow, 6, attr.getLength(), dataStyle);
            writeCell(dataRow, 7, attr.getMaxType(), dataStyle);
            writeCell(dataRow, 8, attr.getRequired(), dataStyle);
            writeCell(dataRow, 9, attr.getPrimaryKeyColSeq(), dataStyle);
            writeCell(dataRow, 10, attr.getSameAsObject(), dataStyle);
            writeCell(dataRow, 11, attr.getScale(), dataStyle);
            writeCell(dataRow, 12, attr.getRemarks(), dataStyle);
        }
        
        return rowNum;
    }

    private int writeRelationshipSection(Sheet sheet, String objectName, int startRow,
                                         CellStyle headerStyle, CellStyle dataStyle) throws SQLException {
        int rowNum = startRow;
        
        Row headerRow = sheet.createRow(rowNum++);
        String[] relHeaders = {"关系名称", "子对象", "Where子句", "基数", "备注"};
        for (int i = 0; i < relHeaders.length; i++) {
            Cell cell = headerRow.createCell(13 + i);
            cell.setCellValue(relHeaders[i]);
            cell.setCellStyle(headerStyle);
        }

        List<MaxRelationship> relationships = dataService.getMaxRelationships(objectName);
        for (MaxRelationship rel : relationships) {
            Row dataRow = sheet.createRow(rowNum++);
            writeCell(dataRow, 13, rel.getName(), dataStyle);
            writeCell(dataRow, 14, rel.getChild(), dataStyle);
            writeCell(dataRow, 15, rel.getWhereClause(), dataStyle);
            writeCell(dataRow, 16, rel.getCardinality(), dataStyle);
            writeCell(dataRow, 17, rel.getRemarks(), dataStyle);
        }
        
        return rowNum;
    }

    private int writeIndexSection(Sheet sheet, String objectName, int startRow,
                                  CellStyle headerStyle, CellStyle dataStyle) throws SQLException {
        int rowNum = startRow;
        
        Row headerRow = sheet.createRow(rowNum++);
        String[] indexHeaders = {"索引名称", "表名", "唯一标志", "索引列"};
        for (int i = 0; i < indexHeaders.length; i++) {
            Cell cell = headerRow.createCell(18 + i);
            cell.setCellValue(indexHeaders[i]);
            cell.setCellStyle(headerStyle);
        }

        List<MaxSysIndex> indexes = dataService.getMaxSysIndexes(objectName);
        List<String> ixNames = new ArrayList<>();
        for (MaxSysIndex index : indexes) {
            ixNames.add(index.getName());
        }
        List<MaxSysKey> keys = dataService.getMaxSysKeys(ixNames);
        
        Map<String, List<String>> indexColumns = new HashMap<>();
        for (MaxSysKey key : keys) {
            indexColumns.computeIfAbsent(key.getIxName(), k -> new ArrayList<>())
                       .add(key.getColName() + (key.getOrdering() != null ? "(" + key.getOrdering() + ")" : ""));
        }

        for (MaxSysIndex index : indexes) {
            Row dataRow = sheet.createRow(rowNum++);
            writeCell(dataRow, 18, index.getName(), dataStyle);
            writeCell(dataRow, 19, index.getTbName(), dataStyle);
            writeCell(dataRow, 20, index.getUniqueRule(), dataStyle);
            writeCell(dataRow, 21, String.join(", ", indexColumns.getOrDefault(index.getName(), new ArrayList<>())), dataStyle);
        }
        
        return rowNum;
    }

    private void createSheet2(Workbook workbook, Set<String> domainIds,
                              CellStyle headerStyle, CellStyle dataStyle, CellStyle titleStyle) throws SQLException {
        Sheet sheet = workbook.createSheet("域信息");
        
        int rowNum = 0;
        
        Row titleRow = sheet.createRow(rowNum++);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("域信息汇总");
        titleCell.setCellStyle(titleStyle);
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 10));
        rowNum++;

        Row domainHeaderRow = sheet.createRow(rowNum++);
        String[] domainHeaders = {"域ID", "域类型", "数据类型", "长度", "小数位数", "域值信息"};
        for (int i = 0; i < domainHeaders.length; i++) {
            Cell cell = domainHeaderRow.createCell(i);
            cell.setCellValue(domainHeaders[i]);
            cell.setCellStyle(headerStyle);
        }

        List<MaxDomain> domains = dataService.getMaxDomains(new ArrayList<>(domainIds));
        for (MaxDomain domain : domains) {
            Row dataRow = sheet.createRow(rowNum++);
            writeCell(dataRow, 0, domain.getDomainId(), dataStyle);
            writeCell(dataRow, 1, domain.getDomainType(), dataStyle);
            writeCell(dataRow, 2, domain.getMaxType(), dataStyle);
            writeCell(dataRow, 3, domain.getLength(), dataStyle);
            writeCell(dataRow, 4, domain.getScale(), dataStyle);
            
            List<String> domainValues = dataService.getDomainValues(domain.getDomainId(), domain.getDomainType());
            String domainValueInfo = String.join("; ", domainValues);
            if (domainValueInfo.length() > 500) {
                domainValueInfo = domainValueInfo.substring(0, 500) + "...";
            }
            writeCell(dataRow, 5, domainValueInfo, dataStyle);
        }
        
        sheet.setColumnWidth(0, 4000);
        sheet.setColumnWidth(1, 2500);
        sheet.setColumnWidth(2, 2500);
        sheet.setColumnWidth(3, 1500);
        sheet.setColumnWidth(4, 2000);
        sheet.setColumnWidth(5, 15000);
    }

    private void writeCell(Row row, int column, Object value, CellStyle style) {
        Cell cell = row.createCell(column);
        if (value == null) {
            cell.setCellValue("");
        } else if (value instanceof Number) {
            cell.setCellValue(((Number) value).doubleValue());
        } else {
            cell.setCellValue(value.toString());
        }
        cell.setCellStyle(style);
    }

    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 11);
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }

    private CellStyle createDataStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }

    private CellStyle createTitleStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 14);
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.LEFT);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }
}