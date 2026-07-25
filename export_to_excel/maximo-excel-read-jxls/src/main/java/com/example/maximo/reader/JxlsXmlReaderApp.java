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
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilderFactory;
import java.io.FileInputStream;
import java.io.InputStream;
import java.lang.reflect.Method;
import java.util.*;

/**
 * JXLS XML 映射读取器
 * <p>
 * 解析 jxls-reader-mapping.xml 配置文件, 按照映射规则自动读取 departmentdata.xls,
 * 将单元格数据填充到 Department → Chief / Employee 的 JavaBean 层级结构中.
 * <p>
 * 映射 XML 格式说明:
 * <pre>{@code
 *   <section startRow="0" endRow="2">           ← 静态区域
 *     <mapping cell="B1">department.name</mapping>  ← B1→department.name
 *   </section>
 *   <loop startRow="7" endRow="7" ...>             ← 循环区域
 *     <mapping row="7" col="0">employee.name</mapping>
 *     <loopbreakcondition>...</loopbreakcondition>
 *   </loop>
 * }</pre>
 */
public class JxlsXmlReaderApp {

    private static final Logger log = LoggerFactory.getLogger(JxlsXmlReaderApp.class);
    private static final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
            .enable(SerializationFeature.INDENT_OUTPUT);

    // ====================================================================
    //  XML 映射内部模型
    // ====================================================================

    /** 单元格映射: 从 Excel 某个单元格 → JavaBean 某个属性 */
    static class CellMapping {
        int row;           // 行索引 (0-based)
        int col;           // 列索引 (0-based)
        String property;   // 属性路径, 如 "department.chief.name"
    }

    /** 静态区域: 一组固定的单元格映射 */
    static class Section {
        int startRow;
        int endRow;
        List<CellMapping> mappings = new ArrayList<>();
    }

    /** 循环中断条件 */
    static class BreakCondition {
        int rowOffset;     // 从当前行偏移
        int cellOffset;    // 从当前列偏移
        String cellValue;  // 匹配的单元格文本
    }

    /** 循环区域: 重复读取多行, 每行生成一个对象 */
    static class Loop {
        int startRow;
        int endRow;
        String items;         // 目标集合属性路径, 如 "department.staff"
        String var;           // 变量名, 如 "employee"
        String varType;       // 变量全限定类名
        List<CellMapping> mappings = new ArrayList<>();
        BreakCondition breakCondition;
    }

    /** 完整映射配置 */
    static class MappingConfig {
        List<Section> sections = new ArrayList<>();
        List<Loop> loops = new ArrayList<>();
    }

    // ====================================================================
    //  主入口
    // ====================================================================

    public static void main(String[] args) throws Exception {
        String excelPath = "departmentdata.xls";
        String xmlPath = "src/main/resources/jxls-reader-mapping.xml";
        if (args.length >= 2) {
            excelPath = args[0];
            xmlPath = args[1];
        }

        log.info("========== JXLS XML Reader ==========");
        log.info("Excel文件: {}", excelPath);
        log.info("映射文件: {}", xmlPath);

        // 1. 解析 XML 映射
        MappingConfig config = parseXmlMapping(xmlPath);

        // 2. 读取 Excel
        Map<String, Object> context = readWithXmlMapping(excelPath, config);

        // 3. 提取结果
        Department dept = (Department) context.get("department");
        log.info("共解析到 {} 个员工", dept != null && dept.getStaff() != null ? dept.getStaff().size() : 0);

        System.out.println("\n========== 部门层级数据 (JSON) ==========");
        System.out.println(objectMapper.writeValueAsString(dept));

        // 4. 表格输出
        printTable(dept);
        log.info("========== 读取完成 ==========");
    }

    // ====================================================================
    //  1) 解析 XML 映射 (DOM)
    // ====================================================================

