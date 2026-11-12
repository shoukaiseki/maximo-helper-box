# 导入统一规范（CLI 与 Web UI）

> 配套参考：[新模式通用文档.md](../../maximo-manager-panel/新模式通用文档.md)（Maximo 迁移新模式接口的服务端契约）。
> 本文档约定本项目的**终端命令规范**与**Web UI 当前实现方案**，新增导入类型时按此对齐。

## 一、统一返回结构

所有新模式接口（`SKS_MIGRATEAPI_*`、新版 `SKS.AUTOSCRIPT.SCREENS`）返回同一形状：

```json
{
  "status": "success",
  "message": "导入完成 共1个对象：新增0 更新1 跳过0 失败0；总计 成功106 忽略2 失败0",
  "data": {
    "total": 1, "added": 0, "updated": 1, "deleted": 0, "skipped": 0, "failed": 0,
    "sks:successSumTotal": 106,
    "sks:failSumTotal": 0,
    "sks:ignoreSumTotal": 2,
    "results": [
      {
        "sks:objectName": "MAXOBJECT",
        "sks:ref": "RFQ",
        "_operation": "updated",
        "_status": "success",
        "attributes": [ /* 子行，结构相同 */ ],
        "indexes": [],
        "relationships": []
      }
    ]
  }
}
```

### 1.1 统计口径

| 字段 | 含义 |
|------|------|
| `_status` | `success` / `failed` / `skipped`（跳过 = 主键列、无变化、`_updateIgnored`、delete 未执行等） |
| `_operation` | `added` / `updated` / `deleted` |
| `_message` | 失败/提示原因 |
| `sks:objectName` / `sks:ref` | 行所属对象名 / 业务主键 |
| `sks:successTotal` / `failTotal` / `ignoreTotal` | 本行层级统计（不含子数组） |
| `sks:successSumTotal` / `failSumTotal` / `ignoreSumTotal` | 递归含子数组统计，根级 `data` 同样带这三个字段 |

- 对账：`successSumTotal + failSumTotal + ignoreSumTotal` = 该行自身 + 全部子级行数
- 多文件/分批导入时，只需累加每次响应的根级 `sks:*SumTotal`
- 失败定位：根级 `failSumTotal > 0` → `_status="failed"` 的行 → 子数组中的 failed 子行 → 看 `_message` / `sks:ref`

### 1.2 状态判定

- 脚本级异常：`{ status: "error", message, errorMessageTrace? }`
- 行级失败**不会**让根级变成 `error`，必须看 `sks:failSumTotal`

## 二、终端命令规范

### 2.1 命名

| 规则 | 示例 |
|------|------|
| 导入命令统一 `import-<类型>` | `import-object`、`import-message`、`import-domain` |
| 同一能力的新旧接口用版本后缀区分 | 旧版 `import-object`，新模式 `import-object-v2`；新版 `import-appinfo`，旧版 `import-appinfo-v1` |
| 查看接口参数用 `import-params <命令或方法名>` | `sks-maximo import-params import-message` |

### 2.2 通用参数

```bash
sks-maximo <import-command> <fileName> [-e env] [-l logname] [--params '<JSON>'] [命令专属开关]
```

| 参数 | 说明 |
|------|------|
| `-e` / `--env` | 环境名（也支持位置参数写法：`import-object a.json hd_zh`） |
| `-l` / `--logname` | 日志前缀，默认取文件名 |
| `--params` | URL 参数覆盖（JSON），**优先级最高**，同名参数覆盖代码默认值 |
| 命令专属开关 | 如 `--dm-deploy-set`、`--all-langcode` |
| `-web` / `-p` | 启动 Web 服务（`sks-maximo -web -e hd -p 8088`） |

URL 参数合并优先级（从低到高）：代码默认 → `_langcode` → 命令开关 → `urlParams`（`--params`）。

### 2.3 输出与退出码

导入成功后固定输出两行（由 `printImportResult` 生成）：

```text
<接口返回的 message>
共 N <单位>，新增 a，更新 u，删除 d，跳过 s，失败 f
总计 成功 X，忽略 Y，失败 Z
```

