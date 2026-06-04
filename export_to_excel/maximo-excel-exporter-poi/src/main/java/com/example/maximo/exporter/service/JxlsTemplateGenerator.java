package com.example.maximo.exporter.service;

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

public class JxlsTemplateGenerator {
    private static final Logger logger = LoggerFactory.getLogger(JxlsTemplateGenerator.class);

    public void generateTableStructureTemplate(String templatePath) throws IOException {
        logger.info("Generating table structure template to: {}", templatePath);
        
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("表结构信息");
            
            CellStyle titleStyle = createTitleStyle(workbook);
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle subHeaderStyle = createSubHeaderStyle(workbook);
            CellStyle dataStyle = createDataStyle(workbook);

            int rowIndex = 0;

            Row areaRow = sheet.createRow(rowIndex++);
            Cell areaCell = areaRow.createCell(0);
            setCellComment(areaCell, "jx:area(lastCell=\"N20\")");
            areaCell.setCellValue("表结构模板");
            areaCell.setCellStyle(titleStyle);

            Row titleRow = sheet.createRow(rowIndex++);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellStyle(titleStyle);
            setCellComment(titleCell, "jx:each(items=\"objects\", var=\"obj\", lastCell=\"N18\")");
            titleCell.setCellValue("表名: ${obj.objectName}");
            
            Row descRow = sheet.createRow(rowIndex++);
            descRow.createCell(0).setCellValue("中文描述:");
            descRow.getCell(0).setCellStyle(subHeaderStyle);
            descRow.createCell(1).setCellValue("${obj.lDescription}");
            descRow.getCell(1).setCellStyle(dataStyle);
            descRow.createCell(2).setCellValue("英文描述:");
            descRow.getCell(2).setCellStyle(subHeaderStyle);
            descRow.createCell(3).setCellValue("${obj.description}");
            descRow.getCell(3).setCellStyle(dataStyle);

            Row attrHeaderRow = sheet.createRow(rowIndex++);
            String[] attrHeaders = {"中文标题", "英文标题", "属性名", "属性号", "域", "正向", "长度", 
                                   "数据类型", "必需", "主键序列", "等同对象", "小数位数", "中文备注", "英文备注"};
            for (int i = 0; i < attrHeaders.length; i++) {
                Cell cell = attrHeaderRow.createCell(i);
                cell.setCellValue(attrHeaders[i]);
                cell.setCellStyle(headerStyle);
                sheet.setColumnWidth(i, 4000);
            }

            Row attrDataRow = sheet.createRow(rowIndex++);
            Cell attrEachCell = attrDataRow.createCell(0);
            setCellComment(attrEachCell, "jx:each(items=\"obj.attributes\", var=\"attr\", lastCell=\"N5\")");
            String[] fields = {"lTitle", "title", "attributeName", "attributeNo", "domainId", 
                              "isPositive", "length", "maxType", "required", 
                              "primaryKeyColSeq", "sameAsObject", "scale", "remarks", "lRemarks"};
            for (int i = 0; i < fields.length; i++) {
                Cell cell = attrDataRow.createCell(i);
                cell.setCellValue("${attr." + fields[i] + "}");
                cell.setCellStyle(dataStyle);
            }

            Row spacer1 = sheet.createRow(rowIndex++);
            Row relHeaderRow = sheet.createRow(rowIndex++);
            relHeaderRow.createCell(0).setCellValue("关联关系");
            relHeaderRow.getCell(0).setCellStyle(subHeaderStyle);
            sheet.addMergedRegion(new CellRangeAddress(relHeaderRow.getRowNum(), relHeaderRow.getRowNum(), 0, 4));

            Row relDataRow = sheet.createRow(rowIndex++);
            String[] relHeaders = {"关系名称", "子对象", "Where子句", "基数", "备注"};
            for (int i = 0; i < relHeaders.length; i++) {
                Cell cell = relDataRow.createCell(i);
                cell.setCellValue(relHeaders[i]);
                cell.setCellStyle(headerStyle);
            }

            Row relValueRow = sheet.createRow(rowIndex++);
            Cell relEachCell = relValueRow.createCell(0);
            setCellComment(relEachCell, "jx:each(items=\"obj.relationships\", var=\"rel\", lastCell=\"E9\")");
            String[] relFields = {"name", "child", "whereClause", "cardinality", "remarks"};
            for (int i = 0; i < relFields.length; i++) {
                Cell cell = relValueRow.createCell(i);
                cell.setCellValue("${rel." + relFields[i] + "}");
                cell.setCellStyle(dataStyle);
            }

            Row spacer2 = sheet.createRow(rowIndex++);
            Row idxHeaderRow = sheet.createRow(rowIndex++);
            idxHeaderRow.createCell(0).setCellValue("索引信息");
            idxHeaderRow.getCell(0).setCellStyle(subHeaderStyle);
            sheet.addMergedRegion(new CellRangeAddress(idxHeaderRow.getRowNum(), idxHeaderRow.getRowNum(), 0, 3));

            Row idxTitleRow = sheet.createRow(rowIndex++);
            String[] idxTitles = {"索引名称", "表名", "唯一标志", "索引列"};
            for (int i = 0; i < idxTitles.length; i++) {
                Cell cell = idxTitleRow.createCell(i);
                cell.setCellValue(idxTitles[i]);
                cell.setCellStyle(headerStyle);
            }

            Row idxDataRow = sheet.createRow(rowIndex++);
            Cell idxEachCell = idxDataRow.createCell(0);
            setCellComment(idxEachCell, "jx:each(items=\"obj.indexes\", var=\"idx\", lastCell=\"D13\")");
            idxDataRow.createCell(0).setCellValue("${idx.name}");
            idxDataRow.createCell(1).setCellValue("${idx.tbName}");
            idxDataRow.createCell(2).setCellValue("${idx.uniqueRule}");
            
            Cell idxColumnsCell = idxDataRow.createCell(3);
            setCellComment(idxColumnsCell, "jx:each(items=\"idx.columns\", var=\"col\", lastCell=\"D13\")");
            idxColumnsCell.setCellValue("${col.col}");
            
            idxDataRow.getCell(0).setCellStyle(dataStyle);
            idxDataRow.getCell(1).setCellStyle(dataStyle);
            idxDataRow.getCell(2).setCellStyle(dataStyle);
            idxColumnsCell.setCellStyle(dataStyle);
            
            Path output = Paths.get(templatePath);
            Files.createDirectories(output.getParent());
            try (FileOutputStream fos = new FileOutputStream(templatePath)) {
                workbook.write(fos);
            }
            
            logger.info("Template generated successfully");
        }
    }

    public void generateDomainTemplate(String templatePath) throws IOException {
        logger.info("Generating domain template to: {}", templatePath);
        
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("域信息");
            
            CellStyle titleStyle = createTitleStyle(workbook);
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle subHeaderStyle = createSubHeaderStyle(workbook);
            CellStyle dataStyle = createDataStyle(workbook);

            int rowIndex = 0;

            Row areaRow = sheet.createRow(rowIndex++);
            Cell areaCell = areaRow.createCell(0);
            setCellComment(areaCell, "jx:area(lastCell=\"F10\")");
            areaCell.setCellValue("域信息模板");
            areaCell.setCellStyle(titleStyle);

            Row domainHeaderRow = sheet.createRow(rowIndex++);
            Cell domainEachCell = domainHeaderRow.createCell(0);
            setCellComment(domainEachCell, "jx:each(items=\"domains\", var=\"domain\", lastCell=\"D10\")");
            domainEachCell.setCellValue("域信息");
            domainEachCell.setCellStyle(titleStyle);
            sheet.addMergedRegion(new CellRangeAddress(domainHeaderRow.getRowNum(), domainHeaderRow.getRowNum(), 0, 5));

            Row detailRow1 = sheet.createRow(rowIndex++);
            detailRow1.createCell(0).setCellValue("域名:");
            detailRow1.getCell(0).setCellStyle(subHeaderStyle);
            detailRow1.createCell(1).setCellValue("${domain.domainId}");
            detailRow1.getCell(1).setCellStyle(dataStyle);
            detailRow1.createCell(2).setCellValue("域类型:");
            detailRow1.getCell(2).setCellStyle(subHeaderStyle);
            detailRow1.createCell(3).setCellValue("${domain.domainType}");
            detailRow1.getCell(3).setCellStyle(dataStyle);

            Row detailRow2 = sheet.createRow(rowIndex++);
            detailRow2.createCell(0).setCellValue("数据类型:");
            detailRow2.getCell(0).setCellStyle(subHeaderStyle);
            detailRow2.createCell(1).setCellValue("${domain.maxType}");
            detailRow2.getCell(1).setCellStyle(dataStyle);
            detailRow2.createCell(2).setCellValue("长度:");
            detailRow2.getCell(2).setCellStyle(subHeaderStyle);
            detailRow2.createCell(3).setCellValue("${domain.length}");
            detailRow2.getCell(3).setCellStyle(dataStyle);

            Row detailRow3 = sheet.createRow(rowIndex++);
            detailRow3.createCell(0).setCellValue("小数位:");
            detailRow3.getCell(0).setCellStyle(subHeaderStyle);
            detailRow3.createCell(1).setCellValue("${domain.scale}");
            detailRow3.getCell(1).setCellStyle(dataStyle);

            Row descRow = sheet.createRow(rowIndex++);
            descRow.createCell(0).setCellValue("中文描述:");
            descRow.getCell(0).setCellStyle(subHeaderStyle);
            descRow.createCell(1).setCellValue("${domain.lDescription}");
            descRow.getCell(1).setCellStyle(dataStyle);
            descRow.createCell(2).setCellValue("英文描述:");
            descRow.getCell(2).setCellStyle(subHeaderStyle);
            descRow.createCell(3).setCellValue("${domain.description}");
            descRow.getCell(3).setCellStyle(dataStyle);

            Row valueHeaderRow = sheet.createRow(rowIndex++);
            valueHeaderRow.createCell(0).setCellValue("域值");
            valueHeaderRow.createCell(1).setCellValue("描述");
            valueHeaderRow.createCell(2).setCellValue("英文名称");
            for (int i = 0; i < 3; i++) {
                valueHeaderRow.getCell(i).setCellStyle(headerStyle);
                sheet.setColumnWidth(i, 5000);
            }

            Row valueDataRow = sheet.createRow(rowIndex++);
            Cell valueEachCell = valueDataRow.createCell(0);
            setCellComment(valueEachCell, "jx:each(items=\"domain.domainValues\", var=\"value\", lastCell=\"C8\")");
            valueDataRow.createCell(0).setCellValue("${value.value}");
            valueDataRow.createCell(1).setCellValue("${value.description}");
            valueDataRow.createCell(2).setCellValue("${value.lDescription}");
            for (int i = 0; i < 3; i++) {
                valueDataRow.getCell(i).setCellStyle(dataStyle);
            }

            sheet.setColumnWidth(0, 3500);
            sheet.setColumnWidth(1, 4500);
            sheet.setColumnWidth(2, 3500);
            sheet.setColumnWidth(3, 4500);
            sheet.setColumnWidth(4, 3500);
            sheet.setColumnWidth(5, 3500);
            
            Path output = Paths.get(templatePath);
            Files.createDirectories(output.getParent());
            try (FileOutputStream fos = new FileOutputStream(templatePath)) {
                workbook.write(fos);
            }
            
            logger.info("Domain template generated successfully");
        }
    }

    public void generateAllTemplates(String templateDir) throws IOException {
        logger.info("Generating all templates to directory: {}", templateDir);
        
        Path templatePath = Paths.get(templateDir);
        Files.createDirectories(templatePath);
        
        generateTableStructureTemplate(templatePath.resolve("template_table_structure.xlsx").toString());
        generateDomainTemplate(templatePath.resolve("template_domain.xlsx").toString());
        
        logger.info("All templates generated successfully");
    }

    private void setCellComment(Cell cell, String commentText) {
        Drawing<?> drawing = cell.getSheet().createDrawingPatriarch();
        
        CreationHelper factory = cell.getSheet().getWorkbook().getCreationHelper();
        
        ClientAnchor anchor = factory.createClientAnchor();
        anchor.setCol1(cell.getColumnIndex());
        anchor.setCol2(cell.getColumnIndex() + 2);
        anchor.setRow1(cell.getRowIndex());
        anchor.setRow2(cell.getRowIndex() + 3);
        
        Comment comment = drawing.createCellComment(anchor);
        RichTextString str = factory.createRichTextString(commentText);
        comment.setString(str);
        comment.setAuthor("JxlsTemplateGenerator");
        
        cell.setCellComment(comment);
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

    private CellStyle createSubHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 10);
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.LIGHT_CORNFLOWER_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setAlignment(HorizontalAlignment.CENTER);
        return style;
    }

    private CellStyle createDataStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setWrapText(true);
        return style;
    }
}