    private static MappingConfig parseXmlMapping(String xmlPath) throws Exception {
        Document doc = DocumentBuilderFactory.newInstance()
                .newDocumentBuilder()
                .parse(xmlPath);

        MappingConfig config = new MappingConfig();
        Element worksheet = (Element) doc.getDocumentElement()
                .getElementsByTagName("worksheet").item(0);

        // --- 解析 Section ---
        NodeList sectionNodes = worksheet.getElementsByTagName("section");
        for (int i = 0; i < sectionNodes.getLength(); i++) {
            Element secEl = (Element) sectionNodes.item(i);
            // 跳过 loop 内部的 section (由 loop 逻辑处理)
            if (secEl.getParentNode().getNodeName().equals("loop")) continue;

            Section section = new Section();
            section.startRow = Integer.parseInt(secEl.getAttribute("startRow"));
            section.endRow = secEl.hasAttribute("endRow")
                    ? Integer.parseInt(secEl.getAttribute("endRow"))
                    : section.startRow;
            parseMappings(secEl, section.mappings);
            config.sections.add(section);
        }

        // --- 解析 Loop ---
        NodeList loopNodes = worksheet.getElementsByTagName("loop");
        for (int i = 0; i < loopNodes.getLength(); i++) {
            Element loopEl = (Element) loopNodes.item(i);

            Loop loop = new Loop();
            loop.startRow = Integer.parseInt(loopEl.getAttribute("startRow"));
            loop.endRow = loopEl.hasAttribute("endRow")
                    ? Integer.parseInt(loopEl.getAttribute("endRow"))
                    : loop.startRow;
            loop.items = loopEl.getAttribute("items");
            loop.var = loopEl.getAttribute("var");
            loop.varType = loopEl.getAttribute("varType");

            // 解析 loop 内部的 section 映射
            Element loopSection = (Element) loopEl.getElementsByTagName("section").item(0);
            if (loopSection != null) {
                parseMappings(loopSection, loop.mappings);
            }

            // 解析中断条件
            Element breakEl = (Element) loopEl.getElementsByTagName("loopbreakcondition").item(0);
            if (breakEl != null) {
                loop.breakCondition = new BreakCondition();
                Element rowCheck = (Element) breakEl.getElementsByTagName("rowcheck").item(0);
                if (rowCheck != null) {
                    loop.breakCondition.rowOffset = rowCheck.hasAttribute("offset")
                            ? Integer.parseInt(rowCheck.getAttribute("offset")) : 0;
                    Element cellCheck = (Element) rowCheck.getElementsByTagName("cellcheck").item(0);
                    if (cellCheck != null) {
                        loop.breakCondition.cellOffset = cellCheck.hasAttribute("offset")
                                ? Integer.parseInt(cellCheck.getAttribute("offset")) : 0;
                        loop.breakCondition.cellValue = cellCheck.getTextContent();
                    }
                }
            }

            config.loops.add(loop);
        }

        log.info("解析映射: {} 个静态区, {} 个循环区", config.sections.size(), config.loops.size());
        return config;
    }

    /** 从 XML 元素中解析 <mapping> 子节点 */
    private static void parseMappings(Element parent, List<CellMapping> target) {
        NodeList mappingNodes = parent.getElementsByTagName("mapping");
        for (int j = 0; j < mappingNodes.getLength(); j++) {
            Element mapEl = (Element) mappingNodes.item(j);
            CellMapping cm = new CellMapping();

            // 支持 cell="B1" 格式
            String cellAttr = mapEl.getAttribute("cell");
            if (cellAttr != null && !cellAttr.isEmpty()) {
                cm.row = parseCellRow(cellAttr);   // B1 → row=0
                cm.col = parseCellCol(cellAttr);   // B1 → col=1
            }

            // 支持 row="3" col="4" 格式 (覆盖 cell 属性)
            String rowAttr = mapEl.getAttribute("row");
            if (rowAttr != null && !rowAttr.isEmpty()) {
                cm.row = Integer.parseInt(rowAttr);
            }
            String colAttr = mapEl.getAttribute("col");
            if (colAttr != null && !colAttr.isEmpty()) {
                cm.col = Integer.parseInt(colAttr);
            }

            cm.property = mapEl.getTextContent().trim();
            target.add(cm);

            log.debug("  映射: cell=(row={}, col={}) → {}", cm.row, cm.col, cm.property);
        }
    }

