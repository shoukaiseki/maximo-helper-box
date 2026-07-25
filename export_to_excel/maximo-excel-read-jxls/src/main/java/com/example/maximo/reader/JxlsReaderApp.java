package com.example.maximo.reader;

import com.example.maximo.reader.model.Chief;
import com.example.maximo.reader.model.Department;
import com.example.maximo.reader.model.Employee;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileInputStream;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * JXLS Excel Reader - 使用 JXLS + POI 读取 departmentdata.xls
 * <p>
 * departmentdata.xls 是 JXLS 官方示例模板文件，数据列结构:
 *   Col0: 员工姓名 / 标签
 *   Col1: 年龄
 *   Col2: 出生日期
 *   Col3: 薪资
 *   Col4: 奖金比例 (如 0.25)
 *   Col5: 含奖金总薪资
 *   Col6: 上级姓名
 */
public class JxlsReaderApp {

    private static final Logger log = LoggerFactory.getLogger(JxlsReaderApp.class);
    private static final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
            .enable(SerializationFeature.INDENT_OUTPUT);

    public static void main(String[] args) throws Exception {
        String excelPath = "departmentdata.xls";
        if (args.length > 0) {
            excelPath = args[0];
        }

        log.info("========== JXLS Excel Reader ==========");
        log.info("读取文件: {}", excelPath);

        // 1) 打印原始数据
        printRawData(excelPath);

        // 2) 解析部门员工结构
        List<Department> departments = parseDepartments(excelPath);

        // 3) JSON 输出
        log.info("共解析到 {} 个部门", departments.size());
        System.out.println("\n========== 部门层级数据 (JSON) ==========");
        System.out.println(objectMapper.writeValueAsString(departments));

        // 4) 表格输出
        System.out.println("\n========== 部门层级数据 (表格) ==========");
        printDepartmentsTable(departments);

        log.info("========== 读取完成 ==========");
    }

    // ============================================================
    //  1) 原始数据展示
    // ============================================================

    private static void printRawData(String filePath) throws Exception {
        try (InputStream is = new FileInputStream(filePath);
             Workbook workbook = new HSSFWorkbook(is)) {

            Sheet sheet = workbook.getSheetAt(0);
            log.info("工作表: '{}' (共 {} 行)", sheet.getSheetName(), sheet.getLastRowNum() + 1);

            System.out.println("\n========== 原始数据 (每行所有列) ==========");
            for (int r = 0; r <= sheet.getLastRowNum(); r++) {
                Row row = sheet.getRow(r);
                if (row == null) {
                    System.out.printf("行[%2d]: (空行)%n", r);
                    continue;
                }
                List<String> cells = new ArrayList<>();
                for (int c = 0; c < Math.max(row.getLastCellNum(), 8); c++) {
                    cells.add(getCellValueAsString(row.getCell(c)));
                }
                System.out.printf("行[%2d]: %s%n", r, cells);
            }
        }
    }

    // ============================================================
    //  2) 智能解析部门 + 员工
    // ============================================================

