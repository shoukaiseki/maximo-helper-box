# Maximo Excel 处理 - EasyExcel 方案参考

> **注意**：此方案使用 Alibaba EasyExcel 库，当前项目暂不采用，仅作为技术参考保存。

---

## 概述

本文档介绍如何在 Maximo 自动化脚本中使用 **Alibaba EasyExcel** 库进行 Excel 文件的导入、校验和错误回写。EasyExcel 是阿里巴巴开源的高性能 Excel 处理工具，相比 Apache POI 更加简洁高效。

### 适用场景
- 大批量 Excel 数据导入
- 需要逐行校验并返回详细错误信息
- 需要将错误信息写回 Excel 对应单元格
- Web UI 文件上传下载场景

### 依赖库
- **Alibaba EasyExcel 3.x**
- **Apache POI** (EasyExcel 底层依赖)
- 需要在 Maximo 服务器的 classpath 中添加相关 JAR 包

---

## 完整示例：采购申请 Excel 导入

### 业务需求
从 Excel 文件导入采购申请（PR）数据，包括：
1. 读取 Excel 中的 PR 表头和明细行
2. 逐行校验数据合法性
3. 校验通过则插入数据库
4. 校验失败则将错误信息写回 Excel 对应单元格，供用户下载查看

### 脚本代码

