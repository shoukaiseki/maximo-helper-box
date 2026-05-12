<script setup>
import { ref } from 'vue'
import MaximoTable from '../components/MaximoTable.vue'
import MaximoSection from '../components/MaximoSection.vue'

// 表格列定义
const columns = [
  { key: 'recordnum', label: '盘点记录', width: '120px', dataAlign: 'left' },
  { key: 'storeroom', label: '盘点仓库', width: '120px', dataAlign: 'left' },
  { key: 'countdate', label: '盘点日期', width: '120px', dataAlign: 'center' },
  { key: 'counter', label: '盘点人员', width: '120px', dataAlign: 'center' },
  { key: 'status', label: '状态', width: '200px', dataAlign: 'center' },
  { key: 'adjustresult', label: '调整结果', width: '100px', dataAlign: 'center' },
  { key: 'reviewer', label: '审核人员', width: '120px', dataAlign: 'center' }
]

// 模拟数据
const tableData = ref([
  {
    recordnum: 'PD-001',
    storeroom: 'CK-001',
    countdate: '2026-04-30',
    counter: '赵',
    status: '执行中',
    adjustresult: '完成',
    reviewer: '王'
  },
  {
    recordnum: 'PD-002',
    storeroom: 'CK-002',
    countdate: '2026-05-01',
    counter: '李',
    status: '已完成',
    adjustresult: '完成',
    reviewer: '张'
  },
  {
    recordnum: 'PD-003',
    storeroom: 'CK-001',
    countdate: '2026-05-05',
    counter: '刘',
    status: '结果确认',
    adjustresult: '完成',
    reviewer: '赵'
  }
])

// 工具栏按钮配置（在默认按钮之前）
const toolbarActions = [
  {
    title: '新增',
    icon: '/images/nav_icon_insert.gif'
  }
]

// 处理工具栏操作
const handleToolbarAction = ({ action }) => {
  if (action.title === '新增') {
    console.log('新增盘点记录')
    // TODO: 跳转到新增页面或打开对话框
  }
}

// 处理行点击
const handleRowClick = ({ rowIndex, row }) => {
  console.log('选中行:', rowIndex, row)
  // TODO: 可以跳转到详情页
}
</script>

<template>
  <div class="inventory-count-list">
    <h1 class="page-title">盘点主列表</h1>

    <!-- 盘点列表 -->
    <MaximoSection>
      <MaximoTable
        title="盘点信息"
        :columns="columns"
        :data="tableData"
        :show-toolbar="true"
        :show-footer="true"
        :selectable="true"
        :total-records="tableData.length"
        :page-size="15"
        :current-page="1"
        :toolbar-actions-before="toolbarActions"
        @toolbar-action="handleToolbarAction"
        @row-click="handleRowClick"
      />
    </MaximoSection>
  </div>
</template>

<style scoped>
.inventory-count-list {
  padding: 20px;
}

.page-title {
  color: #161616;
  font-size: 28px;
  margin-bottom: 30px;
  border-bottom: 2px solid #0F62FE;
  padding-bottom: 10px;
}
</style>
