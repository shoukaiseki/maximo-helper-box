# 应用信息导入（旧版接口）

对应方法 `importMaxAppInfoV1`，调用 Maximo 自动化脚本 `SKS_IMP_MAXAPPINFO`。

## 请求

- 方法：`POST`
- 地址：`/maximo/api/script/SKS_IMP_MAXAPPINFO?develop=true&_langcode=zh`
- 请求体：应用信息 JSON

## URL 参数

| 参数 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `develop` | boolean | `true` | 开发模式标记 |
| `_langcode` | string | 环境 langcode | 语言代码 |

## 返回

成功返回 `true`，失败返回 `false`，没有逐条结果。

## 备注

- 对应 CLI 命令为 `sks-maximo import-appinfo-v1`。
- 需要逐条明细时使用新接口 `importMaxAppInfo`。
