package com.example.maximo.template;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * 生成 JXLS 测试模板，匹配原始 JSON 结构。
 *
 * <p>JSON 样例:</p>
 * <pre>
 * {
 *   "title": "脚本历史记录导出",
 *   "sheetName": "脚本历史记录",
 *   "headers": ["ID", "脚本名称", "别名", "版本", "主机名", "创建人", "创建时间"],
 *   "data": [
 *     ["1", "TEST_SCRIPT_01", "别名01", "1.0.0", "host01", "MAXADMIN", "2026-07-18 ..."]
 *   ]
 * }
 * </pre>
 *
 * <p>JXLS Context 变量: title, sheetName, headers, data</p>
 * <p>data 是 List&lt;List&lt;String&gt;&gt;，模板中用 ${row[0]} 访问</p>
 */
public class GenerateTestTemplate {

    private static final int COL_COUNT = 7;

    public static void main(String[] args) throws Exception {
        String output = args.length > 0 ? args[0] : "templates/test_template.xlsx";
        Path outPath = Paths.get(output);
        Files.createDirectories(outPath.getParent());

        try (Workbook wb = new XSSFWorkbook()) {
            Sheet sheet = wb.createSheet("模板");

            // Row 0: Title — jx:area 定义处理区域
            Row r0 = sheet.createRow(0);
            Cell c0 = r0.createCell(0);
            setComment(c0, "jx:area(lastCell=\"G3\")");
            c0.setCellValue("${title}");

            // Row 1: Headers — 使用 headers 数组按索引读取
            Row r1 = sheet.createRow(1);
            for (int i = 0; i < COL_COUNT; i++) {
                Cell c = r1.createCell(i);
                c.setCellValue("${headers[" + i + "]}");
                sheet.setColumnWidth(i, 5000);
            }

            // Row 2: Data — jx:each 遍历 data
            // data 是 List<List>，每行用 ${row[0]}...${row[6]} 访问
            Row r2 = sheet.createRow(2);
            Cell first = r2.createCell(0);
            setComment(first, "jx:each(items=\"data\", var=\"row\", lastCell=\"G3\")");
            first.setCellValue("${row[0]}");
            for (int i = 1; i < COL_COUNT; i++) {
                r2.createCell(i).setCellValue("${row[" + i + "]}");
            }

            try (FileOutputStream fos = new FileOutputStream(output)) {
                wb.write(fos);
            }
        }

        System.out.println("Template generated: " + outPath.toAbsolutePath());
    }

    private static void setComment(Cell cell, String text) {
        Drawing<?> drawing = cell.getSheet().createDrawingPatriarch();
        CreationHelper helper = cell.getSheet().getWorkbook().getCreationHelper();
        ClientAnchor anchor = helper.createClientAnchor();
        anchor.setCol1(cell.getColumnIndex());
        anchor.setCol2(cell.getColumnIndex() + 2);
        anchor.setRow1(cell.getRowIndex());
        anchor.setRow2(cell.getRowIndex() + 3);
        Comment comment = drawing.createCellComment(anchor);
        comment.setString(helper.createRichTextString(text));
        comment.setAuthor("GenerateTestTemplate");
        cell.setCellComment(comment);
    }
}
