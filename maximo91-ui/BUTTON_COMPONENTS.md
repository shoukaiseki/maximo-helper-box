# Maximo 按钮组件文档

本文档介绍 Maximo Vue 组件库中的按钮相关组件。

## 组件列表

- [MaximoButton](#maximobutton) - 单个按钮组件
- [MaximoButtonGroup](#maximobuttongroup) - 按钮组容器组件

---

## MaximoButton

单个按钮组件，遵循 Maximo 设计规范。

### 基本用法

```vue
<template>
  <!-- 普通按钮（蓝色边框） -->
  <MaximoButton label="普通按钮" @click="handler" />
  
  <!-- 主要按钮（蓝色背景） -->
  <MaximoButton label="主要按钮" :default="true" @click="handler" />
  
  <!-- 禁用按钮 -->
  <MaximoButton label="禁用按钮" :disabled="true" />
</template>

<script setup>
import MaximoButton from '@/components/MaximoButton.vue'

const handler = () => {
  console.log('按钮被点击')
}
</script>
```

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `label` | String | `''` | 按钮文本 |
| `type` | String | `'button'` | 按钮类型：`button`、`submit`、`reset` |
| `default` | Boolean | `false` | 是否为默认/主要按钮（蓝色背景） |
| `disabled` | Boolean | `false` | 是否禁用 |
| `title` | String | `''` | 按钮标题（tooltip） |
| `customClass` | String | `''` | 自定义类名 |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `click` | `(event)` | 按钮点击事件 |

### Slots

| 插槽名 | 说明 |
|--------|------|
| `default` | 按钮内容，可用于自定义按钮内部 HTML |

### 示例

#### 1. 使用 label 属性

```vue
<MaximoButton label="保存" @click="save" />
```

#### 2. 使用 slot 自定义内容

```vue
<MaximoButton @click="handler">
  <span style="font-weight: bold;">自定义内容</span>
</MaximoButton>
```

#### 3. 主要按钮

```vue
<MaximoButton label="确定" :default="true" @click="confirm" />
```

#### 4. 带 tooltip 的按钮

```vue
<MaximoButton 
  label="悬停查看" 
  title="这是一个提示信息"
  @click="handler" 
/>
```

---

## MaximoButtonGroup

按钮组容器组件，用于组织和排列多个按钮。

### 基本用法

```vue
<template>
  <MaximoButtonGroup>
    <MaximoButton label="保存" :default="true" @click="save" />
    <MaximoButton label="取消" @click="cancel" />
    <MaximoButton label="关闭" @click="close" />
  </MaximoButtonGroup>
</template>

<script setup>
import MaximoButtonGroup from '@/components/MaximoButtonGroup.vue'
import MaximoButton from '@/components/MaximoButton.vue'

const save = () => console.log('保存')
const cancel = () => console.log('取消')
const close = () => console.log('关闭')
</script>
```

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `align` | String | `'right'` | 对齐方式：`left`、`center`、`right` |
| `bottom` | Boolean | `false` | 是否为底部按钮组（对话框样式） |
| `invisible` | Boolean | `false` | 是否隐藏按钮组容器样式 |
| `customClass` | String | `''` | 自定义类名 |

### Slots

| 插槽名 | 说明 |
|--------|------|
| `default` | 按钮内容，放置 MaximoButton 组件 |

### 示例

#### 1. 右对齐按钮组（默认）

```vue
<MaximoButtonGroup>
  <MaximoButton label="保存" :default="true" @click="save" />
  <MaximoButton label="取消" @click="cancel" />
</MaximoButtonGroup>
```

#### 2. 左对齐按钮组

```vue
<MaximoButtonGroup align="left">
  <MaximoButton label="上一步" @click="prev" />
  <MaximoButton label="下一步" :default="true" @click="next" />
</MaximoButtonGroup>
```

#### 3. 居中对齐按钮组

```vue
<MaximoButtonGroup align="center">
  <MaximoButton label="确认" :default="true" @click="confirm" />
  <MaximoButton label="取消" @click="cancel" />
</MaximoButtonGroup>
```

#### 4. 底部按钮组（对话框样式）

```vue
<MaximoButtonGroup bottom>
  <MaximoButton label="确定" :default="true" @click="confirm" />
  <MaximoButton label="取消" @click="cancel" />
</MaximoButtonGroup>
```

#### 5. 隐藏样式的按钮组

```vue
<MaximoButtonGroup invisible>
  <MaximoButton label="按钮1" @click="handler1" />
  <MaximoButton label="按钮2" @click="handler2" />
</MaximoButtonGroup>
```

---

## 实际应用场景

### 1. 表单操作按钮

```vue
<MaximoButtonGroup align="right">
  <MaximoButton label="提交" :default="true" @click="submit" />
  <MaximoButton label="重置" @click="reset" />
  <MaximoButton label="返回" @click="back" />
</MaximoButtonGroup>
```

### 2. 对话框按钮

```vue
<MaximoButtonGroup bottom>
  <MaximoButton label="是" :default="true" @click="yes" />
  <MaximoButton label="否" @click="no" />
  <MaximoButton label="取消" @click="cancel" />
</MaximoButtonGroup>
```

### 3. 工具栏按钮

```vue
<MaximoButtonGroup invisible align="left">
  <MaximoButton label="新建" :default="true" @click="create" />
  <MaximoButton label="编辑" @click="edit" />
  <MaximoButton label="删除" @click="remove" />
  <MaximoButton label="刷新" @click="refresh" />
</MaximoButtonGroup>
```

### 4. 在 MaximoSection 中使用

```vue
<MaximoSection title="操作区域">
  <!-- 其他内容 -->
  
  <MaximoButtonGroup align="right">
    <MaximoButton label="保存" :default="true" @click="save" />
    <MaximoButton label="取消" @click="cancel" />
  </MaximoButtonGroup>
</MaximoSection>
```

---

## 样式说明

### MaximoButton 样式

- **普通按钮**：透明背景，蓝色边框（#0f62fe），蓝色文字
- **主要按钮**：蓝色背景（#0f62fe），白色文字
- **悬停效果**：背景变为深蓝色（#0353e9）
- **焦点效果**：显示蓝色边框和阴影
- **禁用状态**：透明度 50%，不可点击

### MaximoButtonGroup 样式

- **默认布局**：Flexbox，右对齐，间距 8px
- **底部样式**：添加白色背景和顶部边框
- **响应式**：在小屏幕（<768px）自动切换为垂直布局

---

## 注意事项

1. **按钮文本**：建议使用简洁明了的文本，长度适中
2. **主要按钮**：每个按钮组中建议只有一个 `:default="true"` 的主要按钮
3. **对齐方式**：根据业务场景选择合适的对齐方式
   - 表单操作通常右对齐
   - 向导步骤通常左对齐或居中
4. **禁用状态**：在数据验证失败或操作不可用时，及时禁用按钮
5. **无障碍**：按钮会自动处理键盘焦点和点击事件

---

## 演示页面

访问 `/button-demo` 路由查看所有按钮组件的完整演示和代码示例。

```bash
# 启动开发服务器
npm run dev

# 访问演示页面
http://localhost:5173/button-demo
```

---

## 更新日志

### v1.0.0 (2026-05-07)
- 初始版本发布
- 实现 MaximoButton 组件
- 实现 MaximoButtonGroup 组件
- 支持多种对齐方式和样式变体
- 完整的 TypeScript 类型支持