```javascript
/**
 * 脚本(AUTOSCRIPT): PREXCELIMPORT
 * 脚本语言(SCRIPTLANGUAGE): Nashorn
 * 描述(DESCRIPTION): 采购申请Excel导入
 * version: 1.0
 */

// ==================== 导入 Java 类 ====================
AnalysisEventListener = Java.type("com.alibaba.excel.event.AnalysisEventListener");
ByteArrayInputStream = Java.type("java.io.ByteArrayInputStream");
StringBuilder = Java.type("java.lang.StringBuilder");
SimpleDateFormat = Java.type("java.text.SimpleDateFormat");
ByteArrayOutputStream = Java.type("java.io.ByteArrayOutputStream");
ExcelWriter = Java.type("com.alibaba.excel.ExcelWriter");
WriteSheet = Java.type("com.alibaba.excel.write.metadata.WriteSheet");
EasyExcel = Java.type("com.alibaba.excel.EasyExcelFactory");
ArrayList = Java.type("java.util.ArrayList");
Arrays = Java.type("java.util.Arrays");
HashMap = Java.type("java.util.HashMap");
Double = Java.type("java.lang.Double");
Integer = Java.type("java.lang.Integer");
MXServer = Java.type("psdi.server.MXServer");
XSSFWorkbook = Java.type("org.apache.poi.xssf.usermodel.XSSFWorkbook");

// ==================== 获取会话和用户信息 ====================
var wcs = service.webclientsession();
userInfo = wcs.getUserInfo();

var isPass = true;
var myapp = service.webclientsession().getCurrentApp();
var prErrorLog = new StringBuilder();
var yorn = ["y", "n"];

// ==================== PR 表头数据结构 ====================
var prDao = {
    "description": "",
    "prtype": "",
    "acccategory": "",
    "code": "",
    "requireDate": "",
    "emergency": ""
};

var prlineDaoSet = [];

// ==================== PR 数据监听器（校验表头数据）====================
PrDataListener = Java.extend(AnalysisEventListener, {
    invoke: function (data, analysisContext) {
        rowIndex = analysisContext.readRowHolder().getRowIndex() + 1;
        
        // 按列索引获取数据
        description = data.get(1);  // B列
        type = data.get(3);         // D列
        acccategory = data.get(5);  // F列
        code = data.get(7);         // H列
        requireDate = data.get(9);  // J列
        emergency = data.get(11);   // L列

        try {
            // 验证描述
            if (!description) {
                isPass = false;
                prErrorLog.append("Line ").append(rowIndex)
                    .append(",Column B: 'Request Description' can't be empty\n");
            } else {
                prDao.description = description;
            }

            // 验证采购类型
            if (!type) {
                isPass = false;
                prErrorLog.append("Line ").append(rowIndex)
                    .append(",Column D: 'Request Type' can't be empty\n");
            } else {
                prDao.prtype = type;
            }

            // 验证科目类别
            if (!acccategory) {
                isPass = false;
                prErrorLog.append("Line ").append(rowIndex)
                    .append(",Column F: 'Account Category' can't be empty\n");
            } else {
                prDao.acccategory = acccategory;
                
                // 校验科目类别是否存在于域中
                var alndomainSet = service.getMboSet("ALNDOMAIN", userInfo);
                alndomainSet.setWhere("DOMAINID = 'ACCCATEGORY' and VALUE = '" + acccategory + "'");
                alndomainSet.reset();
                
                if (alndomainSet.isEmpty()) {
                    isPass = false;
                    prErrorLog.append("Line ").append(rowIndex)
                        .append(",Column F: Account Category '" + acccategory + "' doesn't exist\n");
                } else {
                    // 非 Storeroom 类型需要成本中心或 WBS
                    if (!acccategory.equalsIgnoreCase("S")) {
                        if (!code) {
                            isPass = false;
                            if (acccategory.equalsIgnoreCase("K")) {
                                prErrorLog.append("Line ").append(rowIndex)
                                    .append(",Column H: Cost Center can't be empty\n");
                            } else {
                                prErrorLog.append("Line ").append(rowIndex)
                                    .append(",Column H: WBS Code can't be empty\n");
                            }
                        } else {
                            prDao.code = code;
                            
                            // K 类需要校验成本中心是否存在
                            if (acccategory.equalsIgnoreCase("K")) {
                                var ccSet = service.getMboSet("ALNDOMAIN", userInfo);
                                ccSet.setWhere("DOMAINID = 'COSTCENTER' and VALUE = '" + code + "'");
                                ccSet.reset();
                                if (ccSet.isEmpty()) {
                                    isPass = false;
                                    prErrorLog.append("Line ").append(rowIndex)
                                        .append(",Column H: Cost Center '" + code + "' doesn't exist\n");
                                }
                                ccSet.close();
                            }
                        }
                    }
                }
                alndomainSet.close();
            }

            // 验证需求日期格式
            if (!requireDate) {
                isPass = false;
                prErrorLog.append("Line ").append(rowIndex)
                    .append(",Column J: 'Required Date' can't be empty\n");
            } else {
                try {
                    prDao.requireDate = requireDate;
                    var simpleDateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
                    simpleDateFormat.parse(requireDate);
                } catch (e) {
                    isPass = false;
                    prErrorLog.append("Line ").append(rowIndex)
                        .append(",Column J: 'Required Date' must be of date type\n");
                }
            }

            // 验证是否紧急（Y/N）
            if (!emergency) {
                isPass = false;
                prErrorLog.append("Line ").append(rowIndex)
                    .append(",Column L: 'Is Emergency' can't be empty\n");
            } else {
                if (yorn[0].equalsIgnoreCase(emergency)) {
                    prDao.emergency = true;
                } else if (yorn[1].equalsIgnoreCase(emergency)) {
                    prDao.emergency = false;
                } else {
                    isPass = false;
                    prErrorLog.append("Line ").append(rowIndex)
                        .append(",Column L: 'Is Emergency' must be Y or N\n");
                }
            }
        } catch (e) {
            isPass = false;
            prErrorLog.append("Conversion exception: ").append(e.message).append("\n");
        }
    },

    doAfterAllAnalysed: function () {
        // 所有数据分析完成后的处理（可选）
    }
});

// ==================== PR Line 数据监听器（校验行数据）====================
PrLineDataListener = Java.extend(AnalysisEventListener, {
    invoke: function (data, analysisContext) {
        rowIndex = analysisContext.readRowHolder().getRowIndex() + 1;
        
        var prlineDao = {
            "itemnum": "",
            "description": "",
            "quantity": "",
            "vendor": "",
            "maximumLifespan": "",
            "safetyStock": "",
            "repairableCount": "",
            "remark": "",
            "prlineErrorLog": ""
        };
        
        var prlineErrorLog = new StringBuilder();

        // 按列索引获取数据
        itemnum = data.get(0);      // A列
        description = data.get(1);  // B列
        quantity = data.get(2);     // C列
        vendor = data.get(3);       // D列
        maximumLifespan = data.get(4);  // E列
        safetyStock = data.get(5);      // F列
        repairableCount = data.get(6);  // G列
        remark = data.get(7);           // H列

        try {
            // 验证物料编码
            if (!itemnum) {
                isPass = false;
                prlineErrorLog.append("Line ").append(rowIndex)
                    .append(",Column A: 'Item Num' can't be empty\n");
            } else {
                prlineDao.itemnum = itemnum;
                
                // 校验物料是否存在
                var itemSet = service.getMboSet("ITEM", userInfo);
                itemSet.setWhere("itemnum = '" + itemnum + "'");
                itemSet.reset();
                
                if (itemSet.isEmpty()) {
                    isPass = false;
                    prlineErrorLog.append("Line ").append(rowIndex)
                        .append(",Column A: Item Num '" + itemnum + "' doesn't exist\n");
                } else {
                    var item = itemSet.getMbo(0);
                    prlineDao.linetype = item.getString("itemtype");
                }
                itemSet.close();
            }

            // 验证数量
            if (!quantity) {
                isPass = false;
                prlineErrorLog.append("Line ").append(rowIndex)
                    .append(",Column C: 'Quantity' can't be empty\n");
            } else {
                try {
                    prlineDao.quantity = quantity;
                    Double.parseDouble(quantity);
                } catch (e) {
                    isPass = false;
                    prlineErrorLog.append("Line ").append(rowIndex)
                        .append(",Column C: 'Quantity' must be numeric\n");
                }
            }

            // 其他字段处理（可选字段）
            if (vendor) prlineDao.vendor = vendor;
            
            if (maximumLifespan) {
                try {
                    prlineDao.maximumLifespan = maximumLifespan;
                    Integer.parseInt(maximumLifespan);
                } catch (e) {
                    isPass = false;
                    prlineErrorLog.append("Line ").append(rowIndex)
                        .append(",Column E: Must be numeric\n");
                }
            }
            
            if (safetyStock) prlineDao.safetyStock = safetyStock;
            if (repairableCount) prlineDao.repairableCount = repairableCount;
            if (remark) prlineDao.remark = remark;

        } catch (e) {
            isPass = false;
            prlineErrorLog.append("Conversion exception: ").append(e.message).append("\n");
        }
        
        prlineDao.prlineErrorLog = prlineErrorLog.toString();
        prlineDaoSet.push(prlineDao);
    },

    doAfterAllAnalysed: function () {
        // 所有数据分析完成
    }
});

// ==================== 主函数 ====================
main();

function main() {
    // 获取上传的文件
    var uploadFile = service.invokeScript("EXCELBASEBEAN", "getUploadFile", [myapp]);
    var fileName = service.invokeScript("EXCELBASEBEAN", "getFileAliasName", [myapp]);

    if (!fileName) {
        service.yncerror("ExcelImport", "uploadFile");
        return;
    }

    if (uploadFile) {
        // 检查文件类型
        service.invokeScript("EXCELBASEBEAN", "checkFileType", [fileName]);

        var fileOutputStream = uploadFile.getFileOutputStream();
        
        // 读取 PR 表头（从第1行开始，跳过表头行）
        var dataListenerPr = new PrDataListener();
        EasyExcel.read(new ByteArrayInputStream(fileOutputStream.toByteArray()), 
            dataListenerPr).sheet().headRowNumber(1).doRead();
        
        // 读取 PR Line 数据（从第5行开始）
        var dataListenerPrline = new PrLineDataListener();
        EasyExcel.read(new ByteArrayInputStream(fileOutputStream.toByteArray()), 
            dataListenerPrline).sheet().headRowNumber(5).doRead();

        // 根据校验结果处理
        if (isPass) {
            // 校验通过，插入数据
            service.closeDialog();
            insertData();
            service.yncerror("ExcelImport", "uploadSucceed");
        } else {
            // 校验失败，生成错误 Excel
            try {
                var templateIs = new ByteArrayInputStream(fileOutputStream.toByteArray());
                var bos = new ByteArrayOutputStream();
                
                // 使用模板写入（保留原 Excel 格式）
                var excelWriter = EasyExcel.write(bos).withTemplate(templateIs).build();
                var WriteSheet = EasyExcel.writerSheet(0, "PR").build();
                excelWriter.write(new ArrayList(), WriteSheet);
                excelWriter.finish();

                // 写入校验错误信息到 Excel
                writeVerifyInfo(bos);
                
                // 保存错误 Excel
                service.invokeScript("EXCELBASEBEAN", "saveErrorExcel", 
                    [fileName, "PR", bos.toByteArray(), myapp, MXServer, userInfo]);

            } catch (e) {
                service.error("error:", e.message);
            }
        
            service.closeDialog();
            // 弹出错误 Excel 下载对话框
            wcs.loadDialog("errorExcel");
        }
    }
}

// ==================== 插入数据到数据库 ====================
function insertData() {
    try {
        var prSet = service.getMboSet("PR", userInfo);
        var pr = prSet.add();
        
        // 设置 PR 表头字段
        pr.setValue("description", prDao.description);
        pr.setValue("PRTYPE", prDao.prtype);
        pr.setValue("REQUIREDDATE", 
            service.invokeScript("TIMEZONEUTIL", "parseDateFormat", 
                [prDao.requireDate, userInfo, "dd/MM/yyyy HH:mm:ss"]));
        pr.setValue("ACCCATEGORY", prDao.acccategory);
        
        // 根据科目类别设置相应字段
        if (prDao.acccategory.equalsIgnoreCase("P") || 
            prDao.acccategory.equalsIgnoreCase("Q")) {
            pr.setValue("WBSCODE", prDao.code);
        } else if (prDao.acccategory.equalsIgnoreCase("K")) {
            pr.setValue("COSTCENTER", prDao.code);
        }
        
        pr.setValue("EMERGENCY", prDao.emergency);

        // 添加 PR Line
        var prlineSet = pr.getMboSet("PRLINE");
        for (var i = 0; i < prlineDaoSet.length; i++) {
            var prline = prlineSet.add();
            
            prline.setValue("itemnum", prlineDaoSet[i].itemnum);
            prline.setValue("description", prlineDaoSet[i].description);
            prline.setValue("ACCCATEGORY", prDao.acccategory);
            prline.setValue("COSTCENTER", pr.getString("COSTCENTER"), 11);
            prline.setValue("WBSCODE", pr.getString("WBSCODE"), 11);
            prline.setValue("ORDERQTY", prlineDaoSet[i].quantity);
            prline.setValue("SSTOCK", prlineDaoSet[i].safetyStock);
            prline.setValue("REPAIRCOUNT", prlineDaoSet[i].repairableCount);
            prline.setValue("MAXLIFESPAN", prlineDaoSet[i].maximumLifespan, 11);
            prline.setValue("VENDOR", prlineDaoSet[i].vendor);
            prline.setValue("REMARK", prlineDaoSet[i].remark);
        }

        prlineSet.save();
        prlineSet.close();
        prSet.save();
        prSet.close();
        
    } catch (error) {
        service.error("error", error);
    }
}

// ==================== 写入校验信息到 Excel ====================
function writeVerifyInfo(bos) {
    // 使用 POI 加载 Excel（EasyExcel 不支持直接写入单元格）
    var finalIs = new ByteArrayInputStream(bos.toByteArray());
    var workbook = new XSSFWorkbook(finalIs);
    var sheet = workbook.getSheetAt(0);
    
    // 写入 PR 表头错误信息（第1行，第12列=M列）
    var row = sheet.getRow(1);
    if (row == null) row = sheet.createRow(1);
    var cell = row.getCell(12);
    if (cell == null) cell = row.createCell(12);
    cell.setCellValue(prErrorLog.toString());

    // 循环写入 PR Line 错误信息
    var count = prlineDaoSet.length;
    var start_row = 5;  // PR Line 从第5行开始
    var start_col = 12; // 错误信息写在 M 列
    
    for (var i = 0; i < count; i++) {
        var rowNum = start_row + i;
        var row = sheet.getRow(rowNum);
        if (row == null) row = sheet.createRow(rowNum);
        
        var cell = row.getCell(start_col);
        if (cell == null) cell = row.createCell(start_col);
        cell.setCellValue(prlineDaoSet[i].prlineErrorLog);
    }
    
    // 重置 bos 并写入最终结果
    bos.reset();
    workbook.write(bos);
    workbook.close();
    finalIs.close();
}
```

