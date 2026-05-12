# 🚀 插件更新 - v1.0.3

## ✅ 已完成的优化

### 改进内容：
1. **增强的错误处理** - 所有操作都有try-catch保护
2. **详细的日志输出** - 每一步都有清晰的日志
3. **更好的返回值** - 返回操作结果统计
4. **异步消息支持** - 确保消息正确传递
5. **更稳定的事件触发** - 分开触发每个事件

---

## 📋 安装步骤（重要！）

### 第1步：重新加载插件

1. 打开 Chrome 扩展管理页面
   ```
   chrome://extensions/
   ```

2. 找到 **"批量复选框勾选助手"**

3. **点击刷新按钮** 🔄 （圆形箭头图标）
   - ⚠️ **这一步非常重要！必须做！**

4. 确认版本号显示为 **1.0.3**

### 第2步：刷新目标页面

1. 在你的 Maximo 页面上按 **F5** 刷新
2. 等待页面完全加载

### 第3步：打开控制台查看日志

1. 按 **F12** 打开开发者工具
2. 切换到 **Console**（控制台）标签
3. 点击 🚫 清空之前的日志

### 第4步：测试插件

1. 点击浏览器工具栏的插件图标
2. 你应该能看到弹出窗口
3. 在控制台中应该看到：
   ```
   [Checkbox Helper] 内容脚本已加载
   ```

4. 点击"全选"按钮
5. 查看控制台输出

---

## 📊 预期的日志输出

### ✅ 成功情况：

```
[Checkbox Helper] 内容脚本已加载
[Checkbox Helper] 收到消息: {action: 'operateCheckboxes', ...}
[Checkbox Helper] 操作复选框 - 选择器: input.cds--checkbox 操作: select
[Checkbox Helper] 找到复选框数量: 13
[Checkbox Helper] 处理第 1 个复选框
[Checkbox Helper] 当前状态: checked=false
[Checkbox Helper] 目标状态: true
[Checkbox Helper] 使用原生 setter 设置值
[Checkbox Helper] 原生 setter 调用成功
[Checkbox Helper] 设置后状态: checked=true
[Checkbox Helper] 触发事件...
[Checkbox Helper] 事件 input 已触发
[Checkbox Helper] 事件 change 已触发
[Checkbox Helper] 事件 click 已触发
[Checkbox Helper] 触发父元素事件
[Checkbox Helper] ✓ 第 1 个复选框操作成功
... (重复13次)
[Checkbox Helper] 操作完成 - 成功: 13, 跳过: 0, 错误: 0
```

### ❌ 如果看到错误：

```
[Checkbox Helper] 未找到匹配的复选框！
```
**解决**：切换到"所有复选框"模式

```
[Checkbox Helper] ✗ 第 X 个复选框操作失败: ...
```
**解决**：告诉我具体的错误信息

---

## 🔍 如果还是没反应

### 检查清单：

- [ ] 是否点击了刷新按钮重新加载插件？
- [ ] 是否刷新了目标页面？
- [ ] 控制台是否有 `[Checkbox Helper]` 的日志？
- [ ] 插件图标是否在工具栏显示？
- [ ] 点击插件图标是否能打开弹出窗口？

### 常见问题：

#### 问题1：看不到插件图标
**解决**：
1. 点击工具栏的拼图图标 🧩
2. 找到"批量复选框勾选助手"
3. 点击图钉图标固定

#### 问题2：控制台没有任何日志
**解决**：
1. 确认插件已启用（chrome://extensions/）
2. 刷新页面（F5）
3. 重新点击插件图标

#### 问题3：弹出窗口打不开
**解决**：
1. 检查 manifest.json 是否正确
2. 查看 chrome://extensions/ 是否有错误提示
3. 移除插件后重新加载

#### 问题4：显示找到0个复选框
**解决**：
1. 在插件中选择"所有复选框"模式
2. 或者使用自定义选择器：`input[type="checkbox"]`

---

## 💡 快速测试代码

如果插件还是不工作，在控制台运行这段代码测试：

```javascript
// 快速测试 - 直接操作复选框
const checkboxes = document.querySelectorAll('input.cds--checkbox');
console.log('找到', checkboxes.length, '个CDS复选框');

if (checkboxes.length > 0) {
    checkboxes.forEach((cb, i) => {
        if (!cb.checked) {
            const setter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype, 'checked'
            ).set;
            setter.call(cb, true);
            cb.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(`✓ 复选框 ${i + 1} 已勾选`);
        }
    });
    console.log('完成！检查页面上的复选框');
} else {
    console.log('没有找到CDS复选框，尝试所有复选框...');
    const allCb = document.querySelectorAll('input[type="checkbox"]');
    console.log('找到', allCb.length, '个所有类型的复选框');
}
```

---

## 📞 需要帮助？

请提供以下信息：

1. **控制台完整输出**（截图或复制文字）
2. **是否看到 "[Checkbox Helper]" 日志？**
3. **插件版本号是多少？**（应该是 1.0.3）
4. **点击"全选"后有什么反应？**
5. **页面上有多少个复选框？**

---

**现在就按照步骤操作，然后告诉我结果！** 🎯
