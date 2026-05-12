<script setup>
import { ref } from 'vue'
import MaximoTable from '../components/MaximoTable.vue'

// 定义表格列配置
const tableColumns = [
  { key: 'select', label: '', width: '50px' },
  { key: 'templateCode', label: '模板编号', width: '120px' },
  { key: 'templateName', label: '模板名称', width: '180px' },
  { key: 'supplierType', label: '供应商类型', width: '120px' },
  { key: 'totalScore', label: '总分', width: '80px', dataAlign: 'right' },
  { key: 'passScore', label: '合格分', width: '80px', dataAlign: 'right' },
  { key: 'status', label: '状态', width: '100px' },
  { key: 'version', label: '版本号', width: '80px' },
  { key: 'effectiveDate', label: '生效日期', width: '120px' }
]

// 定义测试数据
const tableData = ref([
  {
    select: '',
    templateCode: 'SQA-001',
    templateName: '供应商评价模板',
    supplierType: '服务',
    totalScore: 100,
    passScore: 80,
    status: '已发布',
    version: 'V1.0',
    effectiveDate: '2026-04-01'
  },
  {
    select: '',
    templateCode: 'SQA-002',
    templateName: '供应商评价模板A',
    supplierType: '零件',
    totalScore: 100,
    passScore: 75,
    status: '已发布',
    version: 'V1.0',
    effectiveDate: '2026-03-15'
  },
  {
    select: '',
    templateCode: 'SQA-003',
    templateName: '供应商评价模板B',
    supplierType: '物流',
    totalScore: 100,
    passScore: 85,
    status: '草稿',
    version: 'V1.0',
    effectiveDate: '2026-05-01'
  }
])

// 当前选中的行索引
const selectedRowIndex = ref(null)

// 工具栏按钮配置
const toolbarActions = ref([
  {
    title: '新增',
    icon: '/images/nav_icon_insertkey.gif',
    action: 'new'
  }
])

// 处理行点击事件
const handleRowClick = ({ rowIndex, row }) => {
  console.log('点击了行:', rowIndex, row)
  console.log('跳转到详情页:', row.templateCode)
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
  <div class="supplier-evaluation-template-list">
    <h1 class="page-title">供应商评价模板列表</h1>

    <div class="demo-section">
      <MaximoTable
        v-model="selectedRowIndex"
        :columns="tableColumns"
        :data="tableData"
        title="供应商评价模板列表"
        :total-records="3"
        :current-page="1"
        :page-size="10"
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
.supplier-evaluation-template-list {
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