    /** 解析 "B1" 中的行号 (1-indexed → 0-indexed) */
    private static int parseCellRow(String cell) {
        String numPart = cell.replaceAll("[A-Za-z]", "");
        return Integer.parseInt(numPart) - 1;  // Excel 行从 1 开始 → 0-indexed
    }

    /** 解析 "B1" 中的列字母 (A=0, B=1, …) */
    private static int parseCellCol(String cell) {
        String letterPart = cell.replaceAll("[0-9]", "").toUpperCase();
        int col = 0;
        for (int i = 0; i < letterPart.length(); i++) {
            col = col * 26 + (letterPart.charAt(i) - 'A' + 1);
        }
        return col - 1;  // 1-indexed → 0-indexed
    }

    // ====================================================================
    //  2) 按 XML 映射读取 Excel
    // ====================================================================

    private static Map<String, Object> readWithXmlMapping(String excelPath, MappingConfig config) throws Exception {
        // 上下文: 存放根对象
        Map<String, Object> context = new HashMap<>();
        // 预创建 Department (所有映射都基于 department.xxx)
        Department dept = new Department();
        context.put("department", dept);

        try (InputStream is = new FileInputStream(excelPath);
             Workbook workbook = new HSSFWorkbook(is)) {

            Sheet sheet = workbook.getSheetAt(0);
            log.info("工作表: '{}' (共 {} 行)", sheet.getSheetName(), sheet.getLastRowNum() + 1);

            // --- 处理静态 Section ---
            for (Section section : config.sections) {
                for (CellMapping mapping : section.mappings) {
                    Object value = readCellValue(sheet, mapping.row, mapping.col);
                    if (value != null) {
                        setProperty(context, mapping.property, value);
                        log.debug("  [静态] 行{}列{} = {} → {}", mapping.row, mapping.col, value, mapping.property);
                    }
                }
            }

            // --- 处理 Loop ---
            for (Loop loop : config.loops) {
                int row = loop.startRow;
                while (row <= sheet.getLastRowNum()) {
                    // 检查中断条件
                    if (loop.breakCondition != null) {
                        int breakRow = row + loop.breakCondition.rowOffset;
                        int breakCol = loop.breakCondition.cellOffset;
                        String breakVal = readStringCell(sheet, breakRow, breakCol);
                        if (loop.breakCondition.cellValue.equals(breakVal)) {
                            log.debug("  [循环] 行{}: 命中中断条件 '{}'", row, breakVal);
                            break;
                        }
                    }

                    // 跳过空行
                    if (isRowEmpty(sheet, row, loop.mappings)) {
                        row++;
                        continue;
                    }

                    // 创建变量实例
                    Object instance = createInstance(loop.varType);

                    // 应用当前行的映射
                    for (CellMapping mapping : loop.mappings) {
                        // 当前行 = loop.startRow 是模板行, 实际数据从该行开始
                        Object value = readCellValue(sheet, row, mapping.col);
                        if (value != null) {
                            // 替换属性路径中的变量名
                            String propPath = mapping.property.replace(loop.var + ".", "");
                            setPropertyOnObject(instance, propPath, value);
                            log.debug("  [循环] 行{}: {} = {}", row, propPath, value);
                        }
                    }

                    // 添加到集合
                    addToCollection(context, loop.items, instance);

                    row++;
                }
            }
        }

        return context;
    }

    // ====================================================================
    //  3) Bean 属性操作 (反射)
    // ====================================================================

