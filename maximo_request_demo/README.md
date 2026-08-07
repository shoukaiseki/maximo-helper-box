# Maximo Helper Box Demo

Maximo 配置导入工具演示项目，用于批量导入 Maximo 对象配置、消息定义、域定义和应用配置等。

## 安装

```bash
# 全局安装工具包
npm install -g sks-maximo-utils
```

## 配置环境
执行 sks-maximo 命令生成配置文件,并打开配置文件目录
```
sks-maximo
```
环境名称与下方执行时候的 loc/hd/dev 要一致

## 获取 Demo

```bash
# 克隆仓库
git clone https://gitee.com/shoukaiseki/maximo-helper-box.git

# 进入 demo 目录
cd maximo-helper-box/maximo_request_demo
```

## 快速开始

```bash
# 进入项目目录
cd maximo_request_demo

# 执行导入命令（支持多个环境）
node demo01.js loc    # 本地环境
node demo01.js hd     # 测试环境
node demo01.js dev    # 开发环境
```

### 一行命令执行多环境（批量部署）

**Windows CMD：**
```cmd
node demo01.js loc & node demo01.js hd & node demo01.js dev
```

**Windows PowerShell：**
```powershell
node demo01.js loc; node demo01.js hd; node demo01.js dev
```

**Linux/Mac：**
```bash
node demo01.js loc && node demo01.js hd && node demo01.js dev
```

## 说明

- `demo01.js` 演示了如何使用 `sks-maximo-utils` 库批量导入各类配置文件
- 支持的配置类型：
  - MaxObject（对象配置）
  - MaxDomain（域定义）
  - MaxMessage（消息定义）
  - MaxPresentation（应用配置）
  - MaxAutoKey（自动编码）
  - MaxAppInfo（应用信息）
  - MaxScript（自动化脚本）
- 通过命令行参数指定目标环境（loc/hd/dev），实现多环境部署

## 通用批量导入

使用 `batchImport` 方法可对任意导入功能进行批量处理，支持自动统计成功/失败及耗时：

```javascript
import { batchImport, printBatchStats, importMaxObject } from 'sks-maximo-utils';

// 指定目录自动列出文件批量导入
const stats = await batchImport({
    dirName: "DBCONFIGJSON",        // 目录名（与files二选一）
    extFilter: ".json",             // 扩展名过滤
    importFn: importMaxObject,      // 导入函数（可换成其他导入方法）
    logname: "批量导入对象",
    concurrency: 1                  // 并发数，默认1串行
});
printBatchStats(stats);             // 打印批量导入统计结果
```

`batchImport` 参数说明：

| 参数 | 说明 |
|------|------|
| `dirName` / `files` | 二选一：目录名（自动列出文件）或文件路径数组 |
| `extFilter` | 扩展名过滤（配合 dirName 使用） |
| `importFn` | 导入函数：`importMaxObject`、`importMaxScript`、`importMaxDomain` 等 |
| `logname` | 日志打印名称 |
| `concurrency` | 并发数，默认 1 串行 |
| `continueOnError` | 单个失败是否继续，默认继续 |

`printBatchStats` 输出示例：

```
[批量导入]========== 批量导入统计 ==========
[批量导入]总文件数: 10
[批量导入]成功数量: 8
[批量导入]失败数量: 2
[批量导入]开始时间: 2026-07-19 10:00:00 结束时间: 2026-07-19 10:05:30 耗时: 330000ms
[批量导入]成功文件列表:
  ...
[批量导入]失败文件列表:
  ...
[批量导入]====================================
```