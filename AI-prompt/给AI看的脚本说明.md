# Maximo 自动化脚本完整使用手册（Python + JavaScript）
含**规范说明 + 10套可直接复制的生产级脚本模板**，覆盖字段控制、赋值、校验、状态、接口、日志、子表遍历等场景。

---

## 一、基础总览
### 1. 支持语言
- **Python（Jython）**：兼容 Python 2.7，Maximo 标准脚本语言
- **JavaScript（Nashorn）**：Java 内置引擎，接口场景常用
### 2. 执行方式
- 属性启动点（字段变更/校验/查询）
- 对象启动点（新增/保存/删除）
- 操作启动点、条件启动点
- OSLC 接口脚本（外部调用）
### 3. 核心规则
- 不用写类、不用写 main
- 直接使用隐式变量：`mbo` / `service` / `mbo_value` / `app` / `user`
- 异常、日志、常量用 Maximo 官方 API

---

## 二、通用隐式变量
| 变量名 | 用途 |
|-------|------|
| mbo | 当前主记录（最常用） |
| mbo_value | 属性启动点当前字段值 |
| service | 脚本服务：日志、抛错 |
| app | 当前应用（WOTRACK、SR、INVOICE 等） |
| user | 当前登录用户 |
| onadd/onupdate/ondelete | 判断操作类型 |
| errorgroup/errorkey/params | 抛错参数 |
| responseBody | 接口脚本返回值 |

---

## 三、Python（Jython）脚本规范
### 1. 标准导入
```python
from psdi.mbo import MboConstants
from psdi.server import MXServer
from psdi.util import MXApplicationException
```

### 2. 取值/赋值
```python
# 取值
str_val = mbo.getString("WORKTYPE")
int_val = mbo.getInt("WOPRIORITY")
date_val = mbo.getDate("INVOICEDATE")

# 赋值（无验证无触发）
mbo.setValue("WOPRIORITY", 1, MboConstants.NOVALIDATION_AND_NOACTION)
```

### 3. 字段只读
```python
mbo.setFieldFlag("WORKTYPE", MboConstants.READONLY, True)
```

### 4. 抛错
```python
# 无参数
service.error("custerr", "priority_error")
# 带参数
params = ["优先级"]
service.error("asset", "field_invalid", params)
```

### 5. 系统日期
```python
sys_date = MXServer.getMXServer().getDate()
```

### 6. 遍历子表
```python
mat_set = mbo.getMboSet("SHOWACTUALMATERIAL")
total = 0
mat = mat_set.moveFirst()
while mat:
    total += mat.getDouble("LINECOST")
    mat = mat_set.moveNext()
mbo.setValue("ACTMATCOST", total, MboConstants.NOVALIDATION_AND_NOACTION)
```

### 7. 状态变更
```python
mbo.changeStatus("APPR", sys_date, "脚本自动审核")
```

### 8. 日志
```python
service.log("INFO 日志")
service.log_debug("DEBUG 日志")
service.log_error("ERROR 日志")
```

---

## 四、JavaScript（Nashorn）脚本规范
### 1. 标准加载
```javascript
load('nashorn:mozilla_compat.js');
importClass(Packages.psdi.mbo.MboConstants);
importClass(Packages.psdi.server.MXServer);
importClass(Packages.psdi.util.MXApplicationException);
```

### 2. 取值/赋值
```javascript
var strVal = mbo.getString("WORKTYPE");
var intVal = mbo.getInt("WOPRIORITY");
var dateVal = mbo.getDate("INVOICEDATE");

mbo.setValue("WOPRIORITY", 1, MboConstants.NOVALIDATION_AND_NOACTION);
```

### 3. 字段只读
```javascript
mbo.setFieldFlag("WORKTYPE", MboConstants.READONLY, true);
```

### 4. 抛错
```javascript
service.error("custerr", "priority_error");
var params = ["优先级"];
service.error("asset", "field_invalid", params);
```

### 5. 系统日期
```javascript
var sysDate = MXServer.getMXServer().getDate();
```

### 6. 遍历子表
```javascript
var matSet = mbo.getMboSet("SHOWACTUALMATERIAL");
var total = 0;
var mat = matSet.moveFirst();
while (mat != null) {
    total += mat.getDouble("LINECOST");
    mat = matSet.moveNext();
}
mbo.setValue("ACTMATCOST", total, MboConstants.NOVALIDATION_AND_NOACTION);
```

