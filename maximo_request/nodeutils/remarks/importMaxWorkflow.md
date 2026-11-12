# 工作流导入

对应方法 `importMaxWorkflow`，调用 Maximo 自动化脚本 `SKS.AUTOSCRIPT.WORKFLOW`。

## 用途

把源环境导出的工作流（`WFPROCESS` 及其节点、出线、分配、通知、分配组）连同引用的操作（`ACTION`）、角色（`MAXROLE`）导入目标环境。

`SKS.AUTOSCRIPT.WORKFLOW` 同时提供 list / detail / export / deactivate / disable 能力，本项目只封装导入。

## 请求

- 方法：`POST`
- 地址：`/maximo/api/script/SKS.AUTOSCRIPT.WORKFLOW`
- 默认参数：`_type=workflows&_action=import&_impMode=add&_enable=true&_langcode=<环境值>`
- 请求体（JSON），三种写法都支持：

```json
{ "actions": [...], "maxroles": [...], "workflows": [...] }
```
```json
{ "workflows": [ { "processName": "PRCHG", "processRev": 1, ... } ] }
```
```json
[ { "processName": "PRCHG", "processRev": 1, ... } ]
```

迁移包（导出结果）会按 **操作 → 角色 → 工作流** 的顺序导入，可直接原样回导。

## URL 参数

| 参数 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `_type` | string | `workflows` | `workflows` / `actions` / `maxroles`；不给时按请求体推断 |
| `_action` | string | `import` | 固定为 import |
| `_impMode` | string | `add` | `add`：仅新增，已存在则跳过；`migration`：按 `PROCESSNAME+PROCESSREV` 存在则修改 |
| `_enable` | boolean | `true` | 导入后按源定义调用框架 `validateProcess` / `enableProcess` / `makeProcessActive`；`false` 只写数据不激活 |
| `_langcode` | string | 环境 langcode | 会话语言代码 |
| `_ignoreResultSuccess` | boolean | `false` | 为 true 时结果只返回失败明细 |

`urlParams` 优先级最高，存在同名参数时覆盖以上默认值（CLI 用 `--params`，Web 用任务行的 URL 参数）。

补充说明：

- `_impMode=migration` 时工作流可带 `syncFlag: true`，删除 JSON 中不存在的子记录（节点/操作/分配/通知/分配组）
- 子表记录可带 `_delete: true`，始终按业务键删除该条（与 `syncFlag` 无关，幂等）
- `_type=actions` / `maxroles` 导入时会忽略请求体中的其它分区，需要整包导入请用 `_type=workflows`

## 返回

```json
{
  "status": "success",
  "message": "批量导入完成",
  "impMode": "add",
  "actions": { "total": 3, "success": 3, "failed": 0, "result": [] },
  "maxroles": { "total": 1, "success": 1, "failed": 0, "result": [] },
  "workflows": { "total": 2, "success": 1, "failed": 1, "result": [ ... ] },
  "result": [ ... ],
  "summary": { "total": 6, "success": 5, "failed": 1 }
}
```

- 顶层 `summary` 为各类之和：`total / success / failed`
- 只导入单类型（`_type=actions` 或 `maxroles`）时没有分区字段，逐条结果在 `result`
- 逐条结果行：`{ processName, processRev, status: "SUCCESS" | "FAILED", message, warnings?, info? }`
- 请求级参数错误（如 `_impMode` 非法、缺少定位条件）返回 `{ status: "error", message }`；已进入处理流程时顶层恒为 `success`，逐条失败必须看 `result[].status`

## 备注

- 工作流以 `PROCESSNAME + PROCESSREV` 为业务键
- 出线通过 `WFACTION.ACTION` 引用操作名，因此操作需先导入（迁移包已保证顺序）
- `_enable=true` 会触发框架激活校验，失败原因在 `result[].warnings`，需要人工处理（如引用的应用未部署）