---

## 关键技术点

### 1. Java.extend() 扩展接口

EasyExcel 使用事件监听器模式，需要通过 `Java.extend()` 扩展 Java 接口：

```javascript
PrDataListener = Java.extend(AnalysisEventListener, {
    invoke: function (data, analysisContext) {
        // 处理每一行数据
    },
    doAfterAllAnalysed: function () {
        // 所有数据处理完成后的回调
    }
});
```

### 2. 逐行读取和校验

```javascript
// 创建监听器实例
var dataListener = new PrDataListener();

// 读取 Excel（从第1行开始，跳过头部）
EasyExcel.read(
    new ByteArrayInputStream(fileOutputStream.toByteArray()), 
    dataListener
).sheet().headRowNumber(1).doRead();
```

**关键参数**：
- `headRowNumber(1)`：跳过1行表头
- `doRead()`：触发读取操作

### 3. 数据访问方式

```javascript
// 在 invoke 方法中
invoke: function (data, analysisContext) {
    // 获取行号（从0开始，+1 转换为人类可读的行号）
    rowIndex = analysisContext.readRowHolder().getRowIndex() + 1;
    
    // 按列索引获取数据（从0开始）
    var columnA = data.get(0);  // A列
    var columnB = data.get(1);  // B列
    var columnC = data.get(2);  // C列
}
```

