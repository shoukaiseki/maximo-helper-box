<script setup>
import { ref } from 'vue'
import MaximoTable from '../components/MaximoTable.vue'

// 定义表格列配置 (ITEMRM - 申请单头)
const tableColumns = [
  { key: 'select', label: '', width: '50px' },
  { key: 'itemrmnum', label: '登记申请单号', width: '150px' },
  { key: 'supplier', label: '供应商', width: '150px' },
  { key: 'applicant', label: '申请人', width: '100px' },
  { key: 'applyDate', label: '申请日期', width: '120px' },
  { key: 'project', label: 'プロジェクト', width: '120px' },
  { key: 'accountingClass', label: '計上分類', width: '120px' },
  { key: 'status', label: '状态', width: '100px' }
]

// 定义测试数据 (ITEMRM - 申请单头)
const tableData = ref([
  {
    select: '',
    itemrmnum: 'ITEMRM-2026001',
    supplier: 'XX供应商',
    applicant: '张三',
    applyDate: '2026-05-09',
    project: 'PJ-001',
    accountingClass: 'AC-01',
    status: '草稿'
  },
  {
    select: '',
    itemrmnum: 'ITEMRM-2026002',
    supplier: 'YY供应商',
    applicant: '李四',
    applyDate: '2026-05-10',
    project: 'PJ-002',
    accountingClass: 'AC-02',
    status: '审批中'
  },
  {
    select: '',
    itemrmnum: 'ITEMRM-2026003',
    supplier: 'ZZ供应商',
    applicant: '王五',
    applyDate: '2026-05-11',
    project: 'PJ-003',
    accountingClass: 'AC-01',
    status: '已完成'
  }
])

// 当前选中的行索引，默认为null
const selectedRowIndex = ref(null)

// 工具栏按钮配置
const toolbarActions = ref([
  {
    title: '新增',
    icon: '/images/nav_icon_insertkey.gif',
    action: 'new'
  },
])

// 主要操作按钮
const primaryAction = [];
const primaryActionBak=ref({
  label: '查询',
  action: 'query'
})

// 处理行点击事件
const handleRowClick = ({ rowIndex, row }) => {
  console.log('点击了行:', rowIndex, row)
  // 跳转到详情页
  console.log('跳转到详情页:', row.itemrmnum)
}

// 处理工具栏按钮点击
const handleToolbarAction = ({ action, index }) => {
  console.log('工具栏按钮点击:', action, index)
}

// 处理主要操作按钮点击
const handlePrimaryAction = () => {
  console.log('主要操作按钮点击')
}

// 处理分页变化
const handlePageChange = (page) => {
  console.log('分页变化:', page)
}
</script>

<template>
  <div class="parts-application-list">
    <h1 class="page-title">零件登记申请列表</h1>

    <div class="demo-section">
      <MaximoTable
        v-model="selectedRowIndex"
        :columns="tableColumns"
        :data="tableData"
        title="零件登记申请列表"
        :total-records="5"
        :current-page="1"
        :page-size="5"
        :toolbar-actions-before="toolbarActions"
        @row-click="handleRowClick"
        @toolbar-action="handleToolbarAction"
        @primary-action="handlePrimaryAction"
        @page-change="handlePageChange"
      />

      <div class="selection-info" v-if="selectedRowIndex !== null">
        <strong>当前选中行索引：</strong>{{ selectedRowIndex }}<br>
        <strong>选中数据：</strong>{{ JSON.stringify(tableData[selectedRowIndex], null, 2) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.parts-application-list {
  padding: 20px;
}

.page-title {
  color: #161616;
  font-size: 28px;
  margin-bottom: 30px;
  border-bottom: 2px solid #0F62FE;
  padding-bottom: 10px;
}

.demo-section {
  background: white;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.selection-info {
  margin-top: 20px;
  padding: 15px;
  background-color: #F5F5F5;
  border-left: 3px solid #0F62FE;
  border-radius: 4px;
  font-size: 13px;
  line-height: 1.8;
}

.selection-info strong {
  color: #161616;
}
</style>
