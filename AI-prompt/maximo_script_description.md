# Maximo 自动化脚本详细说明与常用场景示例

## 目录
- [1. 概述](#1-概述)
- [2. 脚本语言支持](#2-脚本语言支持)
- [3. 隐式变量](#3-隐式变量)
- [4. 启动点类型](#4-启动点类型)
- [5. JavaScript (Nashorn) 脚本详解](#5-javascript-nashorn-脚本详解)
- [6. Python (Jython) 脚本详解](#6-python-jython-脚本详解)
- [7. 常用场景示例](#7-常用场景示例)
- [8. 高级功能](#8-高级功能)
- [9. 最佳实践](#9-最佳实践)

---

## 1. 概述

Maximo 自动化脚本（Automation Scripts）是 IBM Maximo Asset Management 平台提供的强大扩展机制，允许开发者通过编写脚本来自定义业务逻辑、验证数据、自动化工作流等。脚本可以在多个触发点执行，包括对象事件、属性事件、操作触发等。

### 核心特性
- **无需编译**：脚本直接部署到 Maximo 服务器，无需重新编译 Java 代码
- **多语言支持**：支持 JavaScript (Nashorn)、Python (Jython) 等多种脚本语言
- **灵活触发**：可在对象生命周期、属性变更、用户操作等多个时点触发
- **安全控制**：基于 Maximo 安全框架进行权限管理
- **REST API 集成**：可通过 OSLC REST API 调用脚本

---

## 2. 脚本语言支持

### 2.1 JavaScript (Nashorn)
- **引擎**：Nashorn JavaScript Engine
- **适用版本**：Maximo 7.6+、MAS 8.x
- **特点**：
  - 语法类似现代 JavaScript
  - 可直接调用 Java 类和方法
  - 性能较好，推荐用于新项目

### 2.2 Python (Jython)
- **引擎**：Jython Python Engine
- **适用版本**：所有 Maximo 版本
- **特点**：
  - 语法简洁，适合快速开发
  - 可访问 Java 类和 Maximo API
  - 中文字符串需要特殊处理（使用 `.decode('utf-8')`）

---

## 3. 隐式变量

Maximo 在脚本执行时自动注入以下隐式变量，无需声明即可使用：

| 变量名 | 类型 | 描述 | 适用范围 |
|--------|------|------|----------|
| `app` | String | 当前应用名称 | 所有启动点 |
| `user` | String | 触发脚本执行的用户名 | 所有启动点 |
| `mbo` | psdi.mbo.Mbo | 当前 MBO 对象 | 所有启动点 |
| `mboname` | String | 当前 MBO 名称 | 所有启动点 |
| `errorkey` | String | MXException 错误键 | 所有启动点 |
| `errorgroup` | String | MXException 错误组 | 所有启动点 |
| `params` | String[] | MXException 参数数组 | 所有启动点 |
| `interactive` | boolean | 是否为交互式会话 | 所有启动点 |
| `evalresult` | boolean | 条件评估结果（OUT 类型） | 仅条件启动点 |
| `onadd` | boolean | MBO 是否正在被添加 | 所有启动点 |
| `onupdate` | boolean | MBO 是否正在被更新 | 所有启动点 |
| `ondelete` | boolean | MBO 是否正在被删除 | 所有启动点 |
| `action` | String | 操作名称 | 操作启动点 |
| `scriptName` | String | 正在执行的脚本名称 | 所有启动点 |
| `launchPoint` | String | 启动点名称 | 所有启动点 |
| `scriptHome` | psdi.mbo.Mbo | 同 `mbo`（向后兼容） | 操作启动点 |
| `wfinstance` | psdi.workflow.WFInstance | 工作流实例 MBO | 工作流操作启动点 |
| `service` | ScriptService | 脚本服务接口 | 所有启动点 |
| `userInfo` | UserInfo | 用户信息对象 | 所有启动点 |
| `request` | RESTRequest | HTTP 请求对象 | REST 接口脚本 |
| `responseBody` | String | HTTP 响应体 | REST 接口脚本 |
| `requestBody` | String | HTTP 请求体 | REST 接口脚本 |
| `httpMethod` | String | HTTP 方法（GET/POST 等） | REST 接口脚本 |

### 使用示例

```javascript
// JavaScript 示例
if (onadd) {
    service.log_info("正在创建新记录");
}

var currentUser = user;
var appName = app;
```

```python
# Python 示例
if onadd:
    service.log_info("正在创建新记录")

current_user = user
app_name = app
```

---

## 4. 启动点类型

### 4.1 对象启动点（Object Launch Point）
在 MBO 对象级别触发，监听对象的生命周期事件。

**触发事件**：
- **初始化值（Initialize Value）**：对象创建时设置默认值
- **验证应用程序（Validate Application）**：保存前验证
- **允许创建对象（Allow Object Creation）**：控制是否允许创建
- **允许删除对象（Allow Object Deletion）**：控制是否允许删除
- **保存（Save）**：
  - 保存前（Before Save）
  - 保存后（After Save）
  - 提交后（After Commit）

**配置示例**：
```javascript
var scriptConfig = {
    "autoscript": "WORKORDER.SAVE",
    "description": "工单保存时触发",
    "version": "1.0.0",
    "active": true,
    "logLevel": "INFO",
    "scriptLaunchPoints": [
        {
            "launchPointName": "WO_SAVE_BEFORE",
            "launchPointType": "OBJECT",
            "objectName": "WORKORDER",
            "save": true,
            "beforeSave": true,
            "add": true,
            "update": true
        }
    ]
};
```

### 4.2 属性启动点（Attribute Launch Point）
在特定属性（字段）级别触发。

**触发事件**：
- **初始化访问限制（Initialize Access Restriction）**：设置字段访问权限
- **初始化值（Initialize Value）**：设置字段默认值
- **验证（Validate）**：验证字段值
- **检索列表（Retrieve List）**：自定义 LOV（值列表）
- **运行操作（Run Action）**：字段触发的操作

**配置示例**：
```javascript
var scriptConfig = {
    "autoscript": "WORKORDER_STATUS_VALIDATE",
    "description": "工单状态字段验证",
    "scriptLaunchPoints": [
        {
            "launchPointName": "STATUS_VALIDATE",
            "launchPointType": "ATTRIBUTE",
            "objectName": "WORKORDER",
            "attributeName": "STATUS",
            "validate": true
        }
    ]
};
```

### 4.3 操作启动点（Action Launch Point）
由 Maximo 操作（Action）触发，可用于工作流、升级等场景。

**配置示例**：
```javascript
var scriptConfig = {
    "autoscript": "SEND_NOTIFICATION",
    "description": "发送通知操作",
    "scriptLaunchPoints": [
        {
            "launchPointName": "NOTIFY_ACTION",
            "launchPointType": "ACTION",
            "actionName": "SENDNOTIFY"
        }
    ]
};
```

### 4.4 自定义条件启动点（Custom Condition Launch Point）
返回布尔值，用于条件判断（如工作流条件、安全条件等）。

**配置示例**：
```javascript
var scriptConfig = {
    "autoscript": "CHECK_APPROVAL_REQUIRED",
    "description": "检查是否需要审批",
    "scriptLaunchPoints": [
        {
            "launchPointName": "APPROVAL_CONDITION",
            "launchPointType": "CUSTOMCONDITION",
            "objectName": "PR"
        }
    ]
};

// 必须设置 evalresult
evalresult = (mbo.getDouble("LINECOST") > 10000);
```

### 4.5 定时任务启动点（Cron Task Launch Point）
由定时任务触发，用于后台批处理。

---

## 5. JavaScript (Nashorn) 脚本详解

### 5.1 基本结构

```javascript
/*
 * 脚本(AUTOSCRIPT): EXAMPLE_SCRIPT
 * 脚本语言(SCRIPTLANGUAGE): Nashorn
 * 描述(DESCRIPTION): 示例脚本
 * 日志级别(LOGLEVEL): INFO
 * 唯一标识(AUTOSCRIPTID): 100
 * 语言代码(LANGCODE): ZH
 * 用户定义(USERDEFINED): Y
 * 状态(STATUS): 活动
 * 是接口(INTERFACE): N
 * 活动(ACTIVE): Y
 * 变更人(CHANGEBY): MAXADMIN
 * 日期(CHANGEDATE): 2024-01-01 12:00:00
 *
 * Variables: 无
 * Launch Points: 无
 */

// 导入 Java 类
MXServer = Java.type("psdi.server.MXServer");
SqlFormat = Java.type("psdi.mbo.SqlFormat");
MboConstants = Java.type("psdi.mbo.MboConstants");

// 主函数
main();

function main() {
    // 业务逻辑
    service.log_info("脚本开始执行");
    
    // 获取字段值
    var wonum = mbo.getString("WONUM");
    var status = mbo.getString("STATUS");
    
    // 设置字段值
    mbo.setValue("DESCRIPTION", "自动设置的描述");
    
    service.log_info("脚本执行完成");
}

// 脚本配置（用于部署工具）
var scriptConfig = {
    "autoscript": "EXAMPLE_SCRIPT",
    "description": "示例脚本",
    "version": "1.0.0",
    "active": true,
    "logLevel": "INFO"
};
```

### 5.2 常用 API

#### 5.2.1 MBO 操作

```javascript
// 获取字段值
var stringValue = mbo.getString("FIELDNAME");
var intValue = mbo.getInt("FIELDNAME");
var doubleValue = mbo.getDouble("FIELDNAME");
var booleanValue = mbo.getBoolean("FIELDNAME");
var dateValue = mbo.getDate("FIELDNAME");
var bytesValue = mbo.getBytes("FIELDNAME");

// 检查字段是否为空
if (!mbo.isNull("FIELDNAME")) {
    var value = mbo.getString("FIELDNAME");
}

// 设置字段值
mbo.setValue("FIELDNAME", "newValue");
mbo.setValue("FIELDNAME", "newValue", MboConstants.NOACCESSCHECK); // 跳过权限检查
mbo.setValueNull("FIELDNAME"); // 设置为空

// 获取关联 MBO
var relatedMboSet = mbo.getMboSet("RELATIONSHIP_NAME");
relatedMboSet.setWhere("CONDITION = 'VALUE'");
relatedMboSet.reset();

if (!relatedMboSet.isEmpty()) {
    var relatedMbo = relatedMboSet.moveFirst();
    while (relatedMbo) {
        // 处理关联记录
        relatedMbo = relatedMboSet.moveNext();
    }
}

// 获取所有者 MBO
var ownerMbo = mbo.getOwner();
```

#### 5.2.2 查询数据

```javascript
// 创建 MBO 集合
var mboSet = MXServer.getMXServer().getMboSet("WORKORDER", userInfo);

// 设置查询条件
var sqlf = new SqlFormat("wonum = :1 and status = :2");
sqlf.setObject(1, "WORKORDER", "WONUM", "1001");
sqlf.setObject(2, "WORKORDER", "STATUS", "APPR");
mboSet.setWhere(sqlf.format());

// 设置排序
mboSet.setOrderBy("wonum desc");

// 遍历结果
mboSet.reset();
var mbo = mboSet.moveFirst();
while (mbo) {
    service.log_info("工单号: " + mbo.getString("WONUM"));
    mbo = mboSet.moveNext();
}

// 关闭集合（重要！）
mboSet.close();
mboSet.cleanup();
```

#### 5.2.3 异常处理

```javascript
// 方式一：使用 errorkey 和 errorgroup（推荐）
if (mbo.getString("STATUS") == "INVALID") {
    errorgroup = "custom";
    errorkey = "invalidstatus";
    params = ["状态无效"];
}

// 方式二：抛出 MXApplicationException
MXApplicationException = Java.type("psdi.util.MXApplicationException");
throw new MXApplicationException("custom", "invalidstatus", ["状态无效"]);

// 方式三：使用 service.error
service.error("custom", "invalidstatus", ["状态无效"]);
```

#### 5.2.4 日志记录

```javascript
// 不同级别的日志
service.log_debug("调试信息");
service.log_info("普通信息");
service.log_warn("警告信息");
service.log_error("错误信息");

// 使用 logger（更灵活）
MXLoggerFactory = Java.type("psdi.util.logging.MXLoggerFactory");
var logger = MXLoggerFactory.getLogger("maximo.script." + scriptName);
logger.debug("调试信息");
logger.info("普通信息");
```

### 5.3 REST 接口脚本

```javascript
/*
 * 脚本(AUTOSCRIPT): GET_WORKORDER_INFO
 * 脚本语言(SCRIPTLANGUAGE): Nashorn
 * 描述(DESCRIPTION): 获取工单信息的 REST 接口
 * 是接口(INTERFACE): Y
 * 活动(ACTIVE): Y
 */

MXServer = Java.type("psdi.server.MXServer");
SqlFormat = Java.type("psdi.mbo.SqlFormat");

main();

function main() {
    if (httpMethod === "GET") {
        // 从 URL 参数获取工单号
        var wonum = request.getQueryParam("wonum");
        
        if (!wonum) {
            responseBody = JSON.stringify({
                "status": "error",
                "message": "缺少 wonum 参数"
            });
            return;
        }
        
        // 查询工单
        var woSet = MXServer.getMXServer().getMboSet("WORKORDER", userInfo);
        var sqlf = new SqlFormat("wonum = :1");
        sqlf.setObject(1, "WORKORDER", "WONUM", wonum);
        woSet.setWhere(sqlf.format());
        woSet.reset();
        
        if (!woSet.isEmpty()) {
            var wo = woSet.moveFirst();
            var result = {
                "status": "success",
                "data": {
                    "wonum": wo.getString("WONUM"),
                    "description": wo.getString("DESCRIPTION"),
                    "status": wo.getString("STATUS"),
                    "worktype": wo.getString("WORKTYPE")
                }
            };
            responseBody = JSON.stringify(result);
        } else {
            responseBody = JSON.stringify({
                "status": "error",
                "message": "工单不存在"
            });
        }
        
        woSet.close();
        woSet.cleanup();
    } else if (httpMethod === "POST") {
        // 解析请求体
        var requestData = JSON.parse(requestBody);
        
        // 业务逻辑...
        
        responseBody = JSON.stringify({
            "status": "success",
            "message": "操作成功"
        });
    }
}

var scriptConfig = {
    "autoscript": "GET_WORKORDER_INFO",
    "description": "获取工单信息的 REST 接口",
    "version": "1.0.0",
    "active": true,
    "logLevel": "INFO"
};
```

**调用示例**：
```bash
curl -X GET \
  "http://maximo-server/maximo/oslc/script/GET_WORKORDER_INFO?wonum=1001" \
  -H "MAXAUTH: bWF4YWRtaW46MTIzNDU2" \
  -H "Content-Type: application/json"
```

---

## 6. Python (Jython) 脚本详解

### 6.1 基本结构

```python
"""
脚本(AUTOSCRIPT): EXAMPLE_PYTHON_SCRIPT
脚本语言(SCRIPTLANGUAGE): Jython
描述(DESCRIPTION): Python 示例脚本
日志级别(LOGLEVEL): INFO
唯一标识(AUTOSCRIPTID): 101            语言代码(LANGCODE): ZH
用户定义(USERDEFINED): Y               状态(STATUS): 活动
是接口(INTERFACE): N                  活动(ACTIVE): Y
变更人(CHANGEBY): MAXADMIN
日期(CHANGEDATE): 2024-01-01 12:00:00

Variables: 无
Launch Points: 无
"""

# 导入 Java 类
from psdi.server import MXServer
from psdi.mbo import SqlFormat, MboConstants
from psdi.util import MXApplicationException

# 主逻辑
service.log_info("Python 脚本开始执行")

# 获取字段值
wonum = mbo.getString("WONUM")
status = mbo.getString("STATUS")

# 设置字段值
mbo.setValue("DESCRIPTION", "自动设置的描述")

service.log_info("Python 脚本执行完成")

scriptConfig="""{
    "autoscript": "EXAMPLE_PYTHON_SCRIPT",
    "description": "Python 示例脚本",
    "version": "1.0.0",
    "active": true,
    "logLevel": "INFO"
}"""
```

### 6.2 中文字符处理

```python
# Python 脚本中使用中文需要 decode
statusTmp = '活动'.decode('utf-8')
mbo.setValue('STATUS', statusTmp)

description = '这是中文描述'.decode('utf-8')
mbo.setValue('DESCRIPTION', description)

# 在异常消息中使用中文
errorgroup = 'custom'
errorkey = 'errmsg'
params = ["值不能为空".decode('utf-8')]
```

### 6.3 常用 API

```python
# MBO 操作
string_value = mbo.getString("FIELDNAME")
int_value = mbo.getInt("FIELDNAME")
double_value = mbo.getDouble("FIELDNAME")
boolean_value = mbo.getBoolean("FIELDNAME")

# 设置值
mbo.setValue("FIELDNAME", "new_value")
mbo.setValue("FIELDNAME", "new_value", MboConstants.NOACCESSCHECK)

# 查询数据
mxserver = MXServer.getMXServer()
mbo_set = mxserver.getMboSet("WORKORDER", userInfo)

sqlf = SqlFormat("wonum = :1")
sqlf.setObject(1, "WORKORDER", "WONUM", "1001")
mbo_set.setWhere(sqlf.format())
mbo_set.reset()

if not mbo_set.isEmpty():
    mbo = mbo_set.moveFirst()
    while mbo:
        service.log_info("工单号: " + mbo.getString("WONUM"))
        mbo = mbo_set.moveNext()

mbo_set.close()
mbo_set.cleanup()

# 异常处理
from psdi.util import MXApplicationException
raise MXApplicationException('custom', 'errmsg', ['错误消息'.decode('utf-8')])

# 或使用隐式变量
errorgroup = 'custom'
errorkey = 'errmsg'
params = ['错误消息'.decode('utf-8')]
```

---

## 7. 常用场景示例

### 7.1 字段默认值设置

**场景**：新建工单时根据工单类型自动设置描述

```javascript
/*
 * 脚本(AUTOSCRIPT): WORKORDER.NEW
 * 脚本语言(SCRIPTLANGUAGE): Nashorn
 * 描述(DESCRIPTION): 新建工单时设置默认值
 */

main();

function main() {
    if (onadd) {
        var worktype = mbo.getString("WORKTYPE");
        
        if (worktype == "WT") {
            mbo.setValue("DESCRIPTION", "工作票类型工单");
        } else if (worktype == "PM") {
            mbo.setValue("DESCRIPTION", "预防性维护工单");
        }
        
        // 设置默认优先级
        if (mbo.isNull("PRIORITY")) {
            mbo.setValue("PRIORITY", 5);
        }
    }
}

var scriptConfig = {
    "autoscript": "WORKORDER.NEW",
    "description": "新建工单时设置默认值",
    "version": "1.0.0",
    "active": true,
    "logLevel": "INFO",
    "scriptLaunchPoints": [
        {
            "launchPointName": "WO_NEW_INIT",
            "launchPointType": "OBJECT",
            "objectName": "WORKORDER",
            "initializeValue": true
        }
    ]
};
```

### 7.2 字段验证

**场景**：验证工单状态转换是否合法

```javascript
/*
 * 脚本(AUTOSCRIPT): WORKORDER_STATUS_VALIDATE
 * 脚本语言(SCRIPTLANGUAGE): Nashorn
 * 描述(DESCRIPTION): 工单状态验证
 */

MXApplicationException = Java.type("psdi.util.MXApplicationException");

main();

function main() {
    var newStatus = mbo.getString("STATUS");
    var oldStatus = mbo.getPreviousValue("STATUS");
    
    // 定义合法的状态转换
    var validTransitions = {
        "WAPPR": ["APPR", "CAN"],
        "APPR": ["INPRG", "CAN"],
        "INPRG": ["COMP", "CLOSE"],
        "COMP": ["CLOSE"]
    };
    
    if (oldStatus && validTransitions[oldStatus]) {
        if (validTransitions[oldStatus].indexOf(newStatus) === -1) {
            throw new MXApplicationException(
                "custom", 
                "invalidtransition", 
                ["不允许从 " + oldStatus + " 转换到 " + newStatus]
            );
        }
    }
}

var scriptConfig = {
    "autoscript": "WORKORDER_STATUS_VALIDATE",
    "description": "工单状态验证",
    "version": "1.0.0",
    "active": true,
    "logLevel": "WARN",
    "scriptLaunchPoints": [
        {
            "launchPointName": "STATUS_VAL",
            "launchPointType": "ATTRIBUTE",
            "objectName": "WORKORDER",
            "attributeName": "STATUS",
            "validate": true
        }
    ]
};
```

### 7.3 自定义 LOV（值列表）

**场景**：根据条件过滤位置选择列表

```javascript
/*
 * 脚本(AUTOSCRIPT): LOCATION_FILTER_LOV
 * 脚本语言(SCRIPTLANGUAGE): Nashorn
 * 描述(DESCRIPTION): 动态过滤位置列表
 */

main();

function main() {
    // 设置关系和过滤条件
    relationObject = "LOCATIONS";
    relationWhere = "LOCATION=:LOCATION";
    
    // 获取所有者 MBO
    var ownerMbo = mbo.getOwner();
    
    // 根据条件添加额外过滤
    if (ownerMbo && !ownerMbo.isNull("SITEID")) {
        var siteId = ownerMbo.getString("SITEID");
        listWhere = "siteid = '" + siteId + "' and status = 'ACTIVE'";
    }
}

var scriptConfig = {
    "autoscript": "LOCATION_FILTER_LOV",
    "description": "动态过滤位置列表",
    "version": "1.0.0",
    "active": true,
    "logLevel": "INFO",
    "scriptLaunchPoints": [
        {
            "launchPointName": "LOC_LOV_FILTER",
            "launchPointType": "ATTRIBUTE",
            "objectName": "ASSET",
            "attributeName": "LOCATION",
            "retrieveList": true
        }
    ]
};
```

### 7.4 保存前业务逻辑

**场景**：保存工单前自动计算总成本

```javascript
/*
 * 脚本(AUTOSCRIPT): WORKORDER_CALC_COST
 * 脚本语言(SCRIPTLANGUAGE): Nashorn
 * 描述(DESCRIPTION): 自动计算工单总成本
 */

main();

function main() {
    if (onsave && (onadd || onupdate)) {
        var totalCost = 0;
        
        // 计算人工成本
        var laborSet = mbo.getMboSet("LABTRANS");
        laborSet.reset();
        var labor = laborSet.moveFirst();
        while (labor) {
            totalCost += labor.getDouble("LINETOTAL");
            labor = laborSet.moveNext();
        }
        
        // 计算材料成本
        var materialSet = mbo.getMboSet("MATUSETRANS");
        materialSet.reset();
        var material = materialSet.moveFirst();
        while (material) {
            totalCost += material.getDouble("LINETOTAL");
            material = materialSet.moveNext();
        }
        
        // 设置总成本
        mbo.setValue("ACTTOTALCOST", totalCost);
        
        service.log_info("工单总成本已更新: " + totalCost);
    }
}

var scriptConfig = {
    "autoscript": "WORKORDER_CALC_COST",
    "description": "自动计算工单总成本",
    "version": "1.0.0",
    "active": true,
    "logLevel": "INFO",
    "scriptLaunchPoints": [
        {
            "launchPointName": "WO_CALC_COST",
            "launchPointType": "OBJECT",
            "objectName": "WORKORDER",
            "save": true,
            "beforeSave": true,
            "add": true,
            "update": true
        }
    ]
};
```

### 7.5 发送邮件通知

**场景**：工单状态变更时发送邮件

```javascript
/*
 * 脚本(AUTOSCRIPT): WORKORDER_EMAIL_NOTIFY
 * 脚本语言(SCRIPTLANGUAGE): Nashorn
 * 描述(DESCRIPTION): 工单状态变更邮件通知
 */

MXServer = Java.type("psdi.server.MXServer");

main();

function main() {
    if (onupdate) {
        var newStatus = mbo.getString("STATUS");
        var oldStatus = mbo.getPreviousValue("STATUS");
        
        // 只在状态变更为 APPROVED 时发送
        if (newStatus == "APPR" && oldStatus != "APPR") {
            sendEmailNotification();
        }
    }
}

function sendEmailNotification() {
    try {
        var emailService = MXServer.getMXServer().lookup("MAIL");
        
        var wonum = mbo.getString("WONUM");
        var description = mbo.getString("DESCRIPTION");
        var owner = mbo.getString("OWNER");
        
        // 获取负责人邮箱
        var personSet = MXServer.getMXServer().getMboSet("PERSON", userInfo);
        personSet.setWhere("personid = '" + owner + "'");
        personSet.reset();
        
        if (!personSet.isEmpty()) {
            var person = personSet.moveFirst();
            var email = person.getString("EMAIL");
            
            if (email) {
                var subject = "工单 " + wonum + " 已批准";
                var body = "工单编号: " + wonum + "\n";
                body += "描述: " + description + "\n";
                body += "状态: 已批准\n";
                body += "请及时处理。";
                
                emailService.sendMail(email, subject, body);
                service.log_info("邮件已发送到: " + email);
            }
        }
        
        personSet.close();
        personSet.cleanup();
    } catch (e) {
        service.log_error("发送邮件失败: " + e.message);
    }
}

var scriptConfig = {
    "autoscript": "WORKORDER_EMAIL_NOTIFY",
    "description": "工单状态变更邮件通知",
    "version": "1.0.0",
    "active": true,
    "logLevel": "INFO",
    "scriptLaunchPoints": [
        {
            "launchPointName": "WO_EMAIL_AFTER_SAVE",
            "launchPointType": "OBJECT",
            "objectName": "WORKORDER",
            "save": true,
            "afterSave": true,
            "update": true
        }
    ]
};
```

### 7.6 工作流条件脚本

**场景**：判断采购申请是否需要经理审批

```javascript
/*
 * 脚本(AUTOSCRIPT): PR_CHECK_APPROVAL
 * 脚本语言(SCRIPTLANGUAGE): Nashorn
 * 描述(DESCRIPTION): 检查采购申请是否需要审批
 */

main();

function main() {
    var lineCost = mbo.getDouble("LINECOST");
    var quantity = mbo.getDouble("QUANTITY");
    var totalAmount = lineCost * quantity;
    
    // 金额超过 10000 需要审批
    evalresult = (totalAmount > 10000);
    
    service.log_info("采购金额: " + totalAmount + ", 需要审批: " + evalresult);
}

var scriptConfig = {
    "autoscript": "PR_CHECK_APPROVAL",
    "description": "检查采购申请是否需要审批",
    "version": "1.0.0",
    "active": true,
    "logLevel": "INFO",
    "scriptLaunchPoints": [
        {
            "launchPointName": "PR_APPROVAL_COND",
            "launchPointType": "CUSTOMCONDITION",
            "objectName": "PRLINE"
        }
    ]
};
```

### 7.7 定时任务脚本

**场景**：每天清理过期的临时数据

```javascript
/*
 * 脚本(AUTOSCRIPT): CLEANUP_TEMP_DATA
 * 脚本语言(SCRIPTLANGUAGE): Nashorn
 * 描述(DESCRIPTION): 清理过期临时数据
 */

MXServer = Java.type("psdi.server.MXServer");
SqlFormat = Java.type("psdi.mbo.SqlFormat");
Date = Java.type("java.util.Date");
Calendar = Java.type("java.util.Calendar");

main();

function main() {
    service.log_info("开始清理过期临时数据");
    
    try {
        // 计算 7 天前的日期
        var cal = Calendar.getInstance();
        cal.add(Calendar.DAY_OF_MONTH, -7);
        var cutoffDate = cal.getTime();
        
        // 清理过期的临时工单
        var woSet = MXServer.getMXServer().getMboSet("WORKORDER", 
            MXServer.getMXServer().getSystemUserInfo());
        
        var sqlf = new SqlFormat("status = :1 and createdate < :2");
        sqlf.setObject(1, "WORKORDER", "STATUS", "TEMP");
        sqlf.setObject(2, "WORKORDER", "CREATEDATE", cutoffDate);
        woSet.setWhere(sqlf.format());
        woSet.reset();
        
        var count = 0;
        var wo = woSet.moveFirst();
        while (wo) {
            wo.delete();
            count++;
            wo = woSet.moveNext();
        }
        
        woSet.save();
        woSet.close();
        woSet.cleanup();
        
        service.log_info("清理完成，共删除 " + count + " 条记录");
    } catch (e) {
        service.log_error("清理失败: " + e.message);
    }
}

var scriptConfig = {
    "autoscript": "CLEANUP_TEMP_DATA",
    "description": "清理过期临时数据",
    "version": "1.0.0",
    "active": true,
    "logLevel": "INFO"
};
```

### 7.8 REST API 数据查询

**场景**：提供工单统计信息的 REST 接口

```javascript
/*
 * 脚本(AUTOSCRIPT): WO_STATISTICS_API
 * 脚本语言(SCRIPTLANGUAGE): Nashorn
 * 描述(DESCRIPTION): 工单统计信息 API
 * 是接口(INTERFACE): Y
 * 活动(ACTIVE): Y
 */

MXServer = Java.type("psdi.server.MXServer");
SqlFormat = Java.type("psdi.mbo.SqlFormat");

main();

function main() {
    if (httpMethod !== "GET") {
        responseBody = JSON.stringify({
            "status": "error",
            "message": "仅支持 GET 方法"
        });
        return;
    }
    
    try {
        var siteId = request.getQueryParam("siteid");
        var startDate = request.getQueryParam("startdate");
        var endDate = request.getQueryParam("enddate");
        
        var woSet = MXServer.getMXServer().getMboSet("WORKORDER", userInfo);
        
        // 构建查询条件
        var whereClause = "1=1";
        if (siteId) {
            whereClause += " and siteid = '" + siteId + "'";
        }
        if (startDate) {
            whereClause += " and reportdate >= to_date('" + startDate + "', 'YYYY-MM-DD')";
        }
        if (endDate) {
            whereClause += " and reportdate <= to_date('" + endDate + "', 'YYYY-MM-DD')";
        }
        
        woSet.setWhere(whereClause);
        woSet.reset();
        
        // 统计数据
        var stats = {
            "total": 0,
            "byStatus": {},
            "byWorkType": {}
        };
        
        var wo = woSet.moveFirst();
        while (wo) {
            stats.total++;
            
            var status = wo.getString("STATUS");
            stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
            
            var worktype = wo.getString("WORKTYPE");
            stats.byWorkType[worktype] = (stats.byWorkType[worktype] || 0) + 1;
            
            wo = woSet.moveNext();
        }
        
        woSet.close();
        woSet.cleanup();
        
        responseBody = JSON.stringify({
            "status": "success",
            "data": stats
        }, null, 2);
        
    } catch (e) {
        responseBody = JSON.stringify({
            "status": "error",
            "message": e.message
        });
        service.log_error("API 调用失败: " + e.message);
    }
}

var scriptConfig = {
    "autoscript": "WO_STATISTICS_API",
    "description": "工单统计信息 API",
    "version": "1.0.0",
    "active": true,
    "logLevel": "INFO"
};
```

**调用示例**：
```bash
curl -X GET \
  "http://maximo-server/maximo/oslc/script/WO_STATISTICS_API?siteid=BEDFORD&startdate=2024-01-01&enddate=2024-12-31" \
  -H "MAXAUTH: bWF4YWRtaW46MTIzNDU2" \
  -H "Accept: application/json"
```

### 7.9 CSV 文件读取和数据转换

**场景**：读取固定宽度 CSV 文件，转换格式后输出为新 CSV

```javascript
/**
 * 脚本(AUTOSCRIPT): MTR_INEAMSTOCK_DATAFORMATION
 * 脚本语言(SCRIPTLANGUAGE): Nashorn
 * 描述(DESCRIPTION): 读取CSV并转换格式
 */

load('nashorn:mozilla_compat.js');
importPackage(java.lang);
importPackage(java.io);
importPackage(java.nio.file);
importClass(Packages.java.text.SimpleDateFormat);
importClass(Packages.java.util.Date);
importClass(Packages.psdi.server.MXServer);

var sdfss = new SimpleDateFormat("yyyyMMddHHmmss");
var date1 = new Date();
var sdate = sdfss.format(date1);

var br = null;
var bw = null;
var intTransMboSet = null;

try {
    // 获取配置的输出路径
    var fileoutpath = "";
    var mxServer = MXServer.getMXServer();
    var crontaskParamSetRemote = mxServer.getMboSet("CRONTASKPARAM", 
        mxServer.getSystemUserInfo());
    crontaskParamSetRemote.setWhere(
        "crontaskname='FLATFILECONSUMER' and parameter='SOURCEDIRECTORY'");
    crontaskParamSetRemote.reset();
    
    if (!crontaskParamSetRemote.isEmpty()) {
        fileoutpath = crontaskParamSetRemote.getMbo(0).getString("value");
    }
    crontaskParamSetRemote.close();
    
    // 读取源 CSV 文件
    br = new BufferedReader(new FileReader(filePath));
    var myObj = new File(fileoutpath + "/inventory--" + sdate + ".csv");
    var fos = new FileOutputStream(myObj);
    bw = new BufferedWriter(new OutputStreamWriter(fos));
    
    // 写入 CSV 头部
    bw.write(extSystems + ",MTR_INVENTORT,,ZH");
    bw.newLine();
    bw.write("ITEMNUM,LOCATION,SITEID,ITEMSETID,CURBAL,ORDERUNIT,ISSUEUNIT," +
        "UNITCOST,MTR_EXPIRY_DATE,ITEMTYPE,MTR_ORDER_ON_DEMAND," +
        "STATUS,CLASSSTRUCTUREID,DELIVERYTIME,MTR_CROSS_REF," +
        "MTR_CENTRALIZED_SUBINVENTORY,MTR_TAG,TRANSLOGID,ITEMDESCRIPTION");
    bw.newLine();
    
    // 创建集成日志记录
    intTransMboSet = MXServer.getMXServer().getMboSet("MTR_INTLOG", 
        MXServer.getMXServer().getSystemUserInfo());
    var intTransMbo = intTransMboSet.add();
    var translogid = intTransMbo.getUniqueIDValue();
    
    intTransMbo.setValue("SYSTEMID", extSystems);
    intTransMbo.setValue("STARTDATE", MXServer.getMXServer().getDate());
    intTransMbo.setValue("INTNO", "028");
    intTransMbo.setValue("TRANSTYPE", "IN");
    intTransMbo.setValue("DIRECTORY", fileoutpath);
    intTransMbo.setValue("FILENAME", "inventory--" + sdate + ".csv");
    
    var i = 0;
    var line;
    
    // 逐行读取并解析固定宽度字段
    while ((line = br.readLine()) != null) {
        i++;
        
        // 按固定位置截取字段
        var itemnum = line.substring(0, 15).trim();
        var description = line.substring(15, 375)
            .replaceAll(",", "||")  // 替换逗号避免 CSV 冲突
            .replaceAll("\"", "~~")  // 替换引号
            .trim();
        var curbal = line.substring(375, 387).trim();
        var issueunit = line.substring(387, 417).trim().toUpperCase();
        var unitcost = line.substring(417, 429).trim();
        var mtr_expiry_date = line.substring(429, 439).trim();
        var itemtype = line.substring(439, 469).trim();
        var mtr_order_on_demand = line.substring(469, 470).trim();
        var status = line.substring(470, 485).trim();
        var classstructureid = line.substring(485, 689).trim();
        var deliverytime = line.substring(689, 698).trim();
        var mtr_cross_ref = line.substring(698, 723).trim();
        var mtr_centralized_subinventory = line.substring(723, 927).trim();
        var mtr_tag = line.substring(927).trim();
        
        // 数据转换
        itemtype = "ITEM";  // 统一设置为 ITEM
        
        if ("Y".equals(status)) {
            status = "ACTIVE";
        } else if ("N".equals(status)) {
            status = "PENDING";
        }
        
        classstructureid = "";  // 清空该字段
        
        // 组装新 CSV 行
        var lineFile = itemnum + "," + storeRoom + "," + siteid + "," + itemsetID +
            "," + curbal + "," + issueunit + "," + issueunit + "," + unitcost +
            "," + mtr_expiry_date + "," + itemtype + "," + mtr_order_on_demand +
            "," + status + "," + classstructureid + "," + deliverytime +
            "," + mtr_cross_ref + "," + mtr_centralized_subinventory +
            "," + mtr_tag + "," + translogid + "," + description;
        
        bw.write(lineFile);
        bw.newLine();
    }
    
    bw.close();
    br.close();
    
    // 更新集成日志
    intTransMbo.setValue("TOTALCNT", i);
    intTransMbo.setValue("ENDDATE", MXServer.getMXServer().getDate());
    intTransMboSet.save();
    intTransMboSet.close();
    
} catch (e) {
    System.err.println(e.message);
    
    // 记录错误日志
    if (intTransMbo) {
        intTransMbo.setValue("SYSTEMID", extSystems);
        intTransMbo.setValue("ENDDATE", MXServer.getMXServer().getDate());
        intTransMbo.setValue("INTNO", "028");
        intTransMbo.setValue("TRANSTYPE", "IN");
        intTransMbo.setValue("MESSAGE", e.message);
        intTransMboSet.save();
        intTransMboSet.close();
    }
} finally {
    // 确保资源关闭
    if (bw != null) {
        try { bw.close(); } catch (e) { System.err.print(e.message); }
    }
    if (br != null) {
        try { br.close(); } catch (e) { System.err.print(e.message); }
    }
    if (intTransMboSet != null) {
        try { intTransMboSet.close(); } catch (e) { System.err.print(e.message); }
    }
}
```

**关键点**：
- 使用 `substring()` 按固定宽度解析字段
- 特殊字符处理：逗号替换为 `||`，引号替换为 `~~`
- 从 Maximo 配置表（CRONTASKPARAM）获取路径配置
- 集成日志记录（MTR_INTLOG）跟踪处理过程
- 完善的异常处理和资源清理

---

### 7.10 生成 Excel 并上传 FTP

**场景**：查询工单数据，生成 Excel 报表并上传到 FTP 服务器

**依赖库**：Apache POI, Apache Commons Net (FTP)

```javascript
/**
 * 脚本(AUTOSCRIPT): OUTEROC_EXPORT
 * 脚本语言(SCRIPTLANGUAGE): Nashorn
 * 描述(DESCRIPTION): 导出工单PM信息到EROC系统
 */

load('nashorn:mozilla_compat.js');
importPackage(java.lang);
importPackage(java.io);
importClass(Packages.java.text.SimpleDateFormat);
importClass(Packages.java.util.Calendar);
importClass(Packages.java.util.Date);
importClass(Packages.psdi.mbo.MboConstants);
importClass(Packages.psdi.server.MXServer);
importClass(Packages.org.apache.poi.ss.usermodel.CellStyle);
importClass(Packages.org.apache.poi.ss.usermodel.Font);
importClass(Packages.org.apache.poi.ss.usermodel.Row);
importClass(Packages.org.apache.poi.ss.usermodel.Sheet);
importClass(Packages.org.apache.poi.ss.usermodel.Workbook);
importClass(Packages.org.apache.poi.xssf.usermodel.XSSFWorkbook);
importClass(Packages.org.apache.commons.net.ftp.FTPClient);
importClass(Packages.org.apache.commons.net.ftp.FTPReply);
importClass(Packages.org.apache.commons.net.ftp.FTP);
importClass(Packages.org.apache.commons.net.ftp.FTPClientConfig);

var ftpClient = null;
var HOSTNAME = ftpHostname;   // 从脚本变量获取
var PORT = ftpPort;
var USERNAME = ftpUsername;
var PASSWORD = ftpPassword;

var woMboSet = null;
var pmMboSet = null;
var outputStreamExcel = null;
var bwctf = null;

// 获取部门参数
var department = request.getQueryParam("department");

var sdfss = new SimpleDateFormat("yyyyMMddHHmmss");
var sdf8 = new SimpleDateFormat("yyyyMMdd");
var date1 = new Date();
var sdate = sdfss.format(date1);
var sdate8 = sdf8.format(date1);

var startDate = MXServer.getMXServer().getDate();
var filename = "MMS_TO_EROC_" + sdate8 + ".xlsx";
var filectfname = "OUTEROC_intfTemp" + date1.getTime() + ".ctf";

try {
    // 构建查询条件（根据部门）
    var sqlWhereWo = buildQuery(department);
    
    // 初始化 FTP 连接
    initFtpClient();
    ftpClient.enterLocalPassiveMode();
    
    // 获取本地文件路径
    var localPath = getFlatFilePath();
    
    // 查询工单数据
    woMboSet = MXServer.getMXServer().getMboSet("WORKORDER", 
        MXServer.getMXServer().getSystemUserInfo());
    woMboSet.setWhere(sqlWhereWo);
    woMboSet.setOrderBy("wonum");
    woMboSet.reset();
    
    // 创建 Excel 工作簿
    var myObj = new File(localPath + filename);
    var fos = new FileOutputStream(myObj);
    var workbook = new XSSFWorkbook();
    var sheet1 = workbook.createSheet("EROC_Data");
    
    // 创建表头样式
    var headerFont = workbook.createFont();
    var style = workbook.createCellStyle();
    style.setWrapText(true);
    
    // 写入表头（33列）
    var row = sheet1.createRow(0);
    row.createCell(0).setCellValue("Section");
    row.createCell(1).setCellValue("Unit");
    row.createCell(2).setCellValue("Work Group");
    row.createCell(3).setCellValue("Standard Job Description");
    row.createCell(4).setCellValue("Time Interval");
    row.createCell(5).setCellValue("Equipment Number");
    row.createCell(6).setCellValue("Equipment Number Description");
    row.createCell(7).setCellValue("Critical PM");
    row.createCell(8).setCellValue("Tolerance (Day)");
    row.createCell(9).setCellValue("Tolerance (%)");
    row.createCell(10).setCellValue("Backlog Date");
    row.createCell(11).setCellValue("ROC Registration No.");
    row.createCell(12).setCellValue("ROC Expired Period");
    row.createCell(13).setCellValue("Expected Done Date");
    row.createCell(14).setCellValue("Error Message");
    row.createCell(15).setCellValue("Work Order No");
    row.createCell(16).setCellValue("Status");
    // ... 更多列
    
    // 填充工单数据
    var cc = 1;
    for (var i = 0; i < woMboSet.count(); i++) {
        var woMbo = woMboSet.getMbo(i);
        var row1 = sheet1.createRow(cc);
        
        row1.createCell(2).setCellValue(woMbo.getString("PERSONGROUP"));
        row1.createCell(3).setCellValue(
            woMbo.getString("WO_REV_JOBPLAN.DESCRIPTION"));
        row1.createCell(4).setCellValue(
            woMbo.getDouble("MTR_TIME_INTERVAL_DAY"));
        row1.createCell(5).setCellValue(woMbo.getString("ASSETNUM"));
        row1.createCell(6).setCellValue(
            woMbo.getString("ASSET.DESCRIPTION"));
        
        // 关联资产信息
        var assetMboSet = woMbo.getMboSet("ASSET");
        if (!assetMboSet.isEmpty()) {
            row1.createCell(7).setCellValue(
                woMbo.getBoolean("ASSET.MTR_SAFETYITEM") ? "Y" : "N");
            row1.createCell(27).setCellValue(
                woMbo.getBoolean("ASSET.MTR_STATUTORY") ? "Y" : "N");
        }
        
        row1.createCell(15).setCellValue(woMbo.getString("WONUM"));
        row1.createCell(16).setCellValue(woMbo.getString("STATUS"));
        row1.createCell(20).setCellValue(
            parseDate(woMbo.getDate("REPORTDATE")));
        row1.createCell(21).setCellValue(woMbo.getString("DESCRIPTION"));
        row1.createCell(22).setCellValue(
            parseDate(woMbo.getDate("SCHEDSTART")));
        row1.createCell(23).setCellValue(
            parseDate(woMbo.getDate("SCHEDFINISH")));
        // ... 更多字段
        
        cc++;
    }
    
    // IMD 部门额外处理：查询不同时间范围的工单和 PM
    if ("IMD".equals(department)) {
        // 查询超过30天的已完成工单
        woMboSet.setWhere(sqlWhereWo30);
        woMboSet.setOrderBy("actfinish desc");
        woMboSet.reset();
        cc = setCellValue(woMboSet, sheet1, cc, 1);
        
        // 查询7-30天的工单
        woMboSet.setWhere(sqlWhereWo730);
        woMboSet.reset();
        cc = setCellValue(woMboSet, sheet1, cc, 2);
        
        // 查询7天内的工单
        woMboSet.setWhere(sqlWhereWo7);
        woMboSet.reset();
        cc = setCellValue(woMboSet, sheet1, cc, 3);
        
        // 查询未生成工单的 PM
        pmMboSet = MXServer.getMXServer().getMboSet("PM", 
            MXServer.getMXServer().getSystemUserInfo());
        pmMboSet.setWhere(sqlWherePm);
        pmMboSet.setOrderBy("pmnum");
        pmMboSet.reset();
        
        for (var i = 0; i < pmMboSet.count(); i++) {
            var pmMbo = pmMboSet.getMbo(i);
            var row1 = sheet1.createRow(cc);
            
            row1.createCell(2).setCellValue(pmMbo.getString("PERSONGROUP"));
            row1.createCell(3).setCellValue(
                pmMbo.getString("JOBPLAN.DESCRIPTION"));
            row1.createCell(5).setCellValue(pmMbo.getString("ASSETNUM"));
            // ... 填充 PM 数据
            
            cc++;
        }
    }
    
    // 写入 Excel 文件
    outputStreamExcel = new FileOutputStream(myObj);
    workbook.write(outputStreamExcel);
    workbook.close();
    outputStreamExcel.flush();
    outputStreamExcel.close();
    
    woMboSet.close();
    if (pmMboSet != null) pmMboSet.close();
    
    // 生成 CTF 控制文件
    var sdfHHmm = new SimpleDateFormat("yyyyMMddHHmm");
    var ctfObj = new File(localPath + filectfname);
    var fosctf = new FileOutputStream(ctfObj);
    bwctf = new BufferedWriter(new OutputStreamWriter(fosctf));
    
    bwctf.write("NAME=\"Interface to export WO and PM Information to EROC\"" +
        "\nDATE=" + sdfHHmm.format(date1) +
        "\nFILE[0]=MMS_TO_EROC_" + sdate8 + ".xlsx" +
        "\nTARGET_SYSTEM[0]=MMS" +
        "\n:");
    bwctf.close();
    
    // 上传文件到 FTP
    var file = new File(localPath + filename);
    var filectf = new File(localPath + filectfname);
    var inputStream = new FileInputStream(file);
    var inputStreamCtf = new FileInputStream(filectf);
    
    ftpClient.changeWorkingDirectory(ftpOutPath);
    ftpClient.storeFile(filename, inputStream);
    ftpClient.storeFile(filectfname, inputStreamCtf);
    
    inputStream.close();
    inputStreamCtf.close();
    
    // 删除本地临时文件
    myObj.delete();
    ctfObj.delete();
    
    ftpClient.disconnect();
    
} catch (e) {
    // 记录错误日志
    execLog("EROC", startDate, "033", "OUT", ftpOutPath, "", 
        e.message, "FAILED");
} finally {
    // 资源清理
    if (outputStreamExcel != null) {
        try { outputStreamExcel.close(); } catch (e) {}
    }
    if (bwctf != null) {
        try { bwctf.close(); } catch (e) {}
    }
    if (woMboSet != null) {
        try { woMboSet.close(); } catch (e) {}
    }
    if (pmMboSet != null) {
        try { pmMboSet.close(); } catch (e) {}
    }
    if (ftpClient != null && ftpClient.isConnected()) {
        ftpClient.disconnect();
    }
}

// 辅助函数：初始化 FTP 客户端
function initFtpClient() {
    ftpClient = new FTPClient();
    ftpClient.setControlEncoding("utf-8");
    ftpClient.connect(HOSTNAME, PORT);
    ftpClient.login(USERNAME, PASSWORD);
    ftpClient.setFileType(2);  // BINARY_FILE_TYPE
    
    var cfg = new FTPClientConfig(
        ftpClient.getSystemName().split(" ")[0]);
    cfg.setServerLanguageCode("en_US");
    ftpClient.configure(cfg);
    
    var replyCode = ftpClient.getReplyCode();
    if (!FTPReply.isPositiveCompletion(replyCode)) {
        throw new Error("FTP connection failed");
    }
}

// 辅助函数：获取文件路径配置
function getFlatFilePath() {
    var flatFilePath = "";
    var mxServer = MXServer.getMXServer();
    var crontaskParamSetRemote = mxServer.getMboSet("CRONTASKPARAM", 
        mxServer.getSystemUserInfo());
    
    crontaskParamSetRemote.setWhere(
        "crontaskname='FLATFILECONSUMER' and parameter='SOURCEDIRECTORY'");
    crontaskParamSetRemote.reset();
    
    if (!crontaskParamSetRemote.isEmpty()) {
        flatFilePath = crontaskParamSetRemote.getMbo(0).getString("value");
        if (!flatFilePath.endsWith("/")) {
            flatFilePath += "/";
        }
    }
    crontaskParamSetRemote.close();
    return flatFilePath;
}

// 辅助函数：日期格式化
function parseDate(date) {
    if (date == null) return "";
    var sdfss = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
    return sdfss.format(date);
}

// 辅助函数：记录集成日志
function execLog(extSystems, startDate, intno, transtype, directory, 
                 filename, message, status) {
    var intTransMboSet = MXServer.getMXServer().getMboSet("MTR_INTLOG", 
        MXServer.getMXServer().getSystemUserInfo());
    var intTransMbo = intTransMboSet.add();
    
    intTransMbo.setValue("SYSTEMID", extSystems);
    intTransMbo.setValue("STARTDATE", startDate);
    intTransMbo.setValue("INTNO", intno);
    intTransMbo.setValue("TRANSTYPE", transtype);
    intTransMbo.setValue("DIRECTORY", directory);
    intTransMbo.setValue("FILENAME", filename);
    intTransMbo.setValue("TOTALCNT", 1);
    intTransMbo.setValue("ENDDATE", MXServer.getMXServer().getDate());
    
    if (message != null && message.length() > 500) {
        message = message.substring(0, 500);
    }
    intTransMbo.setValue("MESSAGE", message);
    
    intTransMboSet.save();
    intTransMboSet.close();
}

// 辅助函数：构建查询条件
function buildQuery(department) {
    if ("RSMD".equals(department)) {
        return "(woclass = 'WORKORDER' or woclass = 'ACTIVITY') " +
            "and istask = 0 and siteid = 'MTR-HKTS'" +
            " and WORKTYPE='PM' and status in ('OP','OPEN') " +
            "and PERSONGROUP like 'MR%'";
    } else if ("FMD".equals(department)) {
        return "(woclass = 'WORKORDER' or woclass = 'ACTIVITY') " +
            "and istask = 0 and siteid = 'MTR-HKTS'" +
            " and WORKTYPE='PM' and status in ('OP','OPEN') " +
            "and (PERSONGROUP like 'MOSM%' or PERSONGROUP like 'CO%' " +
            "or PERSONGROUP like 'DO%')";
    } else if ("IMD".equals(department)) {
        return "(woclass = 'WORKORDER' or woclass = 'ACTIVITY') " +
            "and istask = 0 and siteid = 'MTR-HKTS'" +
            " and ((WORKTYPE='PM' and status in (select value from " +
            "synonymdomain where domainid='WOSTATUS'" +
            " and maxvalue not in ('CLOSE','COMP'))" +
            " and PERSONGROUP like 'MI%' and mtr_jobnature not in " +
            "('CP','CF','CR'))" +
            " or (WORKTYPE='CM' and status in ('OP','OPEN') " +
            "and mtr_jobnature in ('CP','CF','CR')))";
    }
    return "1=2";  // 默认返回空结果
}

// 辅助函数：填充单元格数据（复用代码）
function setCellValue(woMboSet, sheet1, cc, fetchnum) {
    for (var i = 0; i < woMboSet.count(); i++) {
        if (i > fetchnum) break;
        
        var woMbo = woMboSet.getMbo(i);
        var row1 = sheet1.createRow(cc);
        
        row1.createCell(2).setCellValue(woMbo.getString("PERSONGROUP"));
        row1.createCell(3).setCellValue(
            woMbo.getString("WO_REV_JOBPLAN.DESCRIPTION"));
        row1.createCell(4).setCellValue(
            woMbo.getDouble("MTR_TIME_INTERVAL_DAY"));
        row1.createCell(5).setCellValue(woMbo.getString("ASSETNUM"));
        row1.createCell(6).setCellValue(
            woMbo.getString("ASSET.DESCRIPTION"));
        
        var assetMboSet = woMbo.getMboSet("ASSET");
        if (!assetMboSet.isEmpty()) {
            row1.createCell(7).setCellValue(
                woMbo.getBoolean("ASSET.MTR_SAFETYITEM") ? "Y" : "N");
            row1.createCell(27).setCellValue(
                woMbo.getBoolean("ASSET.MTR_STATUTORY") ? "Y" : "N");
        }
        
        row1.createCell(15).setCellValue(woMbo.getString("WONUM"));
        row1.createCell(16).setCellValue(woMbo.getString("STATUS"));
        row1.createCell(20).setCellValue(
            parseDate(woMbo.getDate("REPORTDATE")));
        // ... 更多字段
        
        cc++;
    }
    return cc;
}
```

**关键点**：
- 使用 Apache POI 创建和操作 Excel 文件
- 支持复杂的查询条件和多数据集合并
- FTP 上传使用被动模式（passive mode）
- 生成 CTF 控制文件用于接口追踪
- 动态构建 SQL 查询条件
- 完善的异常处理和资源清理
- 集成日志记录接口执行情况

---

### 7.11 文件上传处理

**场景**：处理上传的 CSV 文件并导入数据

```javascript
/*
 * 脚本(AUTOSCRIPT): IMPORT_CSV_DATA
 * 脚本语言(SCRIPTLANGUAGE): Nashorn
 * 描述(DESCRIPTION): CSV 数据导入接口
 * 是接口(INTERFACE): Y
 * 活动(ACTIVE): Y
 */

BufferedReader = Java.type("java.io.BufferedReader");
InputStreamReader = Java.type("java.io.InputStreamReader");
ByteArrayInputStream = Java.type("java.io.ByteArrayInputStream");
Base64 = Java.type("java.util.Base64");
MXServer = Java.type("psdi.server.MXServer");

main();

function main() {
    if (httpMethod !== "POST") {
        responseBody = JSON.stringify({
            "status": "error",
            "message": "仅支持 POST 方法"
        });
        return;
    }
    
    try {
        var requestData = JSON.parse(requestBody);
        var csvData = requestData.csvData; // Base64 编码的 CSV 数据
        
        if (!csvData) {
            throw new Error("缺少 CSV 数据");
        }
        
        // 解码 Base64
        var decodedBytes = Base64.getDecoder().decode(csvData);
        var inputStream = new ByteArrayInputStream(decodedBytes);
        var reader = new BufferedReader(new InputStreamReader(inputStream));
        
        var line;
        var lineNumber = 0;
        var successCount = 0;
        var errorCount = 0;
        var errors = [];
        
        // 读取 CSV 标题行
        var headerLine = reader.readLine();
        lineNumber++;
        
        // 逐行处理
        while ((line = reader.readLine()) !== null) {
            lineNumber++;
            
            try {
                var fields = line.split(",");
                
                // 创建新记录
                var itemSet = MXServer.getMXServer().getMboSet("ITEM", userInfo);
                var item = itemSet.add();
                
                item.setValue("ITEMNUM", fields[0].trim());
                item.setValue("DESCRIPTION", fields[1].trim());
                item.setValue("ITEMTYPE", fields[2].trim());
                
                itemSet.save();
                itemSet.close();
                itemSet.cleanup();
                
                successCount++;
            } catch (e) {
                errorCount++;
                errors.push({
                    "line": lineNumber,
                    "error": e.message
                });
            }
        }
        
        reader.close();
        
        responseBody = JSON.stringify({
            "status": "success",
            "data": {
                "totalLines": lineNumber - 1,
                "successCount": successCount,
                "errorCount": errorCount,
                "errors": errors
            }
        });
        
    } catch (e) {
        responseBody = JSON.stringify({
            "status": "error",
            "message": "导入失败: " + e.message
        });
        service.log_error("CSV 导入失败: " + e.message);
    }
}

var scriptConfig = {
    "autoscript": "IMPORT_CSV_DATA",
    "description": "CSV 数据导入接口",
    "version": "1.0.0",
    "active": true,
    "logLevel": "INFO"
};
```

---

## 8. 高级功能

### 8.1 调用其他脚本

```javascript
// 调用另一个脚本
service.invokeScript("OTHER_SCRIPT_NAME");

// 带参数调用
var ctx = new java.util.HashMap();
ctx.put("param1", "value1");
ctx.put("param2", "value2");
service.invokeScript("OTHER_SCRIPT", ctx);
```

### 8.2 使用脚本变量

```javascript
// 在脚本配置中定义变量
var scriptConfig = {
    "autoscript": "SCRIPT_WITH_VARS",
    "autoScriptVars": [
        {
            "varname": "THRESHOLD",
            "vartype": "IN",
            "varbindingtype": "LITERAL",
            "literaldatatype": "NUMBER",
            "varbindingvalue": "1000"
        },
        {
            "varname": "EMAIL_RECIPIENT",
            "vartype": "IN",
            "varbindingtype": "LITERAL",
            "literaldatatype": "STRING",
            "varbindingvalue": "admin@example.com"
        }
    ]
};

// 在脚本中使用变量
var threshold = THRESHOLD;
var recipient = EMAIL_RECIPIENT;
```

### 8.3 数据库事务控制

```javascript
DBShortcut = Java.type("psdi.mbo.DBShortcut");

var db = new DBShortcut();
try {
    db.connect(userInfo.getConnectionKey());
    
    // 执行 SQL
    db.execute(DBShortcut.UPDATE, 
        "UPDATE workorder SET status = 'COMP' WHERE wonum = '1001'");
    
    // 提交事务
    db.commit();
} catch (e) {
    // 回滚事务
    db.rollback();
    throw e;
} finally {
    db.close();
}
```

### 8.4 缓存管理

```javascript
MXServer = Java.type("psdi.server.MXServer");

// 刷新缓存
MXServer.getMXServer().reloadMaximoCache("MAXPROP", "propertyName", true);
MXServer.getMXServer().reloadAdminModeByThread(AdminModeManager.ADMIN_ON, null);
```

### 8.5 安全检查

```javascript
// 检查用户权限
function checkPermissions(app, optionName) {
    if (!userInfo) {
        throw new Error("用户信息不可用");
    }
    
    var userProfile = MXServer.getMXServer().lookup("SECURITY").getProfile(userInfo);
    
    if (!userProfile.hasAppOption(app, optionName) && !isInAdminGroup()) {
        throw new Error(
            "用户 " + userInfo.getUserName() + 
            " 没有 " + app + " 应用的 " + optionName + " 权限"
        );
    }
}

// 检查是否在管理员组
function isInAdminGroup() {
    var user = userInfo.getUserName();
    var groupUserSet;
    
    try {
        groupUserSet = MXServer.getMXServer().getMboSet("GROUPUSER", 
            MXServer.getMXServer().getSystemUserInfo());
        
        var adminGroup = MXServer.getMXServer().lookup("MAXVARS")
            .getString("ADMINGROUP", null);
        
        var sqlFormat = new SqlFormat("userid = :1 and groupname = :2");
        sqlFormat.setObject(1, "GROUPUSER", "USERID", user);
        sqlFormat.setObject(2, "GROUPUSER", "GROUPNAME", adminGroup);
        groupUserSet.setWhere(sqlFormat.format());
        
        return !groupUserSet.isEmpty();
    } finally {
        if (groupUserSet) {
            groupUserSet.close();
            groupUserSet.cleanup();
        }
    }
}
```

### 8.6 日志流式输出（实时日志）

```javascript
// 用于 REST 接口实时输出日志
var scriptConfig = {
    "autoscript": "STREAM_LOGGING",
    "description": "实时日志流",
    "version": "1.0.0",
    "active": true,
    "logLevel": "ERROR"
};

// 实现参考 sharptree.autoscript.logging.js
```

---

## 9. 最佳实践

### 9.1 资源管理

**始终关闭 MBO 集合**：
```javascript
var mboSet;
try {
    mboSet = MXServer.getMXServer().getMboSet("WORKORDER", userInfo);
    // ... 业务逻辑
} finally {
    if (mboSet) {
        try {
            mboSet.close();
            mboSet.cleanup();
        } catch (ignored) {}
    }
}
```

### 9.2 错误处理

**使用 try-catch 包裹关键代码**：
```javascript
try {
    // 业务逻辑
} catch (e) {
    service.log_error("错误发生: " + e.message);
    
    if (typeof httpMethod !== "undefined") {
        responseBody = JSON.stringify({
            "status": "error",
            "message": e.message
        });
    } else {
        errorgroup = "custom";
        errorkey = "unexpected_error";
    }
}
```

### 9.3 性能优化

**避免在循环中查询数据库**：
```javascript
// ❌ 不推荐
for (var i = 0; i < items.length; i++) {
    var set = MXServer.getMXServer().getMboSet("ITEM", userInfo);
    // ... 查询
}

// ✅ 推荐
var set = MXServer.getMXServer().getMboSet("ITEM", userInfo);
var sqlf = new SqlFormat("itemnum in (:itemnums)");
// ... 批量查询
```

**使用 SqlFormat 防止 SQL 注入**：
```javascript
// ❌ 不安全
mboSet.setWhere("wonum = '" + wonum + "'");

// ✅ 安全
var sqlf = new SqlFormat("wonum = :1");
sqlf.setObject(1, "WORKORDER", "WONUM", wonum);
mboSet.setWhere(sqlf.format());
```

### 9.4 代码组织

**使用函数模块化代码**：
```javascript
main();

function main() {
    validateInput();
    processData();
    saveResults();
}

function validateInput() {
    // 验证逻辑
}

function processData() {
    // 处理逻辑
}

function saveResults() {
    // 保存逻辑
}
```

### 9.5 日志规范

**合理使用日志级别**：
```javascript
// DEBUG：详细调试信息
service.log_debug("变量值: " + variable);

// INFO：一般信息
service.log_info("处理完成，共 " + count + " 条记录");

// WARN：警告信息
service.log_warn("配置项缺失，使用默认值");

// ERROR：错误信息
service.log_error("操作失败: " + e.message);
```

### 9.6 脚本命名规范

**推荐的命名方式**：
- 对象脚本：`OBJECTNAME.EVENT`（如 `WORKORDER.SAVE`）
- 属性脚本：`OBJECTNAME_ATTRIBUTE_EVENT`（如 `WORKORDER_STATUS_VALIDATE`）
- 操作脚本：描述性名称（如 `SEND_EMAIL_NOTIFICATION`）
- 接口脚本：描述性名称 + `_API`（如 `WO_STATISTICS_API`）

### 9.7 版本控制

**在 scriptConfig 中包含版本信息**：
```javascript
var scriptConfig = {
    "autoscript": "MY_SCRIPT",
    "description": "脚本描述",
    "version": "1.0.0",  // 语义化版本
    "active": true,
    "logLevel": "INFO"
};
```

### 9.8 中文处理（Python）

**Python 脚本中的中文**：
```python
# 始终使用 .decode('utf-8')
message = '操作成功'.decode('utf-8')
mbo.setValue('DESCRIPTION', message)

# 或在异常消息中
params = ['值不能为空'.decode('utf-8')]
```

### 9.9 测试和调试

**使用交互式会话测试**：
```javascript
// 检查是否为交互式会话
if (interactive) {
    service.log_info("这是在 UI 会话中执行");
} else {
    service.log_info("这是在后台会话中执行");
}
```

**启用详细日志**：
```javascript
// 在开发阶段使用 DEBUG 级别
var scriptConfig = {
    "autoscript": "MY_SCRIPT",
    "logLevel": "DEBUG"  // 开发时使用 DEBUG
};

// 生产环境改为 INFO 或 WARN
```

### 9.10 安全考虑

**权限检查**：
```javascript
// REST 接口必须进行权限检查
function main() {
    checkPermissions("SHARPTREE_UTILS", "DEPLOYSCRIPT");
    // ... 业务逻辑
}
```

**输入验证**：
```javascript
// 验证所有输入参数
if (!wonum || wonum.trim() === "") {
    throw new Error("工单号不能为空");
}

// 验证数据类型
if (typeof quantity !== "number" || quantity < 0) {
    throw new Error("数量必须是正数");
}
```

---

## 附录：常见问题

### Q1: 脚本不生效怎么办？
1. 检查脚本是否处于"活动"状态
2. 检查启动点配置是否正确
3. 检查日志级别设置
4. 查看 maximo.log 中的错误信息
5. 确认管理方式（Admin Mode）状态

### Q2: 如何调试脚本？
1. 使用 `service.log_xxx()` 输出日志
2. 在 Maximo 日志配置中启用脚本日志：
   ```
   log4j.logger.maximo.script=DEBUG
   log4j.logger.maximo.script.SCRIPT_NAME=DEBUG
   ```
3. 使用 try-catch 捕获异常
4. 在测试环境中逐步验证

### Q3: JavaScript 和 Python 如何选择？
- **JavaScript (Nashorn)**：推荐用于新项目，性能更好，语法更现代
- **Python (Jython)**：适合已有 Python 脚本的迁移，语法简洁

### Q4: 如何处理大量数据？
1. 使用批量操作而非逐条处理
2. 避免在循环中创建 MBO 集合
3. 使用系统用户（SystemUserInfo）执行后台任务
4. 考虑使用定时任务分批处理

### Q5: 脚本会影响性能吗？
- 合理的脚本对性能影响很小
- 避免在高频触发点（如字段验证）执行复杂逻辑
- 优化数据库查询，使用索引
- 定期审查和清理不需要的脚本

---

## 参考资源

- IBM Maximo 官方文档
- 项目资源脚本：
  - `sharptree.autoscript.admin.js` - 管理操作
  - `sharptree.autoscript.deploy.js` - 脚本部署
  - `sharptree.autoscript.extract.js` - 脚本提取
  - `sharptree.autoscript.form.js` - 表单处理
  - `sharptree.autoscript.library.js` - 通用库函数
  - `sharptree.autoscript.logging.js` - 日志流
  - `sharptree.autoscript.report.js` - 报表处理

---

**文档版本**: 1.0.0  
**最后更新**: 2024-01-01  
**维护者**: Maximo 开发团队
