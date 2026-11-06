# 通用脚本调用

对应方法 `callMaxScript`，用于调用任意 Maximo 自动化脚本。

## 请求

- 方法：有请求体时为 `POST`，否则为 `GET`
- 地址：`/maximo/api/script/<scriptName>`

## URL 参数

| 参数 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `_langcode` | string | 环境 langcode | 语言代码 |
| `*` | any | - | 其余参数按脚本要求自由传入 |

## 返回

返回接口原始响应（字符串或 JSON）。

## CLI

```bash
sks-maximo call <scriptName> --file body.json --params "{\"a\":1}" -e hd
```
