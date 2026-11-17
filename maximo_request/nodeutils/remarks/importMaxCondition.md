# 条件表达式导入（新模式）

对应方法 `importMaxCondition`，命令 `import-condition`，调用 `SKS_MIGRATEAPI_CONDITION`。

## 请求

- 方法：`POST`
- 地址：`/maximo/api/script/SKS_MIGRATEAPI_CONDITION?_action=import&_langcode=ZH`
- 请求体支持 `{conditionList:[...]}` 或裸数组（客户端自动包装）：

```json
{
  "conditionList": [
    {
      "CONDITIONNUM": "SKS_COND_1",
      "TYPE": "SQL",
      "EXPRESSION": "status = 'APPR'",
      "CLASSNAME": "",
      "DESCRIPTION": "审批中",
      "NOCACHING": false
    }
  ]
}
```

## URL 参数

| 参数 | 默认 | 说明 |
|------|------|------|
| `_action` | `import` | 固定为 import |
| `_langcode` | 环境 langcode | 会话语言代码，脚本会转大写 |
| `dmDeploySet` | `false` | 迁移模式（部署集） |
| `_errorAssert` | `false` | 任一行失败即抛异常中止；默认累加继续 |
| `_debug` | `false` | 返回 `debugMsg` 调试信息 |

`--error-assert` 等价 `_errorAssert=true`；`--params` 优先级最高。

## 返回

行级统计，与其它新模式接口一致：

```json
{
  "status": "success",
  "message": "导入完成 共2条：新增1 更新1 删除0 失败0",
  "data": {
    "total": 2, "added": 1, "updated": 1, "deleted": 0, "failed": 0,
    "sks:successSumTotal": 2, "sks:failSumTotal": 0,
    "results": [ { "sks:ref": "SKS_COND_1", "_status": "success", "_operation": "updated" } ]
  }
}
```

## 备注

- 唯一键：`CONDITIONNUM`，存在则更新、不存在则新增；
- `_delete: true` 删除该条件；
- 行级失败不改变顶层 `status`，需看 `data['sks:failSumTotal']` 与 `results[]._status`。