- 单位按类型取 `个对象` / `条消息` 等；`data` 缺失的字段不输出
- `status === "error"` 或抛出异常：打印 `导入失败: <message>` / `导入出错: <message>`，退出码 `1`
- 成功：退出码 `0`

### 2.4 命令清单

| 命令 | 方法 | 接口 |
|------|------|------|
| `import-object` | `importMaxObjectV1` | `SKS.AUTOSCRIPT.LIBRARY` |
| `import-object-v2` | `importMaxObject` | `SKS_MIGRATEAPI_CONFIGUR` |
| `import-message` | `importMaxMessage` | `SKS_MIGRATEAPI_MAXMESSAGES` |
| `import-workflow` | `importMaxWorkflow` | `SKS.AUTOSCRIPT.WORKFLOW`（`_type=workflows&_impMode=add&_enable=true`，返回 `summary:{total,success,failed}`） |
| `import-appinfo` | `importMaxAppInfo` | `SKS.AUTOSCRIPT.SCREENS`（`_action=importAppInfo`） |
| `import-appinfo-v1` | `importMaxAppInfoV1` | `SKS_IMP_MAXAPPINFO` |
| `import-presentation` | `importMaxPresentation` | `SKS.AUTOSCRIPT.SCREENS`（XML） |
| `import-script` | `importMaxScript` | `MXAPIAUTOSCRIPT` / `MXSCRIPT` |
| `import-domain` | `importMaxDomain` | `SKS.AUTOSCRIPT.OBJECTS`（`_type=domains`） |
| `import-maxintobject` | `importMaxIntObject` | `SKS.AUTOSCRIPT.OBJECTS`（`_type=integrationobjects`） |
| `import-autokey` | `importMaxAutoKey` | `SKS_DEPLOY_AUTOKEY` |
| `call` | `callMaxScript` | 任意 `/api/script/<scriptName>` |

所有导入方法签名均支持 `urlParams`，`batchImport` 通过 `importFn({ fileName, logname, urlParams })` 透传给每个文件。

## 三、Web UI 当前方案

### 3.1 技术栈与启动

- 后端：Express + SSE（`text/event-stream`），前端：Vue 3 + Vite 5 + Element Plus
- 启动：`sks-maximo -web [-e <env>] [-p <port>]`，默认 `http://127.0.0.1:8080`
- 前端构建：`npm run build`（产物 `web/client/dist`，由后端静态托管）

### 3.2 目录结构

```text
web/
├── server/
│   ├── index.js              # Express 入口、路由挂载、静态托管
│   └── routes/
│       ├── envs.js           # GET  /api/envs
│       ├── scan.js           # POST /api/scan          扫描目录文件
│       ├── run.js            # POST /api/run           执行计划（SSE）
│       │                     # POST /api/run/stop      停止执行
│       ├── plan.js           # 计划 CRUD               /api/plan
│       ├── browse.js         # POST /api/browse/dir    系统目录选择框
│       └── importConfig.js   # GET  /api/import-config 接口元数据
└── client/
    └── src/App.vue           # 单页：计划 / 执行监控 / 结果 / 环境
```

### 3.3 计划与持久化

- 索引：`~/.sks/nodeutils/import-plan.json`
  ```json
  { "plans": [{ "id": "<32位uuid>", "name": "...", "env": "...", "updatedAt": "..." }], "defaultId": "..." }
  ```
- 详情：`~/.sks/nodeutils/import-plan/<uuid>.json`（整份计划对象，含所有任务与 `urlParams`）
- 接口：`GET /api/plan/list`、`GET /api/plan?id=`、`POST /api/plan`、`POST /api/plan/rename`、`POST /api/plan/default`、`DELETE /api/plan?id=`
- 计划与环境强关联：计划里保存 `env` 仅作参考值，执行时以页面当前环境为准

### 3.4 任务行字段

