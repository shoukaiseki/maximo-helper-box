# 🔧 插件没反应？快速诊断指南

## ⚡ 立即执行以下步骤

### 1️⃣ 重新加载插件（必须！）

```
chrome://extensions/ → 找到插件 → 点击刷新按钮 🔄
```

**重要**：每次修改代码后都必须这样做！

---

### 2️⃣ 打开控制台查看日志

1. 在目标网页按 **F12**
2. 切换到 **Console** 标签
3. 清空之前的日志（点击 🚫）
4. 点击插件图标，然后点击"全选"按钮

---

### 3️⃣ 查看输出

#### ✅ 如果看到类似这样的日志：
```
[Checkbox Helper] 开始操作复选框
[Checkbox Helper] 选择器: input.cds--checkbox
[Checkbox Helper] 找到复选框数量: 5
[Checkbox Helper] ✓ 第 1 个复选框操作成功
...
```
**说明**：插件正在工作！请告诉我具体看到了什么。

#### ❌ 如果看到：
```
[Checkbox Helper] 找到复选框数量: 0
[Checkbox Helper] 未找到匹配的复选框！
```
**说明**：选择器不匹配，需要切换模式。

#### ❌ 如果完全看不到任何日志：
**说明**：插件没有正确加载或执行。

---

## 🎯 快速解决方案

### 方案A：切换到"所有复选框"模式

1. 点击插件图标
2. 在"选择器类型"下拉框中选择 **"所有复选框"**
3. 再次点击"全选"

### 方案B：使用自定义选择器

1. 在页面上右键点击一个复选框
2. 选择"检查"
3. 查看复选框的 HTML，例如：
   ```html
   <input type="checkbox" class="my-checkbox" ...>
   ```
4. 在插件中选择"自定义选择器"
5. 输入：`.my-checkbox` 或 `input[type="checkbox"]`

### 方案C：手动测试

在控制台中运行以下代码：

```javascript
// 测试1：检查是否有复选框
console.log('CDS复选框数量:', document.querySelectorAll('input.cds--checkbox').length);
console.log('所有复选框数量:', document.querySelectorAll('input[type="checkbox"]').length);

// 测试2：手动勾选第一个复选框
const firstCheckbox = document.querySelector('input[type="checkbox"]');
if (firstCheckbox) {
    console.log('找到复选框:', firstCheckbox);
    
    // 使用我们的方法
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, 
        'checked'
    ).set;
    
    nativeInputValueSetter.call(firstCheckbox, true);
    firstCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
    
    console.log('设置后的状态:', firstCheckbox.checked);
} else {
    console.log('没有找到任何复选框！');
}
```

---

## 📸 请提供以下信息

如果还是没反应，请告诉我：

1. **控制台有什么输出？**（截图或复制文字）
2. **页面 URL 是什么？**（如果可以公开）
3. **选择的是什么模式？**（CDS/自定义/所有）
4. **是否看到 "[Checkbox Helper]" 的日志？**

---

## 💡 常见原因

| 现象 | 可能原因 | 解决方法 |
|------|---------|---------|
| 完全没日志 | 插件未加载 | 重新加载插件 + 刷新页面 |
| 显示找到0个 | 选择器不对 | 切换到"所有复选框"模式 |
| 有日志但没变化 | 框架问题 | 查看详细日志，可能需要特殊处理 |
| 报错 | 权限或语法错误 | 查看错误信息 |

---

**现在就试试这些步骤，然后告诉我看到了什么！** 👀
