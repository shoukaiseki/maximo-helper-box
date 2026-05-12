<template>
  <div class="maximo-table-wrapper">
    <!-- 表格工具栏 -->
    <div v-if="showToolbar" class="table-toolbar">
      <div class="toolbar-left">
        <h2 class="table-title">{{ title }}</h2>
        <span v-if="showRecordCount" class="record-count">({{ recordCountText }})</span>
      </div>
      <div class="toolbar-right">
        <!-- 工具栏按钮 -->
        <button 
          v-for="(action, index) in allToolbarActions" 
          :key="index"
          class="toolbar-btn"
          :title="action.title"
          @click="handleToolbarAction(action, index)"
        >
          <img v-if="action.icon" :src="action.icon" :alt="action.title" class="toolbar-icon">
        </button>
        
        <!-- 主要操作按钮 -->
        <button 
          v-if="primaryAction" 
          class="primary-action-btn"
          @click="handlePrimaryAction"
        >
          {{ primaryAction.label }}
        </button>
      </div>
    </div>
    
    <!-- 表格主体 -->
    <div class="maximo-table-container">
      <table class="maximo-table" :class="tableClass">
        <colgroup>
          <col
            v-for="(column, index) in columns"
            :key="index"
            :style="{ width: column.width || 'auto' }"
          />
          <col v-if="showActionColumn" style="width: 60px" />
        </colgroup>
        <thead v-if="columns && columns.length > 0">
          <tr>
            <th 
              v-for="(column, index) in columns" 
              :key="index"
              :class="getColumnHeaderClass(index)"
              :style="getColumnStyle(column)"
            >
              {{ column.label }}
            </th>
            <!-- 行内操作列 -->
            <th v-if="showActionColumn" class="action-column-header">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, rowIndex) in data"
            :key="rowIndex"
            :class="getRowClass(rowIndex)"
            @click="handleRowClick(rowIndex, row)"
            class="tablerow"
          >
            <td
              v-for="(column, colIndex) in columns"
              :key="colIndex"
              class="tc"
              :class="getCellClass(rowIndex, colIndex)"
              :style="getDataStyle(column)"
            >
              <!-- 如果 column.slotRender 为 true，使用 custom- 前缀的插槽 -->
              <slot v-if="column.slotRender" :name="`custom-${column.key}`" :row="row" :value="row[column.key]" :rowIndex="rowIndex" :column="column">
                {{ row[column.key] }}
              </slot>
              <!-- 否则使用默认的 cell- 前缀插槽 -->
              <slot v-else :name="`cell-${column.key}`" :row="row" :value="row[column.key]" :rowIndex="rowIndex">
                {{ row[column.key] }}
              </slot>
            </td>
            <!-- 行内操作列 -->
            <td v-if="showActionColumn" class="action-column-cell">
              <button 
                v-for="(action, actionIndex) in rowActions" 
                :key="actionIndex"
                class="row-action-btn"
                :title="action.title"
                @click="handleRowAction(action, rowIndex, row)"
              >
                <img v-if="action.icon" :src="action.icon" :alt="action.title" class="row-action-icon">
                <span v-else>{{ action.label }}</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 表格底部 -->
    <div v-if="showFooter" class="table-footer">
      <span class="footer-info">{{ recordCountText }}</span>
      <div class="footer-pagination">
        <button 
          class="pagination-btn" 
          :disabled="currentPage <= 1"
          @click="handlePageChange(currentPage - 1)"
        >
          ‹
        </button>
        <button 
          class="pagination-btn"
          :disabled="currentPage >= totalPages"
          @click="handlePageChange(currentPage + 1)"
        >
          ›
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true,
    default: () => []
  },
  data: {
    type: Array,
    required: true,
    default: () => []
  },
  tableClass: {
    type: [String, Array, Object],
    default: ''
  },
  selectable: {
    type: Boolean,
    default: true
  },
  modelValue: {
    type: [Number, null],
    default: null
  },
  // 工具栏相关
  title: {
    type: String,
    default: '列表'
  },
  showToolbar: {
    type: Boolean,
    default: true
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  showRecordCount: {
    type: Boolean,
    default: true
  },
  totalRecords: {
    type: Number,
    default: 0
  },
  pageSize: {
    type: Number,
    default: 5
  },
  currentPage: {
    type: Number,
    default: 1
  },
  toolbarActions: {
    type: Array,
    default: () => []
  },
  // 放在默认按钮之前的自定义按钮（优先级高于 customActionsFirst）
  toolbarActionsBefore: {
    type: Array,
    default: () => []
  },
  // 放在默认按钮之后的自定义按钮
  toolbarActionsAfter: {
    type: Array,
    default: () => []
  },
  primaryAction: {
    type: Object,
    default: null
  },
  // 是否显示默认工具栏按钮（筛选、清除筛选、下载）
  showDefaultActions: {
    type: Boolean,
    default: true
  },
  // 单独控制筛选按钮显示
  showFilterButton: {
    type: Boolean,
    default: true
  },
  // 单独控制清除筛选按钮显示
  showClearFilterButton: {
    type: Boolean,
    default: true
  },
  // 单独控制下载按钮显示
  showDownloadButton: {
    type: Boolean,
    default: true
  },
  // 自定义按钮是否放在默认按钮前面
  customActionsFirst: {
    type: Boolean,
    default: false
  },
  // 是否显示行内操作列
  showActionColumn: {
    type: Boolean,
    default: false
  },
  // 行内操作按钮配置
  rowActions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'update:modelValue', 
  'row-click',
  'toolbar-action',
  'primary-action',
  'page-change',
  'row-action'
])

