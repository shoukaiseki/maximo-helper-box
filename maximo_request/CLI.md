# CLI 命令使用说明

## 命令概览

| 命令 | 说明 |
|------|------|
| `sks-maximo` | 检查配置文件并打开配置目录 |
| `sks-maximo <env>` | 加载指定环境配置 |
| `sks-maximo call <scriptName>` | 调用通用脚本接口 |
| `sks-maximo import-object <fileName>` | 导入 Maximo 对象配置（旧版接口） |
| `sks-maximo import-object-v2 <fileName>` | 导入 Maximo 对象配置（新模式 `SKS_MIGRATEAPI_CONFIGUR`） |
| `sks-maximo import-message <fileName>` | 导入消息配置（新模式 `SKS_MIGRATEAPI_MAXMESSAGES`） |
| `sks-maximo import-workflow <fileName>` | 导入工作流（`SKS.AUTOSCRIPT.WORKFLOW`） |
| `sks-maximo import-appinfo <fileName>` | 导入应用信息配置（新接口） |
| `sks-maximo import-appinfo-v1 <fileName>` | 导入应用信息配置（旧版接口） |
| `sks-maximo import-presentation <fileName>` | 导入应用XML配置 |
| `sks-maximo import-script <fileName>` | 导入自动化脚本 |
| `sks-maximo import-domain <fileName>` | 导入域配置 |
| `sks-maximo import-maxintobject <fileName>` | 导入对象结构(Integration Object)配置 |
| `sks-maximo import-autokey <fileName>` | 导入自动编码(AutoKey)配置 |
| `sks-maximo import-params [命令/方法名]` | 查看导入接口的 URL 参数与说明 |

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

所有导入命令均支持 `-e` / `--env` 指定环境、`-l` / `--logname` 指定日志名、
`--params` 传 JSON 覆盖接口 URL 参数。

```bash
sks-maximo import-object data/object.json -e hd                      # 旧版接口
sks-maximo import-object-v2 data/object.json -e hd --params '{"dmDeploySet":true}'  # 新模式
sks-maximo import-params import-object-v2    # 查看参数与详细说明
```

### 3.1 导入对象配置

```bash
sks-maximo import-object <fileName> [-e env] [-l logname]        # 旧版接口
sks-maximo import-object-v2 <fileName> [-e env] [-l logname]     # 新模式
```

**说明：** 导入 Maximo 对象配置。旧版接口 `import-object` 走 `SKS.AUTOSCRIPT.LIBRARY`；新模式 `import-object-v2` 走 `SKS_MIGRATEAPI_CONFIGUR`（`_action=import`）。

| 参数 | 说明 | 必填 |
|------|------|------|
| `<fileName>` | JSON 配置文件路径 | 是 |
| `-e` / `--env` | 指定环境（默认 local） | 否 |
| `-l` / `--logname` | 日志打印名称 | 否 |
| `--params` | URL 参数覆盖（JSON），仅 `import-object-v2` 生效，如 `{"dmDeploySet":true}` | 否 |

---

### 3.2 导入应用信息

```bash
sks-maximo import-appinfo <fileName> [-e env] [-l logname]
```

**说明：** 导入 Maximo 应用信息配置，走新接口 `SKS.AUTOSCRIPT.SCREENS?_action=importAppInfo`。旧版接口使用 `import-appinfo-v1`。

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

**说明：** 导入 Maximo 域配置，走 `SKS.AUTOSCRIPT.OBJECTS`（`_type=domains&_action=import`）。文件内容支持域数组 / `{domains:[...]}` / 单域对象三种格式。

| 参数 | 说明 | 必填 |
|------|------|------|
| `<fileName>` | 域 JSON 文件路径 | 是 |
| `-e` / `--env` | 指定环境（默认 local） | 否 |
| `-l` / `--logname` | 日志打印名称 | 否 |

---

### 3.6 导入对象结构(Integration Object)

```bash
sks-maximo import-maxintobject <fileName> [-e env] [-l logname]
```

**说明：** 导入 Maximo 对象结构（发布通道），走 `SKS.AUTOSCRIPT.OBJECTS`（`_type=integrationobjects&_action=import`）。文件内容需为 `{integrationobjects:[...]}` 格式（从对象结构导出的 JSON 可直接回导）。

