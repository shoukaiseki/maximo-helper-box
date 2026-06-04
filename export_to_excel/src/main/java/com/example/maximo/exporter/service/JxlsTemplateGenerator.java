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

/**
 * 生成JXLS模板文件（使用Excel注释方式）
 */
public class JxlsTemplateGenerator {
    private static final Logger logger = LoggerFactory.getLogger(JxlsTemplateGenerator.class);

    /**
     * 生成表结构信息模板
     */
    public void generateTableStructureTemplate(String templatePath) throws IOException {
        logger.info("Generating table structure template to: {}", templatePath);
        
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("表结构信息");
            
            // 创建样式
            CellStyle titleStyle = createTitleStyle(workbook);
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle subHeaderStyle = createSubHeaderStyle(workbook);
            CellStyle dataStyle = createDataStyle(workbook);

            int rowIndex = 0;

            // ========== 区域1: 表名和基本信息 ==========
            // jx:area 定义整个区域（A1单元格的注释）
            Row areaRow = sheet.createRow(rowIndex++);
            Cell areaCell = areaRow.createCell(0);
            setCellComment(areaCell, "jx:area(lastCell=\"K20\")");
            areaCell.setCellValue("表结构模板");
            areaCell.setCellStyle(titleStyle);

            // 表名标题（jx:each 指令在 A2 单元格注释）
            Row titleRow = sheet.createRow(rowIndex++);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellStyle(titleStyle);
            setCellComment(titleCell, "jx:each(items=\"objects\", var=\"obj\", lastCell=\"K18\")");
            titleCell.setCellValue("表名: ${obj.objectName}");
            sheet.addMergedRegion(new CellRangeAddress(titleRow.getRowNum(), titleRow.getRowNum(), 0, 12));

            // ========== 区域2: 字段信息 ==========
            // 字段标题
            Row attrHeaderRow = sheet.createRow(rowIndex++);
            String[] attrHeaders = {"中文标题", "英文标题", "属性名", "属性号", "域", "正向", "长度", 
                                   "数据类型", "必需", "主键序列", "等同对象", "小数位数", "备注"};
            for (int i = 0; i < attrHeaders.length; i++) {
                Cell cell = attrHeaderRow.createCell(i);
                cell.setCellValue(attrHeaders[i]);
                cell.setCellStyle(headerStyle);
                sheet.setColumnWidth(i, 4000);
            }

            // 字段数据行 - jx:each 在 A6 单元格注释
            Row attrDataRow = sheet.createRow(rowIndex++);
            Cell attrEachCell = attrDataRow.createCell(0);
            setCellComment(attrEachCell, "jx:each(items=\"obj.attributes\", var=\"attr\", lastCell=\"M6\")");
            String[] fields = {"title", "lTitle", "attributeName", "attributeNo", "domainId", 
                              "isPositive", "length", "maxType", "required", 
                              "primaryKeyColSeq", "sameAsObject", "scale", "remarks"};
            for (int i = 0; i < fields.length; i++) {
                Cell cell = attrDataRow.createCell(i);
                cell.setCellValue("${attr." + fields[i] + "}");
                cell.setCellStyle(dataStyle);
            }

            // ========== 区域3: 关联关系 ==========
            Row spacer1 = sheet.createRow(rowIndex++);
            Row relHeaderRow = sheet.createRow(rowIndex++);
            Cell relHeaderCell = relHeaderRow.createCell(0);
            setCellComment(relHeaderCell, "jx:each(items=\"obj.relationships\", var=\"rel\", lastCell=\"E9\")");
            relHeaderCell.setCellStyle(subHeaderStyle);
            relHeaderCell.setCellValue("关联关系");
            sheet.addMergedRegion(new CellRangeAddress(relHeaderRow.getRowNum(), relHeaderRow.getRowNum(), 0, 4));

            Row relDataRow = sheet.createRow(rowIndex++);
            String[] relHeaders = {"关系名称", "子对象", "Where子句", "基数", "备注"};
            for (int i = 0; i < relHeaders.length; i++) {
                Cell cell = relDataRow.createCell(i);
                cell.setCellValue(relHeaders[i]);
                cell.setCellStyle(headerStyle);
            }

            Row relValueRow = sheet.createRow(rowIndex++);
            String[] relFields = {"name", "child", "whereClause", "cardinality", "remarks"};
            for (int i = 0; i < relFields.length; i++) {
                Cell cell = relValueRow.createCell(i);
                cell.setCellValue("${rel." + relFields[i] + "}");
                cell.setCellStyle(dataStyle);
            }

            // ========== 区域4: 索引信息 ==========
            Row spacer2 = sheet.createRow(rowIndex++);
            Row idxHeaderRow = sheet.createRow(rowIndex++);
            Cell idxHeaderCell = idxHeaderRow.createCell(0);
            setCellComment(idxHeaderCell, "jx:each(items=\"obj.indexes\", var=\"idx\", lastCell=\"D14\")");
            idxHeaderCell.setCellStyle(subHeaderStyle);
            idxHeaderCell.setCellValue("索引信息");
            sheet.addMergedRegion(new CellRangeAddress(idxHeaderRow.getRowNum(), idxHeaderRow.getRowNum(), 0, 3));

            Row idxTitleRow = sheet.createRow(rowIndex++);
            String[] idxTitles = {"索引名称", "表名", "唯一标志", "索引列"};
            for (int i = 0; i < idxTitles.length; i++) {
                Cell cell = idxTitleRow.createCell(i);
                cell.setCellValue(idxTitles[i]);
                cell.setCellStyle(headerStyle);
            }

            Row idxDataRow = sheet.createRow(rowIndex++);
            idxDataRow.createCell(0).setCellValue("${idx.name}");
            idxDataRow.createCell(1).setCellValue("${idx.tbName}");
            idxDataRow.createCell(2).setCellValue("${idx.uniqueRule}");
            idxDataRow.createCell(3).setCellValue("${idx.columns}");
            idxDataRow.getCell(0).setCellStyle(dataStyle);
            idxDataRow.getCell(1).setCellStyle(dataStyle);
            idxDataRow.getCell(2).setCellStyle(dataStyle);
            idxDataRow.getCell(3).setCellStyle(dataStyle);
            
            // 保存模板
            Path output = Paths.get(templatePath);
            Files.createDirectories(output.getParent());
            try (FileOutputStream fos = new FileOutputStream(templatePath)) {
                workbook.write(fos);
            }
            
            logger.info("Template generated successfully");
        }
    }

    /**
     * 生成域信息模板
     */
    public void generateDomainTemplate(String templatePath) throws IOException {
        logger.info("Generating domain template to: {}", templatePath);
        
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("域信息");
            
            CellStyle titleStyle = createTitleStyle(workbook);
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle subHeaderStyle = createSubHeaderStyle(workbook);
            CellStyle dataStyle = createDataStyle(workbook);

            int rowIndex = 0;

            // ========== 区域定义 ==========
            Row areaRow = sheet.createRow(rowIndex++);
            Cell areaCell = areaRow.createCell(0);
            setCellComment(areaCell, "jx:area(lastCell=\"F10\")");
            areaCell.setCellValue("域信息模板");
            areaCell.setCellStyle(titleStyle);

            // ========== 域基本信息 ==========
            Row domainHeaderRow = sheet.createRow(rowIndex++);
            Cell domainEachCell = domainHeaderRow.createCell(0);
            setCellComment(domainEachCell, "jx:each(items=\"domains\", var=\"domain\", lastCell=\"F8\")");
            domainEachCell.setCellStyle(titleStyle);
            domainEachCell.setCellValue("域名: ${domain.domainId}   描述: ${domain.description}   英文描述: ${domain.lDescription}");
            sheet.addMergedRegion(new CellRangeAddress(domainHeaderRow.getRowNum(), domainHeaderRow.getRowNum(), 0, 5));

            // 域详细信息行
            Row detailRow1 = sheet.createRow(rowIndex++);
            detailRow1.createCell(0).setCellValue("域类型:");
            detailRow1.getCell(0).setCellStyle(subHeaderStyle);
            detailRow1.createCell(1).setCellValue("${domain.domainType}");
            detailRow1.getCell(1).setCellStyle(dataStyle);
            detailRow1.createCell(2).setCellValue("数据类型:");
            detailRow1.getCell(2).setCellStyle(subHeaderStyle);
            detailRow1.createCell(3).setCellValue("${domain.maxType}");
            detailRow1.getCell(3).setCellStyle(dataStyle);
            detailRow1.createCell(4).setCellValue("长度:");
            detailRow1.getCell(4).setCellStyle(subHeaderStyle);
            detailRow1.createCell(5).setCellValue("${domain.length}");
            detailRow1.getCell(5).setCellStyle(dataStyle);

            Row detailRow2 = sheet.createRow(rowIndex++);
            detailRow2.createCell(0).setCellValue("小数位:");
            detailRow2.getCell(0).setCellStyle(subHeaderStyle);
            detailRow2.createCell(1).setCellValue("${domain.scale}");
            detailRow2.getCell(1).setCellStyle(dataStyle);

            // 域值表格
            Row valueHeaderRow = sheet.createRow(rowIndex++);
            valueHeaderRow.createCell(0).setCellValue("域值");
            valueHeaderRow.createCell(1).setCellValue("描述");
            valueHeaderRow.createCell(2).setCellValue("英文名称");
            for (int i = 0; i < 3; i++) {
                valueHeaderRow.getCell(i).setCellStyle(headerStyle);
                sheet.setColumnWidth(i, 5000);
            }

            Row valueDataRow = sheet.createRow(rowIndex++);
            valueDataRow.createCell(0).setCellValue("${domain.domainValues}");
            valueDataRow.getCell(0).setCellStyle(dataStyle);
            sheet.addMergedRegion(new CellRangeAddress(valueDataRow.getRowNum(), valueDataRow.getRowNum(), 0, 2));

            // 设置列宽
            sheet.setColumnWidth(0, 3500);
            sheet.setColumnWidth(1, 3500);
            sheet.setColumnWidth(2, 3500);
            sheet.setColumnWidth(3, 3500);
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

    /**
     * 生成完整的模板包
     */
    public void generateAllTemplates(String templateDir) throws IOException {
        logger.info("Generating all templates to directory: {}", templateDir);
        
        Path templatePath = Paths.get(templateDir);
        Files.createDirectories(templatePath);
        
        generateTableStructureTemplate(templatePath.resolve("template_table_structure.xlsx").toString());
        generateDomainTemplate(templatePath.resolve("template_domain.xlsx").toString());
        
        logger.info("All templates generated successfully");
    }

    /**
     * 设置单元格注释
     */
    private void setCellComment(Cell cell, String commentText) {
        Drawing<?> drawing = cell.getSheet().createDrawingPatriarch();
        
        CreationHelper factory = cell.getSheet().getWorkbook().getCreationHelper();
        
        // 创建注释锚点位置
        ClientAnchor anchor = factory.createClientAnchor();
        anchor.setCol1(cell.getColumnIndex());
        anchor.setCol2(cell.getColumnIndex() + 2);
        anchor.setRow1(cell.getRowIndex());
        anchor.setRow2(cell.getRowIndex() + 3);
        
        // 创建注释
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