### 7. 状态变更
```javascript
mbo.changeStatus("APPR", sysDate, "脚本自动审核");
```

### 8. 日志
```javascript
service.log("INFO 日志");
service.log_debug("DEBUG 日志");
service.log_error("ERROR 日志");
```

---

## 五、10套可直接复制的脚本模板
### 模板1：新建时赋默认值（对象启动点 NEW）
**Python**
```python
# 对象：WORKORDER，启动点：NEW
if onadd:
    mbo.setValue("OWNER", user, MboConstants.NOVALIDATION_AND_NOACTION)
    mbo.setValue("SITEID", "BJ", MboConstants.NOVALIDATION_AND_NOACTION)
```
**JavaScript**
```javascript
// 对象：WORKORDER，启动点：NEW
if (onadd) {
    mbo.setValue("OWNER", user, MboConstants.NOVALIDATION_AND_NOACTION);
    mbo.setValue("SITEID", "BJ", MboConstants.NOVALIDATION_AND_NOACTION);
}
```

---

### 模板2：字段变更联动赋值（属性启动点）
**Python**
```python
# 属性：WORKTYPE
worktype = mbo.getString("WORKTYPE")
if worktype == "EM":
    mbo.setValue("WOPRIORITY", 1, MboConstants.NOVALIDATION_AND_NOACTION)
    mbo.setFieldFlag("WORKTYPE", MboConstants.READONLY, True)
```
**JavaScript**
```javascript
// 属性：WORKTYPE
var worktype = mbo.getString("WORKTYPE");
if (worktype === "EM") {
    mbo.setValue("WOPRIORITY", 1, MboConstants.NOVALIDATION_AND_NOACTION);
    mbo.setFieldFlag("WORKTYPE", MboConstants.READONLY, true);
}
```

---

### 模板3：字段值校验拦截（属性启动点 验证）
**Python**
```python
# 属性：WOPRIORITY
priority = mbo.getInt("WOPRIORITY")
if priority > 5:
    service.error("custerr", "priority_over", ["优先级不能大于5"])
```
**JavaScript**
```javascript
// 属性：WOPRIORITY
var priority = mbo.getInt("WOPRIORITY");
if (priority > 5) {
    var params = ["优先级不能大于5"];
    service.error("custerr", "priority_over", params);
}
```

---

### 模板4：日期合法性校验
**Python**
```python
# 属性：INVOICEDATE
sys_date = MXServer.getMXServer().getDate()
inv_date = mbo.getDate("INVOICEDATE")
if inv_date and inv_date.before(sys_date):
    service.error("asset", "date_invalid", ["发票日期不能早于系统日期"])
```
**JavaScript**
```javascript
// 属性：INVOICEDATE
var sysDate = MXServer.getMXServer().getDate();
var invDate = mbo.getDate("INVOICEDATE");
if (invDate != null && invDate.before(sysDate)) {
    var params = ["发票日期不能早于系统日期"];
    service.error("asset", "date_invalid", params);
}
```

---

### 模板5：工单完成自动计算材料费
**Python**
```python
# 属性：STATUS
status = mbo.getString("STATUS")
if status == "COMP":
    mat_set = mbo.getMboSet("SHOWACTUALMATERIAL")
    total = 0
    mat = mat_set.moveFirst()
    while mat:
        total += mat.getDouble("LINECOST")
        mat = mat_set.moveNext()
    mbo.setValue("ACTMATCOST", total, MboConstants.NOVALIDATION_AND_NOACTION)
```
**JavaScript**
```javascript
// 属性：STATUS
var status = mbo.getString("STATUS");
if (status === "COMP") {
    var matSet = mbo.getMboSet("SHOWACTUALMATERIAL");
    var total = 0;
    var mat = matSet.moveFirst();
    while (mat != null) {
        total += mat.getDouble("LINECOST");
        mat = matSet.moveNext();
    }
    mbo.setValue("ACTMATCOST", total, MboConstants.NOVALIDATION_AND_NOACTION);
}
```

---

