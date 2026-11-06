# AutoKey 导入

对应方法 `importMaxAutoKey`，调用 Maximo 自动化脚本 `SKS_DEPLOY_AUTOKEY`。

## 请求

- 方法：`POST`
- 地址：`/maximo/api/script/SKS_DEPLOY_AUTOKEY?develop=true&_langcode=zh`
- 请求体：AutoKey 定义 JSON，支持三种格式：
  - 数组：`[{ autokeyname: "...", ... }, ...]`
  - `{ autokeys: [...] }`
  - 单个对象：`{ autokeyname: "...", ... }`

## URL 参数

| 参数 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `develop` | boolean | `true` | 开发模式标记 |
| `_langcode` | string | 环境 langcode | 语言代码 |

`urlParams` 优先级最高，存在同名参数时覆盖以上默认值。

## 返回

脚本返回 JSON：

```json
{
  "status": "success",
  "message": "批量导入完成",
  "summary": { "total": 1, "success": 1, "failed": 0 },
  "result": [
    { "autokeyname": "RFQ", "status": "SUCCESS", "message": "自动键定义保存成功" }
  ]
}
```

失败时返回：

```json
{ "status": "error", "message": "错误信息" }
```

客户端方法成功返回 `true`，失败返回 `false`。

## 备注

- `autokeyname`（或 `autokeynum`）为必填字段；
- 支持 `siteid` / `orgid` / `setid` / `seed` / `defautSeed`（兼容 `defaultSeed`）/ `prefix` / `langcode` / `siteorgtype`；
- 传入 `_delete` 时执行删除逻辑，删除不存在的记录按成功处理。
