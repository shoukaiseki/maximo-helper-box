# MaximoTable 组件更新说明

## 🎉 新增功能

根据 `maximo_components.html` 的设计，MaximoTable 组件已全面升级，新增了以下功能：

### 1. **表格工具栏**
- ✅ 显示表格标题和记录数
- ✅ 支持多个工具栏按钮（带图标）
- ✅ 支持主要操作按钮（蓝色按钮）
- ✅ 按钮悬停效果

### 2. **表格底部**
- ✅ 显示记录计数信息（如 "1 - 5 of 5"）
- ✅ 分页导航按钮（上一页/下一页）
- ✅ 禁用状态样式

### 3. **优化的行选择样式**
- ✅ 选中行：灰色背景 (#e0e0e0) + 蓝色左边框 (4px solid #0f62fe)
- ✅ 未选中行：透明左边框
- ✅ 鼠标悬停效果

## 📋 使用示例

### 基础用法（带工具栏）

```vue
<template>
  <MaximoTable
    v-model="selectedRowIndex"
    :columns="tableColumns"
    :data="tableData"
    title="表格(table)"
    :total-records="5"
    :current-page="1"
    :page-size="5"
    :toolbar-actions="toolbarActions"
    :primary-action="primaryAction"
    @row-click="handleRowClick"
    @toolbar-action="handleToolbarAction"
    @primary-action="handlePrimaryAction"
    @page-change="handlePageChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import MaximoTable from './components/MaximoTable.vue'

const selectedRowIndex = ref(0)

// 列配置
const tableColumns = [
  { key: 'select', label: '', width: '50px' },
  { key: 'name', label: 'Name', width: '180px' },
  { key: 'description', label: 'Description', width: '300px' },
  { key: 'defaultApp', label: 'Default Application' },
  { key: 'independent', label: 'Independent?', width: '200px' },
  { key: 'actions', label: '', width: '50px' }
]

// 数据
const tableData = ref([
  {
    select: '',
    name: 'MAXADMIN',
    description: 'Maximo Administrators',
    defaultApp: 'Admin App',
    independent: true,
    actions: ''
  },
  // ... 更多数据
])

// 工具栏按钮配置
const toolbarActions = ref([
  {
    title: 'New Row',
    icon: '/images/nav_icon_insertkey.gif',
    action: 'new-row'
  },
  {
    title: 'Clear Filter',
    icon: '/images/qf_clear_disabled.gif',
    disabled: true,
    action: 'clear-filter'
  },
  {
    title: 'Open Filter',
    icon: '/images/tablebtn_filter_off.gif',
    action: 'open-filter'
  },
  {
    title: 'Download',
    icon: '/images/tablebtn_download.gif',
    action: 'download'
  },
  {
    title: 'Hide Table',
    icon: '/images/minimize.gif',
    action: 'hide-table'
  }
])

// 主要操作按钮
const primaryAction = ref({
  label: 'Select Groups',
  action: 'select-groups'
})

// 事件处理
const handleRowClick = ({ rowIndex, row }) => {
  console.log('点击行:', rowIndex, row)
}

const handleToolbarAction = ({ action, index }) => {
  console.log('工具栏按钮:', action)
}

const handlePrimaryAction = () => {
  console.log('主要操作')
}

const handlePageChange = (page) => {
  console.log('分页:', page)
}
</script>
```

## 🔧 Props 说明

### 新增 Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | String | '表格(table)' | 表格标题 |
| showToolbar | Boolean | true | 是否显示工具栏 |
| showFooter | Boolean | true | 是否显示底部 |
| showRecordCount | Boolean | true | 是否显示记录数 |
| totalRecords | Number | 0 | 总记录数 |
| pageSize | Number | 5 | 每页记录数 |
| currentPage | Number | 1 | 当前页码 |
| toolbarActions | Array | [] | 工具栏按钮配置数组 |
| primaryAction | Object | null | 主要操作按钮配置 |

### 工具栏按钮配置

```javascript
{
  title: '按钮提示文本',
  icon: '/path/to/icon.png',  // 图标路径
  action: 'action-name',       // 动作标识
  disabled: false              // 是否禁用
}
```

### 主要操作按钮配置

```javascript
{
  label: '按钮文本',
  action: 'action-name'
}
```

## 📡 Events 说明

### 新增 Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| toolbar-action | { action, index } | 工具栏按钮点击 |
| primary-action | - | 主要操作按钮点击 |
| page-change | page (Number) | 分页变化 |

## 🎨 样式特点

### 工具栏
- 白色背景，底部边框
- 左侧：标题 + 记录数
- 右侧：图标按钮 + 主要操作按钮
- 按钮尺寸：40x40px
- 图标尺寸：22x22px

### 表格主体
- 表头：灰色背景 (#e0e0e0)
- 选中行：深灰背景 (#e0e0e0) + 蓝色左边框
- 悬停效果：浅灰背景 (#f5f5f5)

### 底部
- 白色背景，顶部边框
- 左侧：记录数信息
- 右侧：分页按钮

## 📁 图标文件

需要将以下图标文件复制到 `public/images/` 目录：

- nav_icon_insertkey.gif - 新建行
- qf_clear_disabled.gif - 清除筛选（禁用）
- tablebtn_filter_off.gif - 打开筛选
- tablebtn_download.gif - 下载
- minimize.gif - 隐藏表格

## ✨ 完整特性

1. ✅ 完整的工具栏布局
2. ✅ 图标按钮支持
3. ✅ 主要操作按钮（蓝色）
4. ✅ 记录数显示
5. ✅ 分页导航
6. ✅ 行选择交互（蓝色边框+灰色背景）
7. ✅ 响应式悬停效果
8. ✅ 禁用状态支持
9. ✅ 事件回调系统
10. ✅ 完全可配置

## 🚀 快速开始

```bash
npm run dev
```

访问 http://localhost:5173 查看完整演示！
