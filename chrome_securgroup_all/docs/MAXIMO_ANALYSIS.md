# 🔍 Maximo 复选框问题分析

## 📊 发现的代码结构

通过分析 `output.js`（解压缩后的 Maximo 代码），我发现了复选框的工作机制：

### 关键发现

#### 1. 复选框 HTML 结构
```javascript
// 第 236676 行
<input
  type="checkbox"
  className: "cds--checkbox",
  id: `${this.props.id}_selectionCheckBoxInput`,
  onChange: this.primaryAction,  // ← 关键！
  checked: n  // React 控制的状态
/>
```

#### 2. onChange 处理器
```javascript
// 第 236531 行 - primaryAction 函数
async primaryAction(e) {
  const { target: r } = e.nativeEvent;
  
  // 第 236567 行 - 实际切换选择的代码
  this.props.datasource.toggleSelected(this.props.index);
  
  // ... 其他逻辑
}
```

#### 3. 问题根源

**Maximo 使用 React 控制复选框状态**：
- ✅ `checked` 属性由 React state 控制（`checked: n`）
- ✅ 变化通过 `onChange` 触发 `primaryAction` 函数
- ✅ `primaryAction` 调用 `datasource.toggleSelected(index)` 来更新数据源
- ❌ 直接修改 DOM 的 `checked` 属性不会触发 React 的 onChange
- ❌ 滚动页面时，React 重新渲染会用 state 覆盖 DOM

---

## 💡 解决方案

### 方案A：模拟真实点击 Label（推荐）⭐

从代码可以看到，复选框有一个包装元素和 label：

```javascript
// 第 236673-236681 行
<div className="mx--checkbox-wrapper">
  <Checkbox
    label=""
    id={`${this.props.id}_selectionCheckBoxInput`}
    onChange={this.primaryAction}  // ← 这个会被触发
    checked={n}
  />
</div>
```

**策略**：
1. 找到复选框的 label 元素
2. 在 label 上触发真实的 click 事件
3. React 会捕获这个事件并调用 `primaryAction`
4. `primaryAction` 会调用 `toggleSelected` 更新状态

### 方案B：直接调用 toggleSelected

如果能访问到 React 组件实例，可以直接调用：

```javascript
// 伪代码
const reactComponent = getReactComponent(checkbox);
reactComponent.props.datasource.toggleSelected(index);
```

但这需要访问 React 内部，比较复杂。

### 方案C：增强事件触发（当前实现）

结合多种事件触发方式：
1. input 事件
2. change 事件
3. click 事件（带详细参数）
4. mousedown/mouseup 事件
5. **label 元素的 click 事件** ⭐ 新增

---

## 🎯 最佳实践

### 对于 Maximo 这类 React 应用

1. **优先触发 label 的点击事件**
   ```javascript
   const label = checkbox.parentElement.querySelector('label');
   if (label) {
       label.click(); // 或 dispatchEvent
   }
   ```

2. **然后才修改 DOM 属性**
   ```javascript
   const setter = Object.getOwnPropertyDescriptor(
       HTMLInputElement.prototype, 'checked'
   ).set;
   setter.call(checkbox, true);
   ```

3. **最后触发额外事件作为保险**
   ```javascript
   checkbox.dispatchEvent(new Event('change', { bubbles: true }));
   ```

---

## 📝 已实施的改进

在 v1.0.5 版本中，我已经添加了：

✅ 触发 label 元素的 click 事件  
✅ 更详细的 MouseEvent 参数（detail, buttons）  
✅ mousedown 和 mouseup 事件  
✅ 父元素的事件冒泡  
✅ 详细的日志输出  

---

## 🧪 测试建议

### 测试步骤

1. **重新加载插件**（chrome://extensions/ → 刷新）
2. **刷新 Maximo 页面**
3. **点击"全选"**
4. **观察控制台日志**，应该看到：
   ```
   [Checkbox Helper] 找到 label 元素，模拟点击
   [Checkbox Helper] Label 点击事件已触发
   [Checkbox Helper] 触发 label 元素事件
   ```

5. **滚动页面**
6. **检查复选框是否保持勾选**

---

## 🔧 如果还是不行

可能需要：

### 选项1：延迟执行
```javascript
setTimeout(() => {
    label.click();
}, 50); // 延迟50毫秒
```

### 选项2：多次触发
```javascript
// 触发两次确保 React 捕获
label.click();
setTimeout(() => label.click(), 10);
```

### 选项3：使用 React DevTools 钩子
如果能访问 React 内部，可以直接操作 state。

---

## 📞 下一步

请测试 v1.0.5 版本，然后告诉我：

1. ✅ 滚动后复选框是否保持勾选？
2. 📊 控制台是否显示"找到 label 元素"的日志？
3. ❌ 如果还是恢复，有多少个复选框恢复？

根据结果，我会进一步优化！💪
