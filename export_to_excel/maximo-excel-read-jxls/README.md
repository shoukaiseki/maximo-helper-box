# JXLS Excel Reader

使用 **JXLS 2.14.0 + Apache POI 5.2.5** 读取 Excel 文件的示例项目。

包含两种读取方式:

1. **`JxlsReaderApp`** — 直接使用 POI API 读取，手写解析逻辑
2. **`JxlsXmlReaderApp`** — 通过 XML 映射文件配置解析规则，自动映射到 JavaBean

## 目录结构

```
maximo-excel-read-jxls/
├── pom.xml                                    # Maven 项目配置
├── departmentdata.xls                         # JXLS 官方示例 Excel 文件
├── run_read_jxls.bat                          # 一键编译 + 运行 (方式1)
├── src/main/
│   ├── java/com/example/maximo/reader/
│   │   ├── JxlsReaderApp.java                 # POI 直接读取
│   │   ├── JxlsXmlReaderApp.java              # XML 映射读取
│   │   └── model/
│   │       ├── Department.java                # 部门实体 (name, chief, staff)
│   │       ├── Chief.java                     # 负责人实体 (name, age, payment, bonus)
│   │       └── Employee.java                  # 员工实体 (name, age, payment, bonus)
│   └── resources/
│       ├── jxls-reader-mapping.xml            # XML 映射配置文件
│       └── logback.xml                        # 日志配置
```

## 技术栈

| 组件 | 版本 |
|------|------|
| Java | 1.8+ / 8+ |
| JXLS | 2.14.0 |
| JXLS-POI | 2.14.0 |
| Apache POI | 5.2.5 |
| Jackson | 2.16.0 (含 jsr310 模块) |
| Lombok | 1.18.30 |
| Logback | 1.2.13 |

## departmentdata.xls 结构

官方 JXLS 示例文件，包含 IT 部门的员工数据:

| 行 | 内容 |
|----|------|
| 0 | JXLS 模板标记 `Department` / `IT` |
| 1 | `Chief` 标签 |
| 2 | 列头: `Name`, `Age`, `Birth date`, `Payment`, `Bonus`, `Total` |
| 3 | 首席员工: `Maxim`, `30`, `1976-12-20`, `3000`, `0.25` |
| 5 | `Employees` 标签 |
| 6 | 列头 (含 `Superior Name`) |
| 7-10 | 员工数据: Oleg, Yuri, Leonid, Alex |
| 11 | 小计 `Employee Payment Totals:` |
| 13 | 总计 `Total payment:` / `10100` |

## 方式1: POI 直接读取

**`JxlsReaderApp`** 使用 Apache POI API 直接遍历工作表，通过列索引逐个读取：
- 智能识别部门行、员工表头行、数据行、合计行
- 支持日期序列号自动转换 (`LocalDate`)
- 输出 JSON + 格式化表格

```bash
# 编译运行
run_read_jxls.bat

# 或手动执行
mvn clean package -q -DskipTests
java -jar target/maximo-excel-read-jxls-1.0.0.jar [excel文件路径]
```

## 方式2: XML 映射读取

**`JxlsXmlReaderApp`** 通过 `jxls-reader-mapping.xml` 配置映射规则：

```xml
<!-- 静态映射: 固定单元格 → 属性路径 -->
<section startRow="0" endRow="2">
    <mapping cell="B1">department.name</mapping>
</section>

<!-- 循环映射: 逐行读取, 遇到中断条件停止 -->
<loop startRow="7" endRow="7" items="department.staff" var="employee"
      varType="com.example.maximo.reader.model.Employee">
    <section startRow="7" endRow="7">
        <mapping row="7" col="0">employee.name</mapping>
        <mapping row="7" col="1">employee.age</mapping>
        <mapping row="7" col="3">employee.payment</mapping>
        <mapping row="7" col="4">employee.bonus</mapping>
    </section>
    <loopbreakcondition>
        <rowcheck offset="0">
            <cellcheck offset="0">Employee Payment Totals:</cellcheck>
        </rowcheck>
    </loopbreakcondition>
</loop>
```

**核心特性:**
- 反射自动导航属性路径 (`department.chief.name`)，中间对象自动创建
- 支持 `<section>` 静态区域 和 `<loop>` 循环区域
- 支持 `<loopbreakcondition>` 循环中断条件
- 值类型自动转换 (String → Integer / Double / Boolean)

```bash
mvn clean package -q -DskipTests
java -cp target/maximo-excel-read-jxls-1.0.0.jar \
    com.example.maximo.reader.JxlsXmlReaderApp \
    [excel文件路径] [xml映射文件路径]
```

## 输出示例

### JSON 输出
```json
{
  "name" : "IT",
  "chief" : {
    "name" : "Maxim",
    "age" : 30,
    "payment" : 3000.0,
    "bonus" : 0.25
  },
  "staff" : [
    { "name" : "Oleg",  "age" : 32, "payment" : 2000.0, "bonus" : 0.2 },
    { "name" : "Yuri",  "age" : 29, "payment" : 1800.0, "bonus" : 0.15 },
    { "name" : "Leonid","age" : 30, "payment" : 1700.0, "bonus" : 0.2 },
    { "name" : "Alex",  "age" : 28, "payment" : 1600.0, "bonus" : 0.2 }
  ]
}
```

### 表格输出
```
+----------------------+----------------------+------+------------+----------+-----------+
| 部门                   | 员工姓名              | 年龄   | 出生日期       | 薪资      | 奖金比例    |
+----------------------+----------------------+------+------------+----------+-----------+
| IT (负责人)           | Maxim                | 30   | 1976-12-20 | 3000     | 25%       |
|                      | Oleg                 | 32   | 1974-01-02 | 2000     | 20%       |
|                      | Yuri                 | 29   | 1977-09-26 | 1800     | 15%       |
|                      | Leonid               | 30   | 1976-02-12 | 1700     | 20%       |
|                      | Alex                 | 28   | 1978-08-18 | 1600     | 20%       |
|                      | 支付合计:             |      |            | 10100    |           |
+----------------------+----------------------+------+------------+----------+-----------+
```

## 依赖版本参考

本项目依赖版本参考自 `export_to_excel/maximo-server-jxls/pom.xml`。
