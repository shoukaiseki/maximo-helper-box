# maximo-excel-jxls-tohtml

JXLS 模板 → HTML 的独立命令行工具。以同目录下 `maximo-server-jxls`（v1.0.0）的工程骨架与依赖版本为基准编写，HTML 转换核心逻辑移植自参考实现 `autumn-wb790-core` 的 `com.autumn.common.utils.poi.ExcelExtendUtils#excelToHtml`。

## 功能

- 读取 JSON 数据文件（标准 JSON 对象，自动去除 UTF-8 BOM）
- 渲染 JXLS 模板（支持 `.xls`，表达式与网格命令见 [模板要点](#模板要点)）
- 通过自研 `HssfToHtmlConverter` 将渲染结果转换为 HTML（语义等价于参考实现的 POI `ExcelToHtmlConverter` 关键配置：去掉 Excel 列头、行号、标签页标题，保留值/合并/列宽/行高/常用样式）
- 内置模板工具 bean：`dateUtils` / `numUtils` / `autUtils` / `strUtils` / `utils`

## 与基准/参考的关系

| 本工程 | 来源 |
| --- | --- |
| `pom.xml`（Solon 2.9.4、POI 5.2.5、JXLS 2.14.0、Jackson 2.16.0） | 与 `maximo-server-jxls` 保持一致 |
| `ExcelToHtmlApp`（CLI 参数解析、Solon 启动、退出码） | 基于 `ExcelExporterApp` 改编 |
| `ExcelToHtmlService#exportFromJsonWithTemplate` | 基于 `ExcelExportService` 改编 |
| `ExcelToHtmlService#processExcelTemplate` | 移植自 `ExcelExtendUtils#processExcelTemplate` |
| `ExcelToHtmlService#excelToHtml` / `workbookToHtml` / `readExcel` | 移植自 `ExcelExtendUtils` 对应方法 |
| `jxls` 包下 5 个工具 bean | 移植自 `com.autumn.common.utils.poi.jxls`，去除 autumn/shoukaiseki/hutool 业务依赖 |

与原实现的差异：
1. 参考实现通过 jxls 1.x 的 `XLSTransformer` 对渲染结果二次解析取得 `HSSFWorkbook`。由于模板已由 `JxlsHelper`（jxls 2.x）完成全部表达式求值，本工程等价地直接解析渲染字节流，避免引入 jxls 1.x 依赖。
2. 参考实现使用 POI 内置 `org.apache.poi.hssf.converter.ExcelToHtmlConverter` 完成 HTML 转换；POI 5.0 起移除了该包（仅存在于 ≤4.1.2），而基准版本锁定 POI 5.2.5，故本工程自研 `HssfToHtmlConverter` 实现等价语义（不含列头/行号/标签页标题，保留值、合并、列宽、行高与常用样式，字符集可配）。

## 构建

```bash
mvn -DskipTests package
# 产物: target/maximo-excel-jxls-tohtml-1.0.0.jar (shaded, 可直接 java -jar)
```

## 运行

```bash
java -jar target/maximo-excel-jxls-tohtml-1.0.0.jar --input=<json-file> --template=<template.xls> [options]

必选:
  --input=<file>    JSON 数据文件路径 (标准 JSON 对象)
  --template=<file> JXLS 模板文件路径 (.xls, HTML 转换仅支持 HSSF 格式)

可选:
  --output=<file>   输出 HTML 文件路径 (默认: 输入文件名.html)
  --create-demo-template=<file>  生成 demo 用的 JXLS 模板文件 (.xls) 后退出

配置 (application.yml 或系统属性):
  app.logDir                  日志输出目录 (默认 ./logs)
  app.excelToHtmlCharsetName  HTML 输出字符集 (默认 UTF-8; Windows 下可设 "GBK")
```

## Demo

```bash
# 1) 生成 demo 模板（也可以使用自己的 .xls 模板）
java -jar target/maximo-excel-jxls-tohtml-1.0.0.jar --create-demo-template=test_template.xls

# 2) 转换
java -jar target/maximo-excel-jxls-tohtml-1.0.0.jar --input=test_input.json --template=test_template.xls --output=output/demo.html
```

Windows 下可以直接运行 `run_tohtml.bat`（或 Linux/macOS 下运行 `run_tohtml.sh`），脚本会自动生成模板并转换到 `output/demo.html`。

## 模板要点

- 普通表达式写单元格文本中：`${title}`、`${row[0]}`
- jxls 2.x 的命令写在**单元格批注**中（参考实现模板同样的约定），不在文本里。建议在批注中先用 `jx:area(lastCell="…")` 圈定整个模板区域，使区域内的标题/时间/合计等普通表达式也被求值；数据区首格批注写 `jx:each(items="data" var="row" lastCell="G4")` 展开数据行，区域内其他格写 `${row[n]}` 等表达式
- 工具 bean 调用：`${dateUtils.format('yyyy-MM-dd HH:mm:ss', dateUtils.getNowDate())}`、`${utils.lineNum(data, row)}`、`${numUtils.sumListProp(list, 'amount')}`、`${strUtils.valEmptyNullStr(name, '(', ')')}`
- 模板中的中文单元格样式、合并单元格、列宽等会随 HTML 一并转换保留

## 已知限制

- `HssfToHtmlConverter` 仅支持 HSSF（`.xls`），因此 HTML 转换要求模板为 `.xls`；传 `.xlsx` 模板会给出明确报错提示，如需转换请先另存为 `.xls`（与参考实现行为一致）
- JSON 数据按层级结构原样传入模板 Context，不做额外类型转换（与基线 `maximo-server-jxls` 行为一致）