### 模板6：保存前自动审核
**Python**
```python
# 对象：WORKORDER，启动点：SAVE
if onupdate:
    worktype = mbo.getString("WORKTYPE")
    gl = mbo.getString("GLACCOUNT")
    if worktype == "PM" and gl:
        sys_date = MXServer.getMXServer().getDate()
        mbo.changeStatus("APPR", sys_date, "脚本自动审核")
```
**JavaScript**
```javascript
// 对象：WORKORDER，启动点：SAVE
if (onupdate) {
    var worktype = mbo.getString("WORKTYPE");
    var gl = mbo.getString("GLACCOUNT");
    if (worktype === "PM" && gl) {
        var sysDate = MXServer.getMXServer().getDate();
        mbo.changeStatus("APPR", sysDate, "脚本自动审核");
    }
}
```

---

### 模板7：按应用控制字段只读
**Python**
```python
if app == "WOTRACK":
    mbo.setFieldFlag("ASSETNUM", MboConstants.READONLY, True)
```
**JavaScript**
```javascript
if (app === "WOTRACK") {
    mbo.setFieldFlag("ASSETNUM", MboConstants.READONLY, true);
}
```

---

### 模板8：服务请求自动设优先级
**Python**
```python
# 属性：TICKETID
app_name = mbo.getThisMboSet().getApp()
if app_name and app_name.upper() == "SR":
    mbo.setValue("REPORTEDPRIORITY", 2, MboConstants.NOACCESSCHECK)
```
**JavaScript**
```javascript
// 属性：TICKETID
var appName = mbo.getThisMboSet().getApp();
if (appName != null && appName.toUpperCase() === "SR") {
    mbo.setValue("REPORTEDPRIORITY", 2, MboConstants.NOACCESSCHECK);
}
```

---

### 模板9：Python OSLC 接口脚本
```python
import json
from psdi.server import MXServer

req = json.loads(requestBody)
wonum = req.get("wonum", "")

wo_set = MXServer.getMXServer().getMboSet("WORKORDER", userInfo)
wo_set.setWhere(f"WONUM='{wonum}'")
wo_set.reset()

result = []
if not wo_set.isEmpty():
    wo = wo_set.moveFirst()
    result.append({
        "wonum": wo.getString("WONUM"),
        "description": wo.getString("DESCRIPTION"),
        "status": wo.getString("STATUS")
    })

responseBody = json.dumps(result)
```

---

### 模板10：JavaScript OSLC 接口脚本
```javascript
var reqBody = JSON.parse(requestBody);
var wonum = reqBody.wonum || "";
var mxserver = MXServer.getMXServer();

var woSet = mxserver.getMboSet("WORKORDER", userInfo);
woSet.setWhere("WONUM='" + wonum + "'");
woSet.reset();

var result = [];
if (!woSet.isEmpty()) {
    var wo = woSet.moveFirst();
    result.push({
        wonum: wo.getString("WONUM"),
        description: wo.getString("DESCRIPTION"),
        status: wo.getString("STATUS")
    });
}

responseBody = JSON.stringify(result);
```

---

## 六、部署与常见问题
### 1. 脚本命名规范
- 属性启动点：`对象_属性`（如 `WORKORDER_WORKTYPE`）
- 对象启动点：`对象.NEW` / `对象.SAVE`
- 接口脚本：自定义英文名

### 2. 常见问题
1. **脚本不生效**
   - 检查启动点是否启用
   - 关闭“管理方式”
   - 确认事件类型（初始化/验证/保存）
2. **中文乱码**
   Python：`'中文'.decode('utf-8')`
3. **接口无返回**
   必须给 `responseBody` 赋值
4. **日志不输出**
   `logger.properties` 配置：
   ```
   log4j.logger.maximo.script=DEBUG
   ```

---

## 七、语法速查表
| 操作 | Python | JavaScript |
|------|--------|------------|
| 字符串取值 | mbo.getString("F1") | mbo.getString("F1") |
| 赋值 | mbo.setValue(...) | mbo.setValue(...) |
| 抛错 | service.error(...) | service.error(...) |
| 系统日期 | MXServer.getMXServer().getDate() | 相同 |
| 遍历子表 | while mat: | while(mat!=null) |
| 只读 | MboConstants.READONLY | 相同 |

---

我可以把这份文档**整理成一页可打印的 PDF 版**，也可以按你业务场景（工单/资产/采购/发票）**定制专属脚本**，需要吗？