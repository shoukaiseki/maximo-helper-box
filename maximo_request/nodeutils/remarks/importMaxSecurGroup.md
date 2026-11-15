# 安全组导入（新模式）

对应方法 `importMaxSecurGroup`，调用 Maximo 自动化脚本 `SKS_MIGRATEAPI_SECURGROUP`。

## 用途

把源环境导出的安全组（`MAXGROUP` 及其子表）与关联条件（`CONDITION`）导入目标环境。接口返回逐条结果与汇总统计，可按行定位失败原因。

（通用返回结构与统计口径见 `新模式通用文档.md`。）

## 请求

- 方法：`POST`
- 地址：`/maximo/api/script/SKS_MIGRATEAPI_SECURGROUP?_action=import&_langcode=ZH`
- 请求体支持导出结果原样回导：

```json
{
  "conditionList": [ { "CONDITIONNUM": "cond1", "EXPRESSION": "..." } ],
  "maxgroupList": [ { "GROUPNAME": "SKS_GROUP1", "_skschild_APPLICATIONAUTH": [ ] } ]
}
```

也兼容 `{ "groups": [...] }`、裸数组，以及单个安全组对象（含 `GROUPNAME` 时自动包成数组）。

## URL 参数

| 参数 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `_action` | string | `import` | 固定为 import，表示执行导入 |
| `_langcode` | string | 环境 langcode | 会话语言代码，脚本会转大写 |
| `dmDeploySet` | boolean | `false` | 迁移模式，MboSet 调用 `setDMDeploySet(true)` |
| `_ignoreList` | string | `conditionList` | 根节点忽略清单，逗号分隔；默认跳过关联条件 |
| `_deleteNotExists` | string | 空 | 不存在则删除的路径清单，逗号分隔，如 `maxgroupList:_skschild_APPLICATIONAUTH` |

`urlParams` 优先级最高，存在同名参数时覆盖以上默认值。

## 返回

```json
{
  "status": "success",
  "message": "导入完成 共1个安全组：新增0 更新1 删除0 失败0",
  "data": {
    "total": 1,
    "added": 0,
    "updated": 1,
    "deleted": 0,
    "failed": 0,
    "sks:successSumTotal": 12,
    "sks:failSumTotal": 0,
    "results": [
      {
        "sks:objectName": "MAXGROUP",
        "sks:ref": "SKS_GROUP1",
        "_operation": "updated",
        "_status": "success",
        "_skschild_APPLICATIONAUTH": [ ]
      }
    ],
    "conditions": { "total": 1, "added": 1, "updated": 0, "deleted": 0, "failed": 0 }
  }
}
```

分批导入时，客户端会把各批次结果合并为上面这一份（`total/added/updated/deleted/failed` 累加、`results` 拼接）。

整批失败时 `status` 为 `error`，`message` 为原因。

## 备注

- 默认 `_ignoreList=conditionList`：不导入关联条件，避免覆盖目标环境已有 `CONDITION`；需要一并导入时用 `--with-conditions`（CLI）或把 `_ignoreList` 置空；
- 分批时 `conditionList` 只在首批提交，避免重复 upsert；
- `_deleteNotExists` 是破坏性操作，路径需与导出结构一致，建议先在测试环境验证；
- 行级失败不会让整批返回 `status=error`，需查看 `data['sks:failSumTotal']` 与 `data.results` 中的 `_status` / `_message`。
