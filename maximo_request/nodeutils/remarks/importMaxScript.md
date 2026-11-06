# 自动化脚本导入

对应方法 `importMaxScript`。

## 流程

1. 读取同名 JSON 配置文件（含 `autoscript`、`description`、`scriptlanguage`）；
2. 同目录下按 `autoscript` 名称查找 `.js` / `.py` 源码；
3. 先把源码保存到本地历史目录；
4. 通过 OSLC 查询脚本是否存在：
   - 存在：`POST /maximo/api/os/MXSCRIPT/_<base64-id>`（`x-method-override: PATCH`，`application/merge-patch+json`）更新；
   - 不存在：`POST /maximo/api/os/MXAPIAUTOSCRIPT` 新建。

## URL 参数

| 参数 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `_langcode` | string | 环境 langcode | 语言代码，未传时由请求拦截器自动补充 |

## 返回

成功返回 `true`，失败返回 `false`。

## 备注

- 资源 ID 使用标准 base64（`=` 填充位替换为 `-`），不能使用无填充的 base64url，否则会 404。
- 脚本语言为 `python`/`jython` 时源码扩展名为 `.py`，其余为 `.js`。