### 4. 错误信息回写

EasyExcel 本身不支持直接写入单元格，需要借助 Apache POI：

```javascript
function writeVerifyInfo(bos) {
    // 用 POI 加载 Excel
    var workbook = new XSSFWorkbook(new ByteArrayInputStream(bos.toByteArray()));
    var sheet = workbook.getSheetAt(0);
    
    // 定位到具体单元格并写入错误信息
    var row = sheet.getRow(rowIndex);
    var cell = row.getCell(columnIndex);
    cell.setCellValue(errorMessage);
    
    // 写回字节流
    bos.reset();
    workbook.write(bos);
    workbook.close();
}
```

### 5. 调用其他脚本

```javascript
// 获取上传文件
var uploadFile = service.invokeScript("EXCELBASEBEAN", "getUploadFile", [myapp]);

// 保存错误 Excel
service.invokeScript("EXCELBASEBEAN", "saveErrorExcel", 
    [fileName, "PR", bos.toByteArray(), myapp, MXServer, userInfo]);
```

---

## 部署步骤

### 1. 添加 JAR 包到 Classpath

需要将以下 JAR 包放到 Maximo 服务器的 lib 目录：
- `easyexcel-3.x.x.jar`
- `poi-5.x.x.jar`
- `poi-ooxml-5.x.x.jar`
- 相关依赖包

