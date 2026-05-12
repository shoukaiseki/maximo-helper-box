# 更新日志

## v1.0.1 (2026-05-12)

### 🐛 Bug 修复

**修复双向绑定页面的复选框状态恢复问题**

#### 问题描述
在使用 React、Vue 等现代前端框架的页面中，直接修改 DOM 的 `checked` 属性后，当页面滚动或重新渲染时，复选框会恢复到原始状态。这是因为框架的双向数据绑定机制会覆盖手动修改的 DOM 属性。

#### 解决方案
采用多层事件触发策略来确保框架能够正确捕获状态变化：

1. **使用原生值设置器**
   - 通过 `Object.getOwnPropertyDescriptor` 获取原生的 `checked` 属性设置器
   - 绕过框架的属性拦截器，直接设置底层值

2. **触发多种事件**
   - `input` 事件：某些框架监听此事件
   - `change` 事件：标准的表单变化事件
   - `click` 事件：模拟真实用户点击

3. **冒泡到父元素**
   - 在父元素上也触发 click 事件
   - 确保事件委托机制能正常工作

4. **智能跳过**
   - 如果复选框已经是目标状态，则跳过操作
   - 避免不必要的事件触发

#### 技术细节

```javascript
// 之前的实现（有问题）
checkbox.checked = true;
checkbox.dispatchEvent(new Event('change', { bubbles: true }));

// 现在的实现（支持双向绑定）
const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype, 
    'checked'
).set;

nativeInputValueSetter.call(checkbox, targetState);

// 触发多个事件
checkbox.dispatchEvent(new Event('input', { bubbles: true }));
checkbox.dispatchEvent(new Event('change', { bubbles: true }));
checkbox.dispatchEvent(new MouseEvent('click', { bubbles: true }));
```

#### 兼容性
- ✅ React (所有版本)
- ✅ Vue 2/3
- ✅ Angular
- ✅ Svelte
- ✅ 原生 JavaScript
- ✅ jQuery

#### 测试建议
修复后请测试以下场景：
1. 勾选复选框后滚动页面
2. 勾选复选框后等待几秒观察
3. 勾选复选框后执行其他页面操作
4. 在不同框架的页面上测试

---

## v1.0.0 (2026-05-12)

### ✨ 初始版本

- 支持批量勾选 CDS 复选框
- 支持自定义 CSS 选择器
- 支持全选/取消/反选操作
- 实时统计复选框数量
- Manifest V3 标准
