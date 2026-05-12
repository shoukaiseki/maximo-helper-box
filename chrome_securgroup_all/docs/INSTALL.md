# 快速安装指南

## 🚀 立即开始使用

### 第一步：准备图标（2选1）

**选项A - 快速测试（无图标）**
```bash
# 将 manifest-no-icons.json 重命名为 manifest.json
# Windows PowerShell:
Rename-Item -Path "manifest-no-icons.json" -NewName "manifest.json.bak"
Rename-Item -Path "manifest.json" -NewName "manifest-with-icons.json"
Rename-Item -Path "manifest-no-icons.json" -NewName "manifest.json"
```

**选项B - 创建简单图标**
1. 用画图工具创建3个PNG文件：
   - icon16.png (16x16像素)
   - icon48.png (48x48像素)  
   - icon128.png (128x128像素)
2. 保存到 `icons` 文件夹

### 第二步：安装插件

1. **打开Chrome扩展管理页面**
   - 在地址栏输入：`chrome://extensions/`
   - 或者：菜单 → 更多工具 → 扩展程序

2. **启用开发者模式**
   - 找到右上角的"开发者模式"开关
   - 点击开启

3. **加载插件**
   - 点击左上角"加载已解压的扩展程序"
   - 选择文件夹：`e:\gitwork\maximo-helper-box\chrome_securgroup_all`
   - 点击"选择文件夹"

4. **确认安装成功**
   - 你应该能在扩展列表中看到"批量复选框勾选助手"
   - 在浏览器工具栏右上角会出现插件图标

### 第三步：使用插件

1. **打开目标网页**
   - 访问包含复选框的页面
   - 特别是使用 CDS (Carbon Design System) 的页面

2. **点击插件图标**
   - 会弹出操作界面

3. **选择操作类型**
   - CDS 复选框：针对 `cds--checkbox` 类
   - 自定义选择器：输入自己的CSS选择器
   - 所有复选框：页面上所有checkbox

4. **执行批量操作**
   - 全选：勾选所有匹配的复选框
   - 取消全选：取消所有勾选
   - 反选：切换所有复选框状态

5. **查看统计**
   - 显示找到的复选框总数
   - 显示已勾选的数量

## 🔧 故障排除

### 问题1：看不到插件图标
- 点击Chrome工具栏的拼图图标🧩
- 找到"批量复选框勾选助手"
- 点击图钉图标固定到工具栏

### 问题2：插件不工作
- 刷新目标网页
- 重新点击插件图标
- 检查浏览器控制台是否有错误

### 问题3：找不到复选框
- 确认页面确实有复选框
- 尝试切换到"所有复选框"模式
- 右键页面 → 检查元素，确认复选框的class名称

## 💡 使用技巧

1. **自定义选择器示例**：
   ```css
   input[type="checkbox"]           /* 所有复选框 */
   .my-custom-class input          /* 特定容器内的复选框 */
   table tr td input               /* 表格中的复选框 */
   ```

2. **快捷键**：
   - 目前没有快捷键，但可以手动添加

3. **批量处理大量复选框**：
   - 插件会自动处理所有匹配的复选框
   - 无需逐个点击

## 📝 更新插件

修改代码后：
1. 回到 `chrome://extensions/`
2. 找到本插件
3. 点击刷新图标🔄
4. 重新测试功能

---

**需要帮助？** 查看 [README.md](file://e:\gitwork\maximo-helper-box\chrome_securgroup_all\README.md) 获取更多详细信息。