const selectedIndex = ref(props.modelValue !== null && props.modelValue !== undefined ? props.modelValue : 0)

// 监听外部传入的modelValue变化
watch(() => props.modelValue, (newVal) => {
  if (newVal !== null && newVal !== undefined) {
    selectedIndex.value = newVal
  }
})

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(props.totalRecords / props.pageSize)
})

// 记录数文本
const recordCountText = computed(() => {
  const start = (props.currentPage - 1) * props.pageSize + 1
  const end = Math.min(props.currentPage * props.pageSize, props.totalRecords)
  return `${start} - ${end} of ${props.totalRecords}`
})

// 默认工具栏按钮（筛选、清除筛选、下载）
const defaultToolbarActions = computed(() => {
  if (!props.showDefaultActions) return []
  
  const actions = []
  
  // 筛选按钮
  if (props.showFilterButton) {
    actions.push({
      title: '筛选',
      icon: '/images/tablebtn_filter_off.gif',
      action: 'filter'
    })
  }
  
  // 清除筛选按钮
  if (props.showClearFilterButton) {
    actions.push({
      title: '清除筛选',
      icon: '/images/qf_clear_disabled.gif',
      action: 'clearFilter'
    })
  }
  
  // 下载按钮
  if (props.showDownloadButton) {
    actions.push({
      title: '下载',
      icon: '/images/tablebtn_download.gif',
      action: 'download'
    })
  }
  
  return actions
})

// 合并默认按钮和自定义按钮
const allToolbarActions = computed(() => {
  // 如果使用了 toolbarActionsBefore 或 toolbarActionsAfter，优先使用它们
  if (props.toolbarActionsBefore.length > 0 || props.toolbarActionsAfter.length > 0) {
    return [
      ...props.toolbarActionsBefore,
      ...defaultToolbarActions.value,
      ...props.toolbarActionsAfter
    ]
  }
  
  // 否则使用原来的逻辑（向后兼容）
  // 如果自定义按钮在前面
  if (props.customActionsFirst) {
    return [...props.toolbarActions, ...defaultToolbarActions.value]
  }
  // 否则默认按钮在前面
  return [...defaultToolbarActions.value, ...props.toolbarActions]
})

const getRowClass = (rowIndex) => {
  const classes = []
  
  if (props.selectable) {
    if (rowIndex === selectedIndex.value) {
      // 选中行：灰色背景 + 左边蓝色边框
      classes.push('hlsel')
      classes.push('selected-row')
    } else {
      // 未选中行：根据奇偶行设置背景
      classes.push(rowIndex % 2 === 0 ? 'treven' : 'trodd')
    }
  }
  
  return classes.join(' ')
}

const getCellClass = (rowIndex, colIndex) => {
  const classes = []
  
  if (props.selectable && rowIndex === selectedIndex.value && colIndex === 0) {
    // 第一列在选中时显示蓝色边框
    classes.push('selected-cell')
  }
  
  return classes.join(' ')
}

const getColumnHeaderClass = (index) => {
  return 'ct' // columntitle class from maximo.css
}

const getColumnStyle = (column) => {
  const style = {}
  if (column.width) {
    style.width = column.width
  }
  // 表头对齐：优先使用 align，其次 dataAlign，最后默认 center
  const align = column.align || column.dataAlign || 'center'
  style.textAlign = align
  return style
}

