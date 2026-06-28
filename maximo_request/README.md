# SKS Maximo Utils

Maximo 表结构和数据更新工具集。

## 安装

### 全局安装（CLI 使用）
```bash
npm install -g sks-maximo-utils
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
```

## 配置文件

首次运行时，会自动在 `~/.sks/nodeutils/` 目录创建 `config.json` 配置文件。

配置结构：
```json
{
  "logLevel": "INFO",
  "envs": {
    "local": {
      "baseUrl": "http://127.0.0.1:9080/maximo",
      "apiKey": "your-api-key",
      "maxauth": "",
      "authType": "apiKey"
    },
    "dev": {
      "baseUrl": "https://mdev/maximo",
      "apiKey": "your-api-key",
      "maxauth": "",
      "authType": "apiKey"
    }
  }
}
```

### 配置说明

| 字段 | 说明 |
|------|------|
| logLevel | 全局日志级别：TRACE, DEBUG, INFO, WARN, ERROR, FATAL |
| baseUrl | Maximo 服务地址 |
| apiKey | API 认证密钥 |
| maxauth | Maxauth 认证值 |
| authType | 认证类型：apiKey 或 maxauth |

环境配置中可单独设置 `logLevel`，优先级高于全局配置。

## API

### 导入方法

| 方法 | 说明 |
|------|------|
| importMaxObject | 导入 Maximo 对象配置（JSON） |
| importMaxPresentation | 导入应用 XML 配置 |
| importMaxDomain | 导入域配置 |

### 其他方法

| 方法 | 说明 |
|------|------|
| loadConfig(env) | 加载指定环境配置 |
| readFileContent(fileName) | 读取文件内容 |
| readJsonFile(fileName) | 读取并解析 JSON 文件 |
| fileExists(fileName) | 检查文件是否存在 |

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