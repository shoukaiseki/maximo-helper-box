# Maximo Excel Exporter

从Maximo数据库导出表结构信息到Excel的工具。

## 功能特性

- **多语言支持**：
  - 智能处理多语言字段（l_开头的多语言表）
  - 当原字段为null或主要为英文时，自动使用中文多语言值
  
- **Sheet1 - 表结构信息**：
  - 表名、字段信息、关联关系、索引信息
  - 多个表之间有空行分隔
  
- **Sheet2 - 域信息**：
  - 域定义和详细信息（NUMERIC/ALN/SYNONYM类型）

## 项目结构

```
export_to_excel/
├── pom.xml                                    # Maven配置
├── README.md                                   # 本文件
├── maximo导出表结构信息excel.md                # 需求文档
├── src/main/java/com/example/maximo/exporter/
│   ├── ExcelExporterApp.java                  # 主应用入口
│   ├── dao/
│   │   └── DatabaseDao.java                   # 数据库访问层
│   ├── entity/                                # 数据实体类
│   └── service/
│       ├── DataService.java                   # 数据服务
│       └── ExcelExportService.java            # Excel导出服务
└── src/main/resources/
    └── application.properties                 # 配置文件
```

## 配置说明

编辑 `src/main/resources/application.properties`：

```properties
# DB2数据库连接
db.url=jdbc:db2://localhost:50000/MAXIMO:currentSchema=MAXIMO;
db.username=db2inst1
db.password=Maximo123
db.driver=com.ibm.db2.jcc.DB2Driver

# 导出配置
export.output.path=./output/maximo_tables.xlsx
export.object.filter=IBM%
export.object.include=ITEM
```

## 运行方式

### 1. 编译打包
```bash
mvn clean package
```

### 2. 运行程序
```bash
java -jar target/maximo-excel-exporter-1.0.0.jar
```

### 3. 查看输出
导出的Excel文件将保存在配置的 `export.output.path` 路径下。

## 依赖项

- Apache POI 5.2.5 - Excel操作
- Apache Commons DBCP2 - 数据库连接池
- Lombok - 简化代码
- DB2 JDBC Driver - DB2数据库驱动

## 多语言处理逻辑

程序会智能处理多语言字段：
- 当原字段为null时，使用多语言字段值
- 当原字段中中文字符少于30%时，使用多语言字段值
- 否则保持原字段值
