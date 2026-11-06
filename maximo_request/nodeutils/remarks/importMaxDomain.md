# 域配置导入

对应方法 `importMaxDomain`，调用 Maximo 自动化脚本 `SKS.AUTOSCRIPT.OBJECTS`。

## 请求

- 方法：`POST`
- 地址：`/maximo/api/script/SKS.AUTOSCRIPT.OBJECTS?_type=domains&_action=import&syncFlag=true&_langcode=zh`
- 请求体：域定义 JSON

## URL 参数

| 参数 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `_type` | string | `domains` | 固定为 domains |
| `_action` | string | `import` | 固定为 import |
| `syncFlag` | boolean | `true` | 是否同步处理 |
| `_langcode` | string | 环境 langcode | 语言代码 |

## 返回

成功返回 `true`，失败返回 `false`。内部会解析响应中的总计/成功数量并打印到日志。
