# SKS Maximo Utils

Maximo 表结构和数据更新工具集。

## 安装

### 全局安装（CLI 使用）
```bash
npm install -g shoukaiseki-maximo-utils
```

### 项目中安装（引用使用）
```bash
npm install sks-maximo-utils
```

## 使用方式

### CLI 命令

不带参数运行，打开配置目录：
```bash
sks-maximo
```

带参数运行，加载指定环境配置：
```bash
sks-maximo local    # 使用 local 环境配置
sks-maximo dev      # 使用 dev 环境配置
sks-maximo hd       # 使用 hd 环境配置
```

### 在脚本中引用

```javascript
import { 
  importMaxObject, 
  importMaxPresentation, 
  importMaxDomain,
  importMaxAutoKey,
  importMaxScript,
  importMaxAppInfo,
  callMaxScript,
  batchImport,
  printBatchStats,
  fileUtils,
  loadConfig,
  logger
} from 'sks-maximo-utils';

// 加载配置（可选，默认 local）
loadConfig('local');

// 导入 Maximo 对象配置
importMaxObject({ fileName: "DBCONFIGJSON/test.json", logname: "测试" });

// 导入应用 XML 配置
importMaxPresentation({ fileName: "SCREENSXML/test.xml", logname: "应用" });

// 导入域配置
importMaxDomain({ fileName: "DBDOMAINJSON/domain.json", logname: "域" });

// 导入 AutoKey 配置
importMaxAutoKey({ fileName: "AUTOKEYJSON/autokey.json", logname: "自动编码" });

// 导入自动化脚本（自动保存历史记录）
// fileName为JSON配置文件，同目录下需有同名.js文件
// 例如：scripts/TEST.json 和 scripts/TEST.js
importMaxScript({ fileName: "scripts/TEST.json" });

// 导入应用信息配置
importMaxAppInfo({ fileName: "MAXAPPINFO/appinfo.json", logname: "应用信息" });

// 通用脚本接口调用（GET）
callMaxScript({ apiScriptName: "SHARPTREE.AUTOSCRIPT.LIBRARY", params: { name: "test" }, logname: "查询脚本库" });

// 通用脚本接口调用（POST，读取文件内容作为请求体）
callMaxScript({ apiScriptName: "SKS_DEPLOY_AUTOKEY", fileName: "data/autokey.json", logname: "部署自动编码" });

// 通用批量导入（支持对象、脚本、域、应用信息等所有导入功能）
const stats = await batchImport({
    dirName: "C:/Temp/hd/maxobject_backup",   // 目录名（与files二选一）
    extFilter: ".json",                         // 扩展名过滤
    importFn: importMaxObject,                  // 导入函数（可换成其他导入方法）
    logname: "批量导入对象",
    concurrency: 1                              // 并发数，默认1串行
});
printBatchStats(stats);  // 打印批量导入统计结果

// 直接指定文件列表批量导入
await batchImport({
    files: ["a.json", "b.json", "c.json"],
    importFn: importMaxDomain
});

// 文件工具
fileUtils.listFiles('scripts', '.json');
fileUtils.readFileContent('test.txt');
```

## 配置文件

首次运行时，会自动在 `~/.sks/nodeutils/` 目录创建 `config.json` 配置文件。

配置结构：
```json
{
  "logLevel": "INFO",
  "langcode": "zh",
  "envs": {
    "local": {
      "baseUrl": "http://127.0.0.1:9080/maximo",
      "apiKey": "your-api-key",
      "maxauth": "",
      "authType": "apiKey",
      "langcode": "zh"
    },
    "dev": {
      "baseUrl": "https://mdev/maximo",
      "apiKey": "your-api-key",
      "maxauth": "",
      "authType": "apiKey",
      "langcode": "zh"
    }
  }
}
```

### 配置说明

| 字段 | 说明 |
|------|------|
| logLevel | 全局日志级别：TRACE, DEBUG, INFO, WARN, ERROR, FATAL |
| langcode | 全局语言代码，默认 zh |
| baseUrl | Maximo 服务地址 |
| apiKey | API 认证密钥 |
| maxauth | Maxauth 认证值 |
| authType | 认证类型：apiKey 或 maxauth |

环境配置中可单独设置 `logLevel` 和 `langcode`，优先级高于全局配置。

## API

### 导入方法

| 方法 | 说明 |
|------|------|
| importMaxObject | 导入 Maximo 对象配置（JSON） |
| importMaxPresentation | 导入应用 XML 配置 |
| importMaxDomain | 导入域配置 |
| importMaxAutoKey | 导入 AutoKey 配置 |
| importMaxScript | 导入自动化脚本（自动保存历史记录） |
| importMaxAppInfo | 导入应用信息配置 |

### 其他方法

| 方法 | 说明 |
|------|------|
| callMaxScript | 通用脚本接口调用（GET/POST） |
| batchImport | 通用批量导入（支持对象、脚本、域、应用信息等所有导入功能） |
| printBatchStats | 打印批量导入统计结果 |
| loadConfig(env) | 加载指定环境配置 |
| saveScriptHistory(options) | 保存脚本历史记录 |
| readFileContent(fileName) | 读取文件内容 |
| readJsonFile(fileName) | 读取并解析 JSON 文件 |
| fileExists(fileName) | 检查文件是否存在 |
| fileUtils.resolveFilePath(fileName) | 通用路径转换（相对/绝对路径转规范化绝对路径） |
| fileUtils.listFiles(dirName, extFilter, recursive) | 列出目录文件 |
| fileUtils.readFileContent(fileName) | 读取文件内容 |
| fileUtils.readJsonFile(fileName) | 读取并解析 JSON 文件 |

### 日志文件

请求和响应日志会自动保存到 `~/.sks/nodeutils/logs/` 目录：
- `request-*.http` - 请求日志（IntelliJ IDEA HTTP Client 格式）
- `response-*.json` - 响应日志

## 开发

```bash
# 安装依赖
npm install

# 本地链接（测试）
npm link

# 在其他项目中链接测试
npm link sks-maximo-utils
```

## License

ISC