    /**
     * 按属性路径设值, 支持嵌套: "department.chief.name"
     * 前 n-1 段是导航路径, 最后一段是设值目标
     */
    private static void setProperty(Map<String, Object> context, String propertyPath, Object value) throws Exception {
        String[] parts = propertyPath.split("\\.");
        if (parts.length == 0) return;

        if (parts.length == 1) {
            // 直接上下文键
            context.put(parts[0], value);
            return;
        }

        // 沿路径导航, 找到最终对象
        Object target = context.get(parts[0]);
        for (int i = 1; i < parts.length - 1; i++) {
            target = getPropertyValue(target, parts[i]);
        }
        // 设置最终属性
        String finalProp = parts[parts.length - 1];
        setPropertyOnObject(target, finalProp, value);
    }

    /** 在单个对象上设值 */
    private static void setPropertyOnObject(Object obj, String property, Object value) throws Exception {
        if (obj == null) return;
        String setterName = "set" + Character.toUpperCase(property.charAt(0)) + property.substring(1);

        Method[] methods = obj.getClass().getMethods();
        for (Method m : methods) {
            if (m.getName().equals(setterName) && m.getParameterCount() == 1) {
                Class<?> paramType = m.getParameterTypes()[0];
                Object converted = convertValue(value, paramType);
                m.invoke(obj, converted);
                return;
            }
        }
        log.warn("未找到 setter: {}.{}", obj.getClass().getSimpleName(), setterName);
    }

    /** 获取对象的属性值 (用于导航), 自动创建中间对象 */
    private static Object getPropertyValue(Object obj, String property) throws Exception {
        if (obj == null) return null;
        String getterName = "get" + Character.toUpperCase(property.charAt(0)) + property.substring(1);

        Method[] methods = obj.getClass().getMethods();
        for (Method m : methods) {
            if (m.getName().equals(getterName) && m.getParameterCount() == 0) {
                Object val = m.invoke(obj);
                if (val == null) {
                    // 自动创建中间对象 (如 department.chief → Chief)
                    val = tryAutoCreate(m.getReturnType());
                    if (val != null) {
                        String setterName = "set" + Character.toUpperCase(property.charAt(0)) + property.substring(1);
                        for (Method sm : methods) {
                            if (sm.getName().equals(setterName) && sm.getParameterCount() == 1) {
                                sm.invoke(obj, val);
                                break;
                            }
                        }
                    }
                }
                return val;
            }
        }
        return null;
    }

    /** 尝试用无参构造器创建对象 (仅对非基础类型) */
    private static Object tryAutoCreate(Class<?> type) throws Exception {
        if (type.isPrimitive() || type == String.class
                || type == Boolean.class || type == Integer.class
                || type == Long.class || type == Double.class
                || type == Float.class || type == Short.class
                || type == Byte.class || type == Character.class
                || Number.class.isAssignableFrom(type)) {
            return null;
        }
        try {
            return type.getDeclaredConstructor().newInstance();
        } catch (Exception e) {
            return null;
        }
    }

    /** 将值添加到路径指定的集合中 */
    private static void addToCollection(Map<String, Object> context, String itemsPath, Object item) throws Exception {
        String[] parts = itemsPath.split("\\.");
        Object target = context.get(parts[0]);
        for (int i = 1; i < parts.length; i++) {
            target = getPropertyValue(target, parts[i]);
        }
        if (target instanceof List) {
            @SuppressWarnings("unchecked")
            List<Object> list = (List<Object>) target;
            list.add(item);
        }
    }

    /** 类型转换: String/Number → 目标类型 */
    private static Object convertValue(Object value, Class<?> targetType) {
        if (value == null) return null;
        if (targetType.isAssignableFrom(value.getClass())) return value;

        String str = value.toString();

        // String → Integer
        if (targetType == Integer.class || targetType == int.class) {
            try {
                return Integer.parseInt(str);
            } catch (NumberFormatException e) {
                return (int) Double.parseDouble(str);
            }
        }
        // String → Double
        if (targetType == Double.class || targetType == double.class) {
            return Double.parseDouble(str);
        }
        // String → Long
        if (targetType == Long.class || targetType == long.class) {
            return Long.parseLong(str);
        }
        // String → Boolean
        if (targetType == Boolean.class || targetType == boolean.class) {
            return Boolean.parseBoolean(str);
        }
        return str;
    }