| 参数 | 说明 | 必填 |
|------|------|------|
| `<fileName>` | 对象结构 JSON 文件路径 | 是 |
| `-e` / `--env` | 指定环境（默认 local） | 否 |
| `-l` / `--logname` | 日志打印名称 | 否 |

---

### 3.7 导入自动编码(AutoKey)

```bash
sks-maximo import-autokey <fileName> [-e env] [-l logname]
```

**说明：** 导入 Maximo 自动编码配置，走 `SKS_DEPLOY_AUTOKEY`。请求体支持三种格式：AutoKey 数组、`{autokeys:[...]}`、单个 AutoKey 对象。

| 参数 | 说明 | 必填 |
|------|------|------|
| `<fileName>` | AutoKey JSON 文件路径 | 是 |
| `-e` / `--env` | 指定环境（默认 local） | 否 |
| `-l` / `--logname` | 日志打印名称 | 否 |
| `--params` | URL 参数覆盖（JSON），如 `{"develop":false}` | 否 |

---

### 3.8 导入消息配置

```bash
sks-maximo import-message <fileName> [-e env] [-l logname] [--all-langcode] [--dm-deploy-set]
```

**说明：** 导入 Maximo 消息配置（`MAXMESSAGES` / `L_MAXMESSAGES`），走新模式接口 `SKS_MIGRATEAPI_MAXMESSAGES`（`_action=import`）。请求体支持 `{messages:[...]}` 或裸数组（自动包装）。

| 参数 | 说明 | 必填 |
|------|------|------|
| `<fileName>` | 消息 JSON 文件路径 | 是 |
| `-e` / `--env` | 指定环境（默认 local） | 否 |
| `-l` / `--logname` | 日志打印名称 | 否 |
| `--all-langcode` | 同时处理所有语言的消息文本（`_allLangcode=true`） | 否 |
| `--dm-deploy-set` | 迁移模式（`dmDeploySet=true`） | 否 |
| `--params` | URL 参数覆盖（JSON），优先级最高 | 否 |

---

### 3.9 导入工作流

```bash
sks-maximo import-workflow <fileName> [-e env] [-l logname] [--imp-mode add|migration] [--disable] [--type workflows|actions|maxroles]
```

**说明：** 导入 Maximo 工作流，走 `SKS.AUTOSCRIPT.WORKFLOW`。默认参数为 `_langcode=<环境值>&_type=workflows&_action=import&_impMode=add&_enable=true`。请求体支持导出结果原样回导（`{actions,maxroles,workflows}` 迁移包）、`{workflows:[...]}`、裸数组或单个对象。

| 参数 | 说明 | 必填 |
|------|------|------|
| `<fileName>` | 工作流 JSON 文件路径 | 是 |
| `-e` / `--env` | 指定环境（默认 local） | 否 |
| `-l` / `--logname` | 日志打印名称 | 否 |
| `--imp-mode` | 导入模式：`add`（不存在则新增，存在则跳过，默认）/ `migration`（存在则修改） | 否 |
| `--disable` | 只写入不激活（`_enable=false`）；`--enable true|false` 等价写法 | 否 |
| `--type` | 导入类型：`workflows`（默认）/ `actions` / `maxroles` | 否 |
| `--params` | URL 参数覆盖（JSON），优先级最高 | 否 |

输出示例：

```text
导入完成
共 3 个工作流，成功 3，失败 0
```

失败行会追加打印，形如 `  - WFNAME(1): <失败原因>`；`status === "error"` 时退出码为 `1`。

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
sks-maximo call SKS.AUTOSCRIPT.LIBRARY --params '{"name":"TEST"}'
```

### 4.2 POST 请求（带请求体文件）

```bash
# JSON 请求体
sks-maximo call SKS_DEPLOY_AUTOKEY --file data/autokey.json

# XML 请求体
sks-maximo call SKS.AUTOSCRIPT.SCREENS --file screens/test.xml

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
sks-maximo call SKS.AUTOSCRIPT.LIBRARY --params '{"name":"MY_SCRIPT"}'
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