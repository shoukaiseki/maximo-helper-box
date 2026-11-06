# 应用 XML 导入

对应方法 `importMaxPresentation`，调用 Maximo 自动化脚本 `SKS.AUTOSCRIPT.SCREENS`。

## 请求

- 方法：`POST`
- 地址：`/maximo/api/script/SKS.AUTOSCRIPT.SCREENS?_langcode=zh`
- 请求头：`Content-Type: application/xml`
- 请求体：应用定义 XML

## URL 参数

| 参数 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `_langcode` | string | 环境 langcode | 语言代码 |

## 返回

成功返回 `true`，失败返回 `false`。

## 备注

- XML 必须由导出功能生成，手工修改易导致解析失败。
- 应用信息（maxapps）导入请使用 `import-appinfo`。
