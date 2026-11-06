# AutoKey 导入

对应方法 `importMaxAutoKey`，调用 Maximo 自动化脚本 `SKS_DEPLOY_AUTOKEY`。

## 请求

- 方法：`POST`
- 地址：`/maximo/api/script/SKS_DEPLOY_AUTOKEY?develop=true&_langcode=zh`
- 请求体：AutoKey 定义 JSON

## URL 参数

| 参数 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `develop` | boolean | `true` | 开发模式标记 |
| `_langcode` | string | 环境 langcode | 语言代码 |

## 返回

成功返回 `true`，失败返回 `false`。