    private static List<Department> parseDepartments(String filePath) throws Exception {
        List<Department> departments = new ArrayList<>();
        Department currentDept = null;
        boolean inEmployeeSection = false;

        try (InputStream is = new FileInputStream(filePath);
             Workbook workbook = new HSSFWorkbook(is)) {

            Sheet sheet = workbook.getSheetAt(0);

            for (int r = 0; r <= sheet.getLastRowNum(); r++) {
                Row row = sheet.getRow(r);
                if (row == null) continue;

                String col0 = readStringCell(row.getCell(0));
                Double val1 = readDoubleCell(row.getCell(1));
                Double val3 = readDoubleCell(row.getCell(3));

                // --- 空行 / 跳过条件 ---
                boolean isBlankRow = isRowBlank(row);
                if (isBlankRow) {
                    continue;
                }

                // --- 第1行: Department 标记 (部门名称在 col1) ---
                if ("Department".equalsIgnoreCase(col0)) {
                    String deptName = readStringCell(row.getCell(1));
                    if (currentDept != null && !currentDept.getEmployees().isEmpty()) {
                        departments.add(currentDept);
                    }
                    currentDept = new Department();
                    currentDept.setName(deptName != null ? deptName : col0);
                    inEmployeeSection = false;
                    log.debug("[行{}] 部门: {}", r, currentDept.getName());
                    continue;
                }

                // --- 标签行: Chief / Employees / 表头行 ---
                if (isLabelRow(col0, row)) {
                    // "Chief" 行: 尝试读取负责人姓名
                    if ("Chief".equalsIgnoreCase(col0)) {
                        String chiefName = readStringCell(row.getCell(1));
                        if (currentDept != null) {
                            Chief chiefObj = currentDept.getChief();
                            if (chiefObj == null) {
                                chiefObj = new Chief();
                                currentDept.setChief(chiefObj);
                            }
                            if (chiefName != null) {
                                chiefObj.setName(chiefName);
                            }
                        }
                        log.debug("[行{}] 负责人: {}", r, chiefName);
                    }
                    // "Name" 表头行 -> 进入员工区域
                    if ("Name".equalsIgnoreCase(col0) || "Employees".equalsIgnoreCase(col0)) {
                        inEmployeeSection = true;
                        if (currentDept == null) {
                            currentDept = new Department();
                        }
                        log.debug("[行{}] 开始员工区域", r);
                    }
                    continue;
                }

                // --- 合计行 ---
                if (isTotalRow(col0)) {
                    if (currentDept != null && val3 != null) {
                        currentDept.setTotalPayment(val3);
                        log.debug("[行{}] 合计: payment={}", r, val3);
                    }
                    continue;
                }

                // --- 员工数据行 (必须有姓名) ---
                if (inEmployeeSection && currentDept != null && col0 != null && !col0.isEmpty()) {
                    Employee emp = new Employee();
                    emp.setName(col0);

                    // 年龄 (col1)
                    if (val1 != null && val1 > 0 && val1 < 150) {
                        emp.setAge(val1.intValue());
                    }

                    // 出生日期 (col2 - POI 日期)
                    Cell cell2 = row.getCell(2);
                    if (cell2 != null && DateUtil.isCellDateFormatted(cell2)) {
                        Date date = cell2.getDateCellValue();
                        emp.setBirthDate(date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
                    }

                    // 薪资 (col3)
                    if (val3 != null) {
                        emp.setPayment(val3);
                    }

                    // 奖金比例 (col4)
                    Double val4 = readDoubleCell(row.getCell(4));
                    if (val4 != null) {
                        emp.setBonus(val4);
                    }

                    // 上级 (col6)
                    String superior = readStringCell(row.getCell(6));
                    if (superior != null) {
                        emp.setSuperior(superior);
                    }

                    currentDept.addEmployee(emp);
                    log.debug("[行{}] 员工: name={}, age={}, birth={}, payment={}, bonus={}, superior={}",
                            r, emp.getName(), emp.getAge(), emp.getBirthDate(),
                            emp.getPayment(), emp.getBonus(), emp.getSuperior());
                }
            }

            // 最后一个部门
            if (currentDept != null && !currentDept.getEmployees().isEmpty()) {
                departments.add(currentDept);
            }
        }

        return departments;
    }

    /** 判断是否为空行 */
    private static boolean isRowBlank(Row row) {
        for (int c = 0; c < Math.max(row.getLastCellNum(), 8); c++) {
            Cell cell = row.getCell(c);
            if (cell != null && cell.getCellType() != CellType.BLANK) {
                String val = getCellValueAsString(cell);
                if (val != null && !val.isEmpty()) {
                    return false;
                }
            }
        }
        return true;
    }

    /** 判断是否为标签行 (非员工数据行) */
    private static boolean isLabelRow(String col0, Row row) {
        if (col0 == null) return false;
        return col0.equalsIgnoreCase("Chief")
                || col0.equalsIgnoreCase("Name")
                || col0.equalsIgnoreCase("Employees")
                || col0.contains("Name") && col0.contains("Age");   // "Name, Age, ..." 表头
    }

    /** 判断是否为合计行 */
    private static boolean isTotalRow(String col0) {
        if (col0 == null) return false;
        String lower = col0.toLowerCase();
        return lower.contains("total") || lower.contains("合计") || lower.contains("汇总");
    }

    // ============================================================
    //  3) 美化打印
    // ============================================================

    private static void printDepartmentsTable(List<Department> departments) {
        if (departments.isEmpty()) {
            System.out.println("(无数据)");
            return;
        }

        String sep = "+----------------------+----------------------+------+------------+----------+-----------+----------------------+";
        String fmt = "| %-20s | %-20s | %-4s | %-10s | %-8s | %-9s | %-20s |";

        System.out.println(sep);
        System.out.printf(fmt, "部门", "员工姓名", "年龄", "出生日期", "薪资", "奖金比例", "上级");
        System.out.println();
        System.out.println(sep);

        for (Department dept : departments) {
            boolean firstRow = true;
            for (Employee emp : dept.getEmployees()) {
                String deptName = firstRow ? dept.getName() : "";
                firstRow = false;

                System.out.printf(fmt,
                        deptName,
                        emp.getName() != null ? emp.getName() : "",
                        emp.getAge() != null ? emp.getAge() : "",
                        emp.getBirthDate() != null ? emp.getBirthDate().toString() : "",
                        emp.getPayment() != null ? String.format("%.0f", emp.getPayment()) : "",
                        emp.getBonus() != null ? String.format("%.0f%%", emp.getBonus() * 100) : "",
                        emp.getSuperior() != null ? emp.getSuperior() : ""
                );
                System.out.println();
            }

            // 合计行
            if (dept.getTotalPayment() != null) {
                System.out.printf(fmt, "", "支付合计:", "", "",
                        String.format("%.0f", dept.getTotalPayment()), "", "");
                System.out.println();
            }
            System.out.println(sep);
        }
    }

    // ============================================================
    //  辅助: 单元格取值
    // ============================================================

    private static String getCellValueAsString(Cell cell) {
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getLocalDateTimeCellValue().toLocalDate().toString();
                }
                double val = cell.getNumericCellValue();
                if (val == Math.floor(val) && !Double.isInfinite(val)) {
                    return String.valueOf((long) val);
                }
                return String.valueOf(val);
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                try {
                    return String.valueOf(cell.getNumericCellValue());
                } catch (Exception e) {
                    try {
                        return cell.getStringCellValue();
                    } catch (Exception e2) {
                        return cell.getCellFormula();
                    }
                }
            default:
                return "";
        }
    }

    private static String readStringCell(Cell cell) {
        if (cell == null) return null;
        try {
            switch (cell.getCellType()) {
                case STRING: {
                    String val = cell.getStringCellValue();
                    return val.isEmpty() ? null : val.trim();
                }
                case NUMERIC:
                    return String.valueOf((long) cell.getNumericCellValue());
                default:
                    return null;
            }
        } catch (Exception e) {
            return null;
        }
    }

    private static Double readDoubleCell(Cell cell) {
        if (cell == null) return null;
        try {
            if (cell.getCellType() == CellType.NUMERIC) {
                return cell.getNumericCellValue();
            } else if (cell.getCellType() == CellType.STRING) {
                String val = cell.getStringCellValue().trim();
                if (val.matches("-?\\d+(\\.\\d+)?")) {
                    return Double.parseDouble(val);
                }
            }
        } catch (Exception e) {
            return null;
        }
        return null;
    }
}
