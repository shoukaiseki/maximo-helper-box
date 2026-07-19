# excel2html

将 `.xlsx` 文件转换为 HTML 的 CLI 工具。基于 **Solon CMD** 框架 + **Apache POI 5.2.5**。

## 用法

```bash
java -jar excel2html-1.0.0.jar --input=<file.xlsx> [--output=<file.html>] [--no-sheet-name]
```

### 参数

| 参数 | 说明 | 必填 |
|------|------|------|
| `--input` | 源 Excel 文件路径 (.xlsx) | 是 |
| `--output` | 输出 HTML 文件路径 | 否，默认取输入文件名.html |
| `--no-sheet-name` | 不显示 sheet 名称 | 否，默认显示 |

### 示例

```bash
# 基本转换
java -jar excel2html-1.0.0.jar --input=report.xlsx

# 指定输出路径
java -jar excel2html-1.0.0.jar --input=report.xlsx --output=out/report.html

# 不显示 sheet 名称
java -jar excel2html-1.0.0.jar --input=report.xlsx --no-sheet-name
```

## 构建

```bash
mvn clean package -DskipTests
```

构建产物：`target/excel2html-1.0.0.jar`（fat jar，含所有依赖）。

## 技术栈

- **Solon 2.9.4** — CMD 框架，参数解析
- **Apache POI 5.2.5** — Excel 读写
- **Logback** — 日志
