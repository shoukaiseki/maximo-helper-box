# 对象配置导入（新模式）

对应方法 `importMaxObject`，调用 Maximo 自动化脚本 `SKS_MIGRATEAPI_CONFIGUR`。

## 用途

导入对象配置：`MAXOBJECT`、`MAXATTRIBUTE`、`MAXSYSINDEXES`、`MAXRELATIONSHIP`
（脚本内部按 `MAXOBJECTCFG` / `MAXATTRIBUTECFG` 处理）。导入时 `sks:` 前缀虚拟字段全部忽略，不写库。

## 请求

- 方法：`POST`
- 地址：`/maximo/api/script/SKS_MIGRATEAPI_CONFIGUR?_action=import&_langcode=ZH`
- 请求体为新模式导出 JSON（由 `SKS_MIGRATE_<对象名>.js` 的 `getDetail` 获取），支持三种格式：
  - `{ "maxObjects": [ ... ] }`
  - 裸数组 `[ ... ]`
  - 单个对象定义 `{ "object": "RFQ", ... }`

```json
{
  "maxObjects": [
    {
      "MAXOBJECT": { "OBJECTNAME": "RFQ", "TYPE": "TABLE" },
      "MAXATTRIBUTE": [ { "ATTRIBUTE": "DESCRIPTION", "MAXTYPE": 10, "LENGTH": 100 } ],
      "MAXSYSINDEXES": [ ... ],
      "MAXRELATIONSHIP": [ ... ],
      "_delete": false
    }
  ]
}
```

## URL 参数

| 参数 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `_action` | string | `import` | 接口功能分发，目前只实现 `import` |
| `_langcode` | string | 环境 langcode | 会话语言代码，脚本会转大写，如 `ZH`、`EN` |
| `dmDeploySet` | boolean | `false` | 迁移模式：MboSet 调 `setDMDeploySet(true)`，且无条件显式设置 `MAXTYPE`/`LENGTH`/`SCALE`（值为 0 也设置） |
| `ignoreAttributes` | boolean | `false` | 跳过 `MAXATTRIBUTECFG` 属性处理 |
| `ignoreRelationships` | boolean | `false` | 跳过 `MAXRELATIONSHIP` 关系处理 |
| `_debug` | boolean | `false` | 返回 `debugMsg` 调试信息 |

以上参数均可通过 `urlParams` 覆盖；`urlParams` 优先级最高。

## 返回

```json
{
  "status": "success",
  "data": {
    "total": 1, "added": 0, "updated": 1, "skipped": 0, "failed": 0,
    "results": [
      {
        "object": "RFQ",
        "sks:objectName": "MAXOBJECT",
        "sks:ref": "RFQ",
        "_apiAction": "imp",
        "_status": "success",
        "_operation": "updated",
        "_message": "关系处理失败 1 条",
        "attributes":    [ <子行>, ... ],
        "indexes":       [ <子行>, ... ],
        "relationships": [ <子行>, ... ],
        "sks:successTotal": 1, "sks:failTotal": 0, "sks:ignoreTotal": 0,
        "sks:successSumTotal": 106, "sks:failSumTotal": 1, "sks:ignoreSumTotal": 2
      }
    ],
    "sks:successSumTotal": 106,
    "sks:failSumTotal": 1,
    "sks:ignoreSumTotal": 2
  },
  "message": "导入完成 共1个对象：新增0 更新1 跳过0 失败0；总计 成功106 忽略2 失败1"
}
```

### 行级统计字段

| 字段 | 含义 |
|------|------|
| `_status` | `success` / `failed` / `skipped`（主键列、无变化、`_updateIgnored`、delete 未执行等） |
| `_operation` | `added` / `updated` / `deleted` |
| `_message` | 失败或提示原因（仅必要时返回） |
| `_apiAction` | `imp` / `add` / `export` |
| `sks:objectName` | 行所属对象名（`MAXOBJECT` / `MAXATTRIBUTE` / `MAXSYSINDEXES` / `MAXRELATIONSHIP`） |
| `sks:ref` | 业务主键值（对象名/属性名/索引名/关系名） |
| `sks:successTotal` / `sks:failTotal` / `sks:ignoreTotal` | 本行自身层级（不含嵌套子数组） |
| `sks:successSumTotal` / `sks:failSumTotal` / `sks:ignoreSumTotal` | 递归含子数组的总数 |

- 根级三个 `sks:*SumTotal` = 所有对象行 Sum 字段之和；多文件/分批导入只需累加根级字段即可。
- 对账公式：某行 `successSumTotal + failSumTotal + ignoreSumTotal` = 该行自身（1）+ 全部子级行数。

### 失败定位顺序

1. 根级 `sks:failSumTotal > 0` 判定存在失败；
2. 找 `data.results` 中 `_status="failed"` 的对象行；
3. 再看该行 `attributes` / `indexes` / `relationships` 中 `_status="failed"` 的子行；
4. 结合 `_message` 与 `sks:ref` 定位具体属性/索引/关系。

- `status` 为 `error` 时表示整批失败（如管理模式未关闭 `BMXZZ7197E`），`message` 为原因，可能带 `errorMessageTrace`。

## 备注

- 旧版接口见 `import-object`（`importMaxObjectV1`，`SKS.AUTOSCRIPT.LIBRARY`）。
- 脚本不执行任何删除：对象级 `_delete: true` 记为 `skipped`，属性/索引/关系行内 `_delete: true` 跳过该行并计数。
- 跨数据库类型迁移时开启 `dmDeploySet`，会先显式设置类型信息再处理 `sameAsObject` / `sameAsAttribute`。
