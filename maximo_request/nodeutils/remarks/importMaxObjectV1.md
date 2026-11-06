# 对象配置导入（旧版接口）

对应方法 `importMaxObjectV1`，调用 Maximo 自动化脚本 `SKS.AUTOSCRIPT.LIBRARY`。

## 请求

- 方法：`POST`
- 地址：`/maximo/api/script/SKS.AUTOSCRIPT.LIBRARY?develop=true&_langcode=zh`
- 请求体：对象定义 JSON（`{ "maxObjects": [ ... ] }` 或数组）

## URL 参数

| 参数 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `develop` | boolean | `true` | 开发模式标记 |
| `_langcode` | string | 环境 langcode | 语言代码 |

## 返回

成功返回 `true`，失败返回 `false`；失败原因需查看控制台日志或 `~/.sks/nodeutils/logs` 下的请求日志。

## 备注

- 该接口不返回逐条统计，批量导入只能得到文件级成功/失败。
- 新环境建议使用 `import-object`（新接口），可获得逐条结果。