| 字段 | 说明 |
|------|------|
| `importType` | `object` / `presentation` / `domain` / `autokey` / `script` / `appinfo` / `intobject` / `message` / `workflow` |
| `path` | 目录或文件路径 |
| `extFilter` | 扩展名过滤，如 `.json` |
| `recursive` | 是否递归扫描 |
| `logname` | 日志前缀 |
| `options` | 额外方法选项（如 `dmDeploySet`） |
| `urlParams` | **已启用**的 URL 参数 `{ 参数名: 值 }`，执行时透传 |
| `urlParamMeta` | 未启用项（名称/值/说明）与自定义说明，仅用于界面编辑与持久化 |

### 3.5 接口元数据（importConfig）

- 配置：[nodeutils/importConfig.json](./nodeutils/importConfig.json)，以方法名为 key：
  ```json
  "importMaxMessage": {
    "command": "import-message",
    "title": "消息配置导入（新模式）",
    "interface": "SKS_MIGRATEAPI_MAXMESSAGES",
    "remark": "remarks/importMaxMessage.md",
    "params": [
      { "name": "_action", "type": "string", "default": "import", "htmlType": "select",
        "htmlTypeOptions": [{ "dictValue": "import", "dictLabel": "导入" }],
        "description": "接口功能分发，固定为 import" }
    ]
  }
  ```
- 参数项支持 `htmlType`：`""`（文本框）/ `select`（可下拉可输入，配 `htmlTypeOptions`）/ `boolSelect`（固定 true/false）
- 详细备注存 `nodeutils/remarks/*.md`，后端 [importConfig.js](./nodeutils/importConfig.js) 用 `marked` 渲染成 `remarkHtml`
- 对外：`GET /api/import-config`（Web 前端用）、`loadImportConfig()` / `getImportConfigItem()` / `getDefaultUrlParams()`（npm 包与 CLI 用）

### 3.6 执行流程

1. 前端 `POST /api/scan` 按任务目录/过滤条件扫描文件，得到文件列表
2. 前端 `POST /api/run`（body：`{ env, tasks, concurrency }`），响应改为 SSE 流
3. 事件顺序：
   - `start` → 每任务 `taskScan` → `taskStart` → 每文件 `fileProgress` → `taskComplete` / `taskError` / `taskSkipped` → `complete`
   - 任一步出错发 `error`
4. 服务端 `IMPORT_TYPE_MAP` 将类型映射到方法，`importFn` 调用时传 `{ fileName, logname, options, urlParams }`
5. 单文件结果统一为：
   ```json
   { "fileName": "...", "status": "success", "message": "...", "data": { /* 见第一章 */ } }
   ```
   异常时为 `{ fileName, status: "error", message, data: null }`

### 3.7 结果展示

- 「执行结果」页按任务分组，展开后按文件列出：成功/失败/忽略数取自 `data['sks:*SumTotal']`
- 文件行「明细 (N)」按钮弹窗，把 `data.results` 树扁平化为（根对象 → `attributes` / `indexes` / `relationships`），按状态列区分 `失败` / `忽略`，展示对象名、`sks:ref`、操作、`_message`
- 明细弹窗使用 `append-to-body`，保证在「执行结果」页（计划卡片隐藏时）也能正常弹出

### 3.8 计划任务行交互

- 导入类型下拉 + 问号图标：点击按 `importConfig` 的 `remarkHtml` 渲染接口说明，弹窗可最大化
- 「URL 参数」列：显示已启用参数摘要与未启用数量；弹窗内可勾选启用/禁用、增删参数、恢复默认、填写说明；
  值按 `type` 自动转换（`true`/`false` → boolean，纯数字 → number）

## 四、新增导入类型检查清单

1. `nodeutils/maximoTools.js` 新增 `importXxx({ fileName, logname, ..., urlParams = {} })`，参数最后合并 `urlParams`
2. `index.js` 导出新方法
3. `cli.js`：`importCommands`、帮助文案、命令分支（统一用 `printImportResult` 输出统计）
4. `nodeutils/importConfig.json` 增加条目（`command/title/interface/remark/params`，参数带 `htmlType`）
5. `nodeutils/remarks/<method>.md` 写明请求、参数、返回、失败定位
6. 需要 Web 支持时：`web/server/routes/run.js` 的 `IMPORT_TYPE_MAP`、前端 `importTypeMethod` 与类型下拉
7. `CLI.md` / `README.md` 命令表与方法表同步
