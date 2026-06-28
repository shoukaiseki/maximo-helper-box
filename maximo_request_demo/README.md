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
- 通过命令行参数指定目标环境（loc/hd/dev），实现多环境部署