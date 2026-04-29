# Maximo DB2 MCP 服务

基于 **Solon 框架** 构建的 MCP (Model Context Protocol) 服务，专门用于查询 **IBM Maximo EAM 系统** 的 DB2 数据库元数据。可被任何支持 MCP 协议的 AI 客户端（如 Claude Desktop、Cursor、VS Code AI 等）集成使用。

## 功能特性

提供以下 MCP Tool 工具：

| 工具名称 | 描述 | 查询表 |
|---|---|---|
| `queryMaxobjects` | 查询 Maximo 对象定义 | MAXOBJECT |
| `queryMaxattributes` | 查询 Maximo 字段定义 | MAXATTRIBUTE |
| `queryMaxrelationships` | 查询 Maximo 关联关系 | MAXRELATIONSHIP |
| `queryAppXml` | 查询应用注册信息 | MAXAPPS |
| `queryAppSpecificsXml` | 查询应用 XML 配置内容 | MAXPRESENTATION |
| `queryBySql` | 通用只读 SQL 查询 | 自定义 |
| `getDatabaseOverview` | 获取数据库概览统计 | 多表聚合 |

## 技术栈

- **框架**: Solon 3.10.4
- **MCP协议**: solon-ai-mcp (STREAMABLE/SSE 传输)
- **数据库**: IBM DB2 (for Maximo)
- **数据访问**: solon-data-sqlutils (轻量 JDBC 工具)
- **连接池**: HikariCP

## 快速开始

### 环境要求

- JDK 8+
- Maven 3.6+
- IBM DB2 数据库（Maximo 系统）

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd maximo-db2-mcp
```

### 2. 修改配置

本项目采用**敏感信息分离管理**策略：

- **app.yml** - 公共配置（端口、日志等），可提交到 Git
- **app-db.yml** - 敏感配置（数据库密码等），已被 `.gitignore` 忽略

**步骤：**

1. 复制配置模板：
   ```bash
   cp src/main/resources/app-db.example.yml src/main/resources/app-db.yml
   ```
   （如果不存在示例文件，直接创建 `app-db.yml`）

2. 编辑 `src/main/resources/app-db.yml`，配置数据库连接信息：
   ```yaml
   maximo.db:
     jdbcUrl: "jdbc:db2://<host>:<port>/<database>"
     driverClassName: "com.ibm.db2.jcc.DB2Driver"
     username: "<your-username>"
     password: "<your-password>"
     maximumPoolSize: 10
     minimumIdle: 2
   ```

3. `app.yml` 已通过 `solon.include: app-db.yml` 自动引入数据库配置，无需修改。

### 3. 打包构建

```bash
mvn clean package -DskipTests
```

### 4. 启动服务

```bash
java -jar target/maximo-db2-mcp.jar
```

服务默认监听 `8081` 端口，MCP 端点路径为 `/mcp`。

### 5. MCP 连接信息

服务启动后，可通过以下地址访问：

- **MCP 端点**: `http://localhost:8081/mcp`
- **传输协议**: SSE (Server-Sent Events)
- **服务类型**: STREAMABLE

#### Claude Desktop 配置示例

在 `claude_desktop_config.json` 中添加：

```json
{
  "mcpServers": {
    "maximo-db2": {
      "url": "http://localhost:8081/mcp",
      "type": "sse"
    }
  }
}
```

#### Cursor / VS Code 配置

```json
{
  "mcpServers": {
    "maximo-db2": {
      "type": "sse",
      "url": "http://localhost:8080/mcp"
    }
  }
}
```

## 可用工具详解

### 1. queryMaxobjects

查询 Maximo 中的所有业务对象定义。

**参数：**
- `objectName` (可选): 对象名称模糊匹配，如 `"%WO%"` 查工单相关对象
- `limit` (可选): 返回条数，默认50，最大200

### 2. queryMaxattributes

查询对象的字段/属性定义。

**参数：**
- `objectName` (必填): 所属对象名称，如 `"%WORKORDER%"`
- `attributeName` (可选): 属性名过滤，如 `"%STATUS%"`
- `limit` (可选): 返回条数

### 3. queryMaxrelationships

查询对象之间的关联关系。

**参数：**
- `parentObject` (可选): 来源对象名
- `childObject` (可选): 目标对象名
- `relationshipName` (可选): 关系名
- `limit` (可选): 返回条数

### 4. queryAppXml

查询 Maximo 应用注册信息。

**参数：**
- `appName` (可选): 应用名模糊搜索
- `limit` (可选): 返回条数

### 5. queryAppSpecificsXml

查询应用的详细 XML 配置（包含 Service、Action、UI 等）。

**参数：**
- `appName` (必填): 应用名精确匹配
- `type` (可选): XML 类型过滤（如 `SERVICE`, `ACTION`, `UI`, `SIGNATURE` 等）

### 6. queryBySql

通用只读 SQL 查询（方便探索其他表）。

**参数：**
- `sql` (必填): SELECT 语句
- `params` (可选): 参数 JSON 数组，如 `["%PM%"]`
- `limit` (可选): 返回条数

### 7. getDatabaseOverview

获取数据库概览统计（对象数、字段数、关联数、应用数、数据类型分布等）。

## 项目结构

```
maximo-db2-mcp/
├── pom.xml                              # Maven 构建配置
├── app.yml                              # 公共配置（端口、日志等）
├── app-db.yml                          # 敏感配置（数据库密码，已忽略）
├── .gitignore                           # Git 忽略规则
├── run-solon.bat                        # Windows 启动脚本
├── README.md                            # 项目说明文档
├── src/
│   └── main/
│       ├── resources/
│       │   ├── app.yml                  # 主配置文件
│       │   └── app-db.yml              # 敏感配置文件（不提交）
│       └── java/
│           └── com/
│               └── maximo/
│                   └── mcp/
│                       ├── App.java                # 主入口
│                       ├── config/
│                       │   └── DbConfig.java       # 数据源配置
│                       └── server/
│                           └── MaximoMcpServer.java # MCP 服务端点
```

## 配置文件管理

### 敏感信息保护

为防止数据库密码等敏感信息泄露到 Git 仓库，项目采用以下策略：

1. **配置分离**
   - `app.yml` - 公共配置，可安全提交
   - `app-db.yml` - 敏感配置，已加入 `.gitignore`

2. **工作原理**
   ```yaml
   # app.yml 中声明引入敏感配置
   solon.include: app-db.yml
   ```
   Solon 启动时会自动合并两个配置文件。

3. **团队协作**
   - 每个开发者需要在本地创建自己的 `app-db.yml`
   - 可以创建 `app-db.example.yml` 作为模板供团队使用
   - 确保不要将真实的数据库密码提交到版本控制系统

## 常见问题

### Q: 如何修改服务端口？
修改 `app.yml` 中的 `server.port` 配置项。

### Q: 如何更换 MCP 传输方式？
修改 `@McpServerEndpoint` 注解中的 `channel` 参数：
- `McpChannel.STREAMABLE` - SSE 流式（推荐）
- `McpChannel.SSE` - 标准 SSE
- `McpChannel.STDIO` - 标准输入输出

### Q: 查询超时怎么办？
可在 `app.yml` 中调整连接池参数，或使用 `limit` 参数减少返回数据量。

## License

Apache 2.0
