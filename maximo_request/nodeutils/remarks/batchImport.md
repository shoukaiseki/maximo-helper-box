# 批量导入

对应方法 `batchImport`，在本地按目录或文件列表循环执行导入函数。

## 参数

| 参数 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `dirName` | string | - | 目录路径（与 `files` 二选一） |
| `files` | string[] | - | 文件列表（与 `dirName` 二选一） |
| `extFilter` | string | - | 目录扫描时的扩展名过滤，如 `.json` |
| `recursive` | boolean | `true` | 是否递归子目录 |
| `importFn` | function | - | 单个文件的导入函数，接收 `{ fileName, logname, urlParams }` |
| `concurrency` | number | `1` | 并发数，1 为串行 |
| `continueOnError` | boolean | `true` | 单个文件异常时是否继续后续文件 |
| `urlParams` | object | `{}` | 透传给 `importFn` 的 URL 参数，最终合并进每个文件的接口请求 |

## 返回

```json
{
  "fileCount": 10,
  "successCount": 8,
  "failCount": 2,
  "successList": [],
  "failList": [],
  "startTime": 0,
  "endTime": 0,
  "totalTime": 1234
}
```
