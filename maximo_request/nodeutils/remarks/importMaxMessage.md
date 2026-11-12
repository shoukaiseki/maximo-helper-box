# 消息配置导入（新模式）

对应方法 `importMaxMessage`，调用 Maximo 自动化脚本 `SKS_MIGRATEAPI_MAXMESSAGES`。

## 用途

把源环境导出的 `MAXMESSAGES` / `L_MAXMESSAGES` 消息配置导入目标环境。接口返回逐条结果与汇总统计，可按行定位失败原因。

（通用返回结构与统计口径见 `新模式通用文档.md`。）

## 请求

- 方法：`POST`
- 地址：`/maximo/api/script/SKS_MIGRATEAPI_MAXMESSAGES?_action=import&_langcode=ZH`
- 请求体支持两种格式：

```json
{ "messages": [ { "MSGGROUP": "rfq", "MSGKEY": "rfq_001", "VALUE": "..." } ] }
```

或裸数组（客户端会自动包装成 `{messages:[...]}`）：

```json
[ { "MSGGROUP": "rfq", "MSGKEY": "rfq_001", "VALUE": "..." } ]
```

## URL 参数

| 参数 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `_action` | string | `import` | 固定为 import，表示执行导入 |
| `_langcode` | string | 环境 langcode | 会话语言代码，脚本会转大写 |
| `dmDeploySet` | boolean | `false` | 迁移模式，按目标环境类型重建消息配置 |
| `_allLangcode` | boolean | `false` | 为 true 时同时处理所有语言的消息文本 |

`urlParams` 优先级最高，存在同名参数时覆盖以上默认值。

## 返回

```json
{
  "status": "success",
  "message": "导入完成 共1条消息：新增0 更新1 删除0 失败0",
  "data": {
    "total": 1,
    "added": 0,
    "updated": 1,
    "deleted": 0,
    "failed": 0,
    "sks:successSumTotal": 1,
    "sks:failSumTotal": 0,
    "results": [
      {
        "sks:objectName": "MAXMESSAGES",
        "sks:ref": "rfq_001",
        "_operation": "updated",
        "_status": "success"
      }
    ]
  }
}
```

整批失败时 `status` 为 `error`，`message` 为原因，可能带 `errorMessageTrace`。

## 备注

- 消息以 `MSGGROUP` + `MSGKEY` 匹配；基线语言文本写 `MAXMESSAGES.VALUE`，其它语言写 `L_MAXMESSAGES.VALUE`；
- 导入大量消息时建议按批提交（Web 端分批调用即可），避免单次请求体过大；
- 行级失败不会让整批返回 `status=error`，需查看 `data['sks:failSumTotal']` 与 `data.results` 中的 `_status` / `_message`。