### 2. 重启 Maximo 服务

### 3. 部署脚本

通过 Maximo 自动化脚本应用部署上述脚本。

### 4. 配置 EXCELBASEBEAN 脚本

需要确保 `EXCELBASEBEAN` 脚本已部署，提供以下功能：
- `getUploadFile(app)`：获取上传的文件对象
- `getFileAliasName(app)`：获取文件别名
- `checkFileType(fileName)`：检查文件类型
- `saveErrorExcel(fileName, prefix, bytes, app, MXServer, userInfo)`：保存错误 Excel

---

## 优缺点分析

### 优点
✅ **高性能**：基于 SAX 模式，内存占用低，适合大文件  
✅ **逐行处理**：支持流式读取，可以边读边校验  
✅ **API 简洁**：相比原生 POI，代码更简洁  
✅ **错误回写**：可以将错误信息精确写回 Excel 对应单元格  

### 缺点
❌ **额外依赖**：需要引入第三方 JAR 包  
❌ **学习成本**：需要理解事件监听器模式  
❌ **灵活性受限**：复杂场景仍需借助 POI  
❌ **维护成本**：第三方库版本升级可能带来兼容性问题  

---

## 替代方案

如果不想使用 EasyExcel，可以考虑以下替代方案：

### 方案1：纯 Apache POI
- 直接使用 POI 读写 Excel
- 无需额外依赖（Maximo 已内置 POI）
- 代码相对复杂，但灵活性高

### 方案2：CSV 格式
- 将 Excel 另存为 CSV
- 使用 BufferedReader 逐行读取
- 简单高效，但丢失格式和公式

### 方案3：REST API + 前端处理
- 前端使用 JavaScript 库（如 SheetJS）解析 Excel
- 通过 REST API 发送 JSON 数据到 Maximo
- 减轻服务器压力，但需要前端开发

---

## 参考资料

- **EasyExcel 官方文档**：https://github.com/alibaba/easyexcel
- **Apache POI 文档**：https://poi.apache.org/
- **原始脚本位置**：`E:\blogdoc\maximo\maximo自动化脚本\吃灰\PREXCELIMPORT.js`

---

**文档版本**: 1.0.0  
**创建日期**: 2024-01-01  
**状态**: 参考存档（当前项目未采用）
