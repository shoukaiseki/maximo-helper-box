# Maximo 表单组件文档

## 📦 新增组件

根据 `maximo_components.html` 的设计，新增了三个Maximo表单组件：

1. **MaximoTextbox** - 单行文本框
2. **MaximoMultilineTextbox** - 多行文本框
3. **MaximoMultipartTextbox** - 多部分文本框（双输入框）

---

## 1️⃣ MaximoTextbox - 单行文本框

### 功能特性
- ✅ 支持必填标识（红色星号图标）
- ✅ 支持只读状态
- ✅ 支持右侧图标按钮（查找、菜单、日期等）
- ✅ 支持多种输入类型（text, password, date, time）
- ✅ 完整的Maximo样式还原

### 使用示例

```vue
<template>
  <!-- 必填文本框 + 查找图标 -->
  <MaximoTextbox
    v-model="value"
    label="单行文本框必填"
    :required="true"
    :show-icon="true"
    icon-src="/images/img_lookup.gif"
    icon-alt="Lookup"
  />
  
  <!-- 只读文本框 + 菜单图标 -->
  <MaximoTextbox
    v-model="readonlyValue"
    label="单行文本框只读"
    :readonly="true"
    :show-icon="true"
    icon-src="/images/img_menu.gif"
    icon-alt="Menu"
  />
  
  <!-- 日期输入框 -->
  <MaximoTextbox
    v-model="dateValue"
    label="日期"
    input-type="date"
    :show-icon="true"
    icon-src="/images/img_date.gif"
  />
</template>

<script setup>
import { ref } from 'vue'
import MaximoTextbox from './components/MaximoTextbox.vue'

const value = ref('TYPE 1')
const readonlyValue = ref('MAXADMIN')
const dateValue = ref('')
</script>
```

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | String/Number | '' | 绑定值 |
| label | String | 必填 | 标签文本 |
| required | Boolean | false | 是否必填 |
| readonly | Boolean | false | 是否只读 |
| placeholder | String | '' | 占位符 |
| width | String | '16.1ch' | 输入框宽度 |
| inputType | String | 'text' | 输入类型 (text/password/date/time) |
| showIcon | Boolean | false | 是否显示图标 |
| iconSrc | String | '' | 图标路径 |
| iconAlt | String | '' | 图标alt文本 |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | value | 值变化 |
| input | value | 输入事件 |
| change | value | 变更事件 |
| icon-click | - | 图标点击 |

---

## 2️⃣ MaximoMultilineTextbox - 多行文本框

### 功能特性
- ✅ 支持多行文本输入
- ✅ 支持必填标识
- ✅ 支持只读状态
- ✅ 可自定义宽高
- ✅ 支持垂直调整大小

### 使用示例

```vue
<template>
  <!-- 常规多行文本框 -->
  <MaximoMultilineTextbox
    v-model="multilineValue"
    label="多行文本框常规"
    width="1000px"
    height="80px"
  />
  
  <!-- 只读多行文本框 -->
  <MaximoMultilineTextbox
    v-model="readonlyValue"
    label="多行文本框只读"
    :readonly="true"
  />
  
  <!-- 必填多行文本框 -->
  <MaximoMultilineTextbox
    v-model="requiredValue"
    label="多行文本框必填"
    :required="true"
  />
</template>

<script setup>
import { ref } from 'vue'
import MaximoMultilineTextbox from './components/MaximoMultilineTextbox.vue'

const multilineValue = ref('')
const readonlyValue = ref('MAXADMIN')
const requiredValue = ref('')
</script>
```

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | String | '' | 绑定值 |
| label | String | 必填 | 标签文本 |
| required | Boolean | false | 是否必填 |
| readonly | Boolean | false | 是否只读 |
| placeholder | String | '' | 占位符 |
| width | String | '1000px' | 文本域宽度 |
| height | String | '80px' | 文本域高度 |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | value | 值变化 |
| input | value | 输入事件 |
| change | value | 变更事件 |

---

## 3️⃣ MaximoMultipartTextbox - 多部分文本框

