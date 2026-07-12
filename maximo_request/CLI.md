# CLI 命令使用说明

## 命令概览

| 命令 | 说明 |
|------|------|
| `sks-maximo` | 检查配置文件并打开配置目录 |
| `sks-maximo <env>` | 加载指定环境配置 |
| `sks-maximo call <scriptName>` | 调用通用脚本接口 |

---

## 1. 打开配置目录

```bash
sks-maximo
```

**功能：**
- 检查 `~/.sks/nodeutils/config.json` 是否存在
- 不存在则复制 `sample.config.json` 创建
- 自动打开配置文件所在目录

---

## 2. 加载环境配置

```bash
sks-maximo local    # 使用本地环境配置
sks-maximo dev      # 使用开发环境配置  
sks-maximo hd       # 使用测试环境配置
```

**功能：**
- 加载指定环境的配置到全局
- 后续所有 API 调用使用该环境的 baseUrl、apiKey 等配置

---

## 3. 调用通用脚本接口

```bash
sks-maximo call <scriptName> [--file <fileName>] [--params <params>] [--logname <logname>]
```

**参数说明：**

| 参数 | 简写 | 说明 | 必填 |
|------|------|------|------|
| `<scriptName>` | - | Maximo 脚本接口名称 | 是 |
| `--file` | `-f` | 请求体文件路径（JSON/XML等） | 否 |
| `--params` | `-p` | URL 查询参数（JSON格式） | 否 |
| `--logname` | `-l` | 日志名称 | 否 |

### 3.1 GET 请求（无请求体）

```bash
sks-maximo call SHARPTREE.AUTOSCRIPT.LIBRARY --params '{"name":"TEST"}'
```

### 3.2 POST 请求（带请求体文件）

```bash
# JSON 请求体
sks-maximo call SKS_DEPLOY_AUTOKEY --file data/autokey.json

# XML 请求体
sks-maximo call SHARPTREE.AUTOSCRIPT.SCREENS --file screens/test.xml

# 同时带参数和请求体
sks-maximo call SKS_IMP_MAXAPPINFO --file appinfo.json --params '{"debug":true}' --logname "导入应用信息"
```

### 3.3 请求体文件处理

- **`.json` 文件**：自动解析为 JSON 对象作为请求体
- **其他文件**：读取文件内容作为字符串请求体

---

## 配置文件说明

配置文件位置：`~/.sks/nodeutils/config.json`

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
      "authType": "apiKey"
    }
  }
}
```

---

## 示例

### 示例 1：查询脚本库

```bash
sks-maximo call SHARPTREE.AUTOSCRIPT.LIBRARY --params '{"name":"MY_SCRIPT"}'
```

### 示例 2：部署自动编码

```bash
sks-maximo call SKS_DEPLOY_AUTOKEY --file autokey/test.json --logname "部署自动编码"
```

### 示例 3：导入应用信息

```bash
sks-maximo call SKS_IMP_MAXAPPINFO --file appinfo/APP001.json
```

---

## 帮助信息

```bash
sks-maximo --help    # 显示帮助
sks-maximo -h        # 显示帮助
sks-maximo -v        # 显示版本号
```