const getDataStyle = (column) => {
  const style = {}
  // 数据对齐：优先使用 dataAlign，如果没有则使用 align，最后默认 center
  const align = column.dataAlign || column.align || 'center'
  style.textAlign = align
  return style
}

const handleRowClick = (rowIndex, row) => {
  if (!props.selectable) return
  
  selectedIndex.value = rowIndex
  emit('update:modelValue', rowIndex)
  emit('row-click', { rowIndex, row })
}

// 工具栏按钮点击处理
const handleToolbarAction = (action, index) => {
  // 处理默认按钮动作
  if (action.action === 'filter') {
    console.log('触发筛选功能')
    // TODO: 实现筛选逻辑
  } else if (action.action === 'clearFilter') {
    console.log('清除筛选')
    // TODO: 实现清除筛选逻辑
  } else if (action.action === 'download') {
    console.log('触发表格下载')
    // TODO: 实现下载逻辑
  }
  
  // 触发自定义事件，让父组件可以处理
  emit('toolbar-action', { action, index })
}

// 行内操作按钮点击处理
const handleRowAction = (action, rowIndex, row) => {
  emit('row-action', { action, rowIndex, row })
}

// 主要操作按钮点击处理
const handlePrimaryAction = () => {
  emit('primary-action')
}

// 分页处理
const handlePageChange = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('page-change', page)
  }
}
</script>

<style scoped>
.maximo-table-wrapper {
  width: 100%;
  background: white;
  border: 1px solid #e0e0e0;
}

/* 工具栏样式 */
.table-toolbar {
  padding: 8px 12px;
  background: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.table-title {
  font-weight: 600;
  font-size: 14px;
  color: #161616;
  margin: 0;
}

.record-count {
  font-size: 13px;
  color: #525252;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-btn {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: background-color 0.2s;
}

.toolbar-btn:hover {
  background-color: #f5f5f5;
}

.toolbar-icon {
  width: 22px;
  height: 22px;
}

.primary-action-btn {
  background: #0f62fe;
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.primary-action-btn:hover {
  background: #0353e9;
}

.maximo-table-container {
  width: 100%;
  overflow-x: auto;
}

.maximo-table {
  width: 100%;
  table-layout: auto;
  border-collapse: collapse !important;
  font-size: 13px;
  font-family: MaximoBase, Arial, sans-serif;
  background: white;
}

/* 选中行的样式 - 灰色背景 */
.maximo-table tbody tr.selected-row {
  background-color: #e0e0e0 !important;
  border-left: 4px solid #0f62fe;
}

/* 选中行第一列的蓝色左边框 */
.maximo-table tbody tr.selected-row td:first-child {
  padding-left: calc(2px - 4px) !important;
}

/* 确保其他行没有左边框 */
.maximo-table tbody tr:not(.selected-row) {
  border-left: 4px solid transparent;
}

/* 表格单元格基础样式 */
.maximo-table td {
  padding: 3px 15px 0px 2px !important;
  border: 0px;
  height: 30px;
  font-size: 13px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #404040;
  vertical-align: middle;
}

/* 强制表头宽度生效 */
.maximo-table th {
  padding: 8px 12px;
  font-weight: bold;
  color: #444444;
  background: #e0e0e0;
  border-bottom: 1px solid #c6c6c6;
  min-width: 50px;
}

/* 鼠标悬停效果（仅对未选中的行） */
.maximo-table tbody tr:not(.selected-row):hover {
  background-color: #f5f5f5;
  cursor: pointer;
}

/* 选中行鼠标悬停时保持灰色背景 */
.maximo-table tbody tr.selected-row:hover {
  background-color: #e0e0e0 !important;
  cursor: pointer;
}

/* 行内操作列样式 */
.action-column-header {
  width: 60px;
  text-align: center;
}

.action-column-cell {
  width: 60px;
  text-align: center;
  padding: 4px;
}

/* 行内操作按钮样式 */
.row-action-btn {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: background-color 0.2s;
}

.row-action-btn:hover {
  background-color: #f5f5f5;
}

.row-action-icon {
  width: 20px;
  height: 20px;
}

/* 表格底部样式 */
.table-footer {
  background: #ffffff;
  border-top: 1px solid #e0e0e0;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-info {
  font-size: 13px;
  color: #525252;
}

.footer-pagination {
  display: flex;
  gap: 8px;
}

.pagination-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #0f62fe;
  transition: background-color 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f5f5f5;
}

.pagination-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