### 功能特性
- ✅ 两个输入框组合
- ✅ 支持必填标识
- ✅ 支持只读状态
- ✅ 可自定义分隔符
- ✅ 返回对象格式 `{ first, second }`

### 使用示例

```vue
<template>
  <!-- 常规多部分文本框 -->
  <MaximoMultipartTextbox
    v-model="multipartValue"
    label="多部分文本框常规"
    :required="true"
  />
  
  <!-- 只读多部分文本框 -->
  <MaximoMultipartTextbox
    v-model="readonlyValue"
    label="多部分文本框只读"
    :readonly="true"
  />
</template>

<script setup>
import { ref } from 'vue'
import MaximoMultipartTextbox from './components/MaximoMultipartTextbox.vue'

// 值为对象格式
const multipartValue = ref({ first: 'TYPE 1', second: '' })
const readonlyValue = ref({ first: 'MAXADMIN', second: 'MAXADMIN' })
</script>
```

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | Object | { first: '', second: '' } | 绑定值（对象） |
| label | String | 必填 | 标签文本 |
| required | Boolean | false | 是否必填 |
| readonly | Boolean | false | 是否只读 |
| firstPlaceholder | String | '' | 第一个输入框占位符 |
| secondPlaceholder | String | '' | 第二个输入框占位符 |
| partWidth | String | '16.1ch' | 每个输入框宽度 |
| separators | Array | [blank.gif, blank.gif] | 分隔符配置 |

### 分隔符配置示例

```javascript
const separators = [
  { 
    src: '/images/blank.gif', 
    width: '4px', 
    height: '40px', 
    margin: '0px' 
  },
  { 
    src: '/images/blank.gif', 
    width: '4px', 
    height: '40px', 
    margin: '0px' 
  }
]
```

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | { first, second } | 值变化 |
| input | { first, second } | 输入事件 |

---

## 🎨 样式特点

### 通用样式
- **标签对齐**：右对齐，最小宽度200px
- **输入框高度**：40px
- **边框颜色**：#c6c6c6
- **聚焦效果**：蓝色边框 (#0f62fe) + 蓝色轮廓
- **必填标识**：左侧红色边框 (3px solid #da1e28)
- **只读状态**：灰色背景 (#f5f5f5)

### 图标按钮
- **尺寸**：40x40px
- **背景**：白色
- **边框**：1px solid #c6c6c6
- **悬停**：浅灰背景 (#e5e5e5)
- **禁用**：透明度0.6

---

## 📁 所需图标文件

以下图标文件需要放在 `public/images/` 目录：

- `required_label.gif` - 必填标识（红色星号）
- `img_lookup.gif` - 查找图标
- `img_menu.gif` - 菜单图标
- `img_date.gif` - 日期图标
- `img_date_time.gif` - 日期时间图标
- `blank.gif` - 空白分隔符

---

## 🚀 完整演示

在 App.vue 中已包含所有组件的完整演示：

```bash
npm run dev
```

访问 http://localhost:5173 查看：
1. 单行文本框（5种变体）
2. 多部分文本框（3种变体）
3. 多行文本框（3种变体）
4. 表格组件

---

## 💡 最佳实践

### 1. 表单布局
```vue
<div class="form-group">
  <MaximoTextbox ... />
  <MaximoTextbox ... />
  <MaximoMultilineTextbox ... />
</div>
```

### 2. 数据绑定
```javascript
// 单行/多行文本框
const value = ref('')

// 多部分文本框
const multipartValue = ref({ 
  first: '', 
  second: '' 
})
```

### 3. 事件处理
```javascript
const handleInput = (value) => {
  console.log('输入值:', value)
}

const handleIconClick = () => {
  // 打开查找对话框
  console.log('图标被点击')
}
```

---

## ✨ 组件优势

1. **完全还原Maximo设计** - 像素级还原原始UI
2. **灵活的配置** - 丰富的props和events
3. **Vue 3 Composition API** - 现代化的代码结构
4. **TypeScript友好** - 清晰的类型定义
5. **响应式设计** - 自动同步双向绑定
6. **易于扩展** - 模块化设计，便于定制

---

## 🔗 相关组件

- [MaximoTable](./TABLE_UPDATE.md) - 表格组件文档
