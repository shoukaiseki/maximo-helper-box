# 应用信息导入（新接口）

对应方法 `importMaxAppInfo`，调用 Maximo 自动化脚本 `SKS.AUTOSCRIPT.SCREENS` 的 `importAppInfo` 动作。

## 请求

- 方法：`POST`
- 地址：`/maximo/api/script/SKS.AUTOSCRIPT.SCREENS?_action=importAppInfo&_langcode=ZH`
- 请求头：`Content-Type: application/merge-patch+json`（如目标环境要求）
- 请求体：应用信息 JSON（`maxapps` + `presentation` 等）

## URL 参数

| 参数 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `_action` | string | `importAppInfo` | 固定为 importAppInfo |
| `_langcode` | string | 环境 langcode（大写） | 语言代码，如 `ZH`、`EN` |
| `dmDeploySet` | boolean | `false` | 迁移模式，按目标环境类型重建应用信息 |
| `_errorAssert` | boolean | `false` | 单行失败立即中止整批导入 |

## 返回

直接返回接口响应对象：

```json
{
  "app": "SKS_APP",
  "status": "success",
  "data": { "maxapps": [], "presentation": [] },
  "sks:successSumTotal": 1,
  "sks:failSumTotal": 0
}
```

`status` 为 `error` 时表示整批失败。
