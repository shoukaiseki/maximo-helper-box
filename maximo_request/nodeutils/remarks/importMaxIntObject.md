# 对象结构导入（Integration Object）

对应方法 `importMaxIntObject`，调用 Maximo 自动化脚本 `SKS.AUTOSCRIPT.OBJECTS`。

## 请求

- 方法：`POST`
- 地址：`/maximo/api/script/SKS.AUTOSCRIPT.OBJECTS?_type=integrationobjects&_action=import&_langcode=zh`
- 请求体：对象结构定义 JSON

## URL 参数

| 参数 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `_type` | string | `integrationobjects` | 固定为 integrationobjects |
| `_action` | string | `import` | 固定为 import |
| `_langcode` | string | 环境 langcode | 语言代码 |

## 返回

成功返回 `true`，失败返回 `false`。
