# CLI 命令使用说明

## 命令概览

| 命令 | 说明 |
|------|------|
| `sks-maximo` | 检查配置文件并打开配置目录 |
| `sks-maximo <env>` | 加载指定环境配置 |
| `sks-maximo call <scriptName>` | 调用通用脚本接口 |
| `sks-maximo import-object <fileName>` | 导入 Maximo 对象配置 |
| `sks-maximo import-appinfo <fileName>` | 导入应用信息配置 |
| `sks-maximo import-presentation <fileName>` | 导入应用XML配置 |
| `sks-maximo import-script <fileName>` | 导入自动化脚本 |
| `sks-maximo import-domain <fileName>` | 导入域配置 |

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

## 3. 导入命令

所有导入命令均支持 `-e` / `--env` 指定环境和 `-l` / `--logname` 指定日志名。

### 3.1 导入对象配置

```bash
sks-maximo import-object <fileName> [-e env] [-l logname]
```

**说明：** 导入 Maximo 对象配置（JSON/XML）

| 参数 | 说明 | 必填 |
|------|------|------|
| `<fileName>` | JSON 或 XML 配置文件路径 | 是 |
| `-e` / `--env` | 指定环境（默认 local） | 否 |
| `-l` / `--logname` | 日志打印名称 | 否 |

---

### 3.2 导入应用信息

```bash
sks-maximo import-appinfo <fileName> [-e env] [-l logname]
```

**说明：** 导入 Maximo 应用信息配置（JSON）

| 参数 | 说明 | 必填 |
|------|------|------|
| `<fileName>` | 应用信息 JSON 文件路径 | 是 |
| `-e` / `--env` | 指定环境（默认 local） | 否 |
| `-l` / `--logname` | 日志打印名称 | 否 |

---

### 3.3 导入应用XML配置

```bash
sks-maximo import-presentation <fileName> [-e env] [-l logname]
```

**说明：** 导入 Maximo 应用 XML 配置

| 参数 | 说明 | 必填 |
|------|------|------|
| `<fileName>` | XML 配置文件路径 | 是 |
| `-e` / `--env` | 指定环境（默认 local） | 否 |
| `-l` / `--logname` | 日志打印名称 | 否 |

---

### 3.4 导入自动化脚本

```bash
sks-maximo import-script <fileName> [-e env] [-l logname]
```

**说明：** 导入 Maximo 自动化脚本。`<fileName>` 可以是 JSON 配置文件路径，也可以是 `.js`/`.py` 脚本文件路径（会自动找同目录下的同名 JSON 配置文件）

| 参数 | 说明 | 必填 |
|------|------|------|
| `<fileName>` | JSON 配置或脚本文件路径 | 是 |
| `-e` / `--env` | 指定环境（默认 local） | 否 |
| `-l` / `--logname` | 日志打印名称 | 否 |

---

### 3.5 导入域配置

```bash
sks-maximo import-domain <fileName> [-e env] [-l logname]
```

**说明：** 导入 Maximo 域配置

| 参数 | 说明 | 必填 |
|------|------|------|
| `<fileName>` | 域 JSON 文件路径 | 是 |
| `-e` / `--env` | 指定环境（默认 local） | 否 |
| `-l` / `--logname` | 日志打印名称 | 否 |

---

## 4. 调用通用脚本接口

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

### 4.1 GET 请求（无请求体）

```bash
sks-maximo call SHARPTREE.AUTOSCRIPT.LIBRARY --params '{"name":"TEST"}'
```

### 4.2 POST 请求（带请求体文件）

```bash
# JSON 请求体
sks-maximo call SKS_DEPLOY_AUTOKEY --file data/autokey.json

# XML 请求体
sks-maximo call SHARPTREE.AUTOSCRIPT.SCREENS --file screens/test.xml

# 同时带参数和请求体
sks-maximo call SKS_IMP_MAXAPPINFO --file appinfo.json --params '{"debug":true}' --logname "导入应用信息"
```

### 4.3 请求体文件处理

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