    /** 反射创建实例 */
    private static Object createInstance(String className) throws Exception {
        return Class.forName(className).getDeclaredConstructor().newInstance();
    }

    // ====================================================================
    //  4) Excel 单元格读取
    // ====================================================================

    private static Object readCellValue(Sheet sheet, int row, int col) {
        Row r = sheet.getRow(row);
        if (r == null) return null;
        Cell cell = r.getCell(col);
        if (cell == null) return null;

        switch (cell.getCellType()) {
            case STRING: {
                String val = cell.getStringCellValue();
                return val.isEmpty() ? null : val.trim();
            }
            case NUMERIC: {
                double val = cell.getNumericCellValue();
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getLocalDateTimeCellValue().toLocalDate();
                }
                if (val == Math.floor(val) && !Double.isInfinite(val)) {
                    return (int) val;
                }
                return val;
            }
            case BOOLEAN:
                return cell.getBooleanCellValue();
            case FORMULA:
                try {
                    return cell.getNumericCellValue();
                } catch (Exception e) {
                    try {
                        return cell.getStringCellValue();
                    } catch (Exception e2) {
                        return cell.getCellFormula();
                    }
                }
            default:
                return null;
        }
    }

    private static String readStringCell(Sheet sheet, int row, int col) {
        Object val = readCellValue(sheet, row, col);
        return val != null ? val.toString() : null;
    }

    private static boolean isRowEmpty(Sheet sheet, int row, List<CellMapping> mappings) {
        for (CellMapping m : mappings) {
            Object val = readCellValue(sheet, row, m.col);
            if (val != null) return false;
        }
        return true;
    }

    // ====================================================================
    //  5) 表格打印
    // ====================================================================

    private static void printTable(Department dept) {
        if (dept == null || dept.getStaff() == null || dept.getStaff().isEmpty()) {
            System.out.println("(无数据)");
            return;
        }

        String sep = "+----------------------+----------------------+------+------------+----------+-----------+";
        String fmt = "| %-20s | %-20s | %-4s | %-10s | %-8s | %-9s |";

        System.out.println();
        System.out.println(sep);
        System.out.printf(fmt, "部门", "员工姓名", "年龄", "出生日期", "薪资", "奖金比例");
        System.out.println();
        System.out.println(sep);

        Chief chief = dept.getChief();
        if (chief != null) {
            System.out.printf(fmt, dept.getName() + " (负责人)", chief.getName(),
                    chief.getAge() != null ? chief.getAge() : "",
                    "",
                    chief.getPayment() != null ? String.format("%.0f", chief.getPayment()) : "",
                    chief.getBonus() != null ? String.format("%.0f%%", chief.getBonus() * 100) : "");
            System.out.println();
        }

        for (Employee emp : dept.getStaff()) {
            System.out.printf(fmt,
                    emp == dept.getStaff().get(0) && chief == null ? dept.getName() : "",
                    emp.getName() != null ? emp.getName() : "",
                    emp.getAge() != null ? emp.getAge() : "",
                    emp.getBirthDate() != null ? emp.getBirthDate().toString() : "",
                    emp.getPayment() != null ? String.format("%.0f", emp.getPayment()) : "",
                    emp.getBonus() != null ? String.format("%.0f%%", emp.getBonus() * 100) : ""
            );
            System.out.println();
        }

        if (dept.getTotalPayment() != null) {
            System.out.printf(fmt, "", "支付合计:", "", "",
                    String.format("%.0f", dept.getTotalPayment()), "");
            System.out.println();
        }
        System.out.println(sep);
    }
}
