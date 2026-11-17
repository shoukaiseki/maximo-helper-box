# 多语言配置导入（统一入口）

对应方法 `importMaxMl`，命令 `import-ml-<type>`。七种多语言配置统一调用 `SKS_MIGRATEAPI_CONFIGUR`，通过 `_onlyFunctions` 只执行对应功能（与 Web 端多语言维护页面一致）。

## 命令与类型

| 命令 | `_onlyFunctions` | 根级列表 | 对象 | 多语言字段 |
|------|------------------|----------|------|-----------|
| `import-ml-maxapps` | `mlmaxapps` | `maxappsList` | MAXAPPS | `DESCRIPTION` |
| `import-ml-maxlabels` | `mlmaxlabels` | `maxlabelsList` | MAXLABELS | `VALUE` |
| `import-ml-maxmodules` | `mlmaxmodules` | `maxmodulesList` | MAXMODULES | `DESCRIPTION` |
| `import-ml-maxmenu` | `mlmaxmenu` | `maxmenuList` | MAXMENU | `HEADERDESCRIPTION` |
| `import-ml-sigoption` | `mlsigoption` | `sigoptionList` | SIGOPTION | `DESCRIPTION` |
| `import-ml-maxobjectcfg` | `mlmaxobjectcfg` | `maxobjectcfgList` | MAXOBJECTCFG | `DESCRIPTION` |
| `import-ml-maxattributecfg` | `mlmaxattributecfg` | `maxattributecfgList` | MAXATTRIBUTECFG | `TITLE`、`REMARKS` |

## 请求

- 方法：`POST`
- 地址：`/maximo/api/script/SKS_MIGRATEAPI_CONFIGUR?_action=import&_onlyFunctions=mlmaxlabels&_allLangcode=true`
- 请求体（以 XML 标签为例）：

```json
{
  "maxlabelsList": [
    {
      "APP": "TEST_SKS_WF1",
      "ID": "NTLhwTZ0IyLDn44c",
      "PROPERTY": "innerhtml",
      "sks:langdata": {
        "VALUE": { "ZH": "中文内容", "EN": "English content", "JA": "" }
      }
    }
  ]
}
```

也支持裸数组与单行对象（客户端会自动包装为 `{<根级列表>:[...]}`）。

## URL 参数

| 参数 | 默认 | 说明 |
|------|------|------|
| `_action` | `import` | 固定为 import |
| `_onlyFunctions` | 按类型 | 只执行对应多语言功能，避免误改其它配置 |
| `_langcode` | 环境 langcode | 会话语言代码，脚本会转大写 |
| `_allLangcode` | `true` | 按 `sks:langdata` 设置各语言值 |
| `dmDeploySet` | `false` | 迁移模式（部署集） |

`--no-all-langcode` 可关闭 `_allLangcode`；`--params` 优先级最高。

## 返回

与对象配置导入一致：

```json
{
  "status": "success",
  "message": "导入完成 共1行：新增0 更新1 跳过0 失败0",
  "data": {
    "total": 1, "added": 0, "updated": 1, "skipped": 0, "failed": 0,
    "sks:successSumTotal": 1,
    "sks:failSumTotal": 0,
    "sks:ignoreSumTotal": 0,
    "results": [ { "sks:objectName": "MAXLABELS", "sks:ref": "TEST_SKS_WF1/NTLhwTZ0IyLDn44c/innerhtml", "_status": "success", "_operation": "updated" } ]
  }
}
```

## 备注

- 只更新 `sks:langdata` 中出现的语言；`~null~` 表示跳过该语言，`""` 表示写入空串；
- 基础语言列在非基础语言会话下由脚本切回基础语言补写（新增行），存量行建议核对导出结果；
- 一次只执行一种功能，多个类型请分别导入，避免 `_onlyFunctions` 传入多个值时互相影响排查。
