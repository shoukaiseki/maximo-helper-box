<script setup>
import { ref } from 'vue'
import MaximoTable from '../../components/MaximoTable.vue'
import MaximoSection from '../../components/MaximoSection.vue'

// 表格列定义
const columns = [
  { key: 'assetCode', label: '资产编号', width: '150px', align: 'center', dataAlign: 'left' },
  { key: 'assetName', label: '资产名称', width: '200px', align: 'center', dataAlign: 'left' },
  { key: 'category', label: '资产类别', width: '120px', align: 'center', dataAlign: 'left' },
  { key: 'specification', label: '规格型号', width: '180px', align: 'center', dataAlign: 'left' },
  { key: 'purchaseDate', label: '购置日期', width: '120px', align: 'center', dataAlign: 'center' },
  { key: 'originalValue', label: '原值(CNY)', width: '130px', align: 'center', dataAlign: 'right' },
  { key: 'netValue', label: '净值(CNY)', width: '130px', align: 'center', dataAlign: 'right' },
  { key: 'department', label: '使用部门', width: '120px', align: 'center', dataAlign: 'left' },
  { key: 'status', label: '状态', width: '80px', align: 'center', dataAlign: 'center' }
]

// 模拟数据
const tableData = ref([
  {
    assetCode: 'AST001',
    assetName: '数控机床A',
    category: '生产设备',
    specification: 'CNC-5000',
    purchaseDate: '2023-06-15',
    originalValue: 500000.00,
    netValue: 425000.00,
    department: '生产部',
    status: '在用'
  },
  {
    assetCode: 'AST002',
    assetName: '注塑机B',
    category: '生产设备',
    specification: 'IM-200T',
    purchaseDate: '2022-09-20',
    originalValue: 350000.00,
    netValue: 280000.00,
    department: '生产部',
    status: '在用'
  },
  {
    assetCode: 'AST003',
    assetName: '办公电脑',
    category: '办公设备',
    specification: 'Dell OptiPlex',
    purchaseDate: '2024-01-10',
    originalValue: 8000.00,
    netValue: 7200.00,
    department: '财务部',
    status: '在用'
  },
  {
    assetCode: 'AST004',
    assetName: '货车',
    category: '运输设备',
    specification: '福田欧马可',
    purchaseDate: '2021-03-25',
    originalValue: 180000.00,
    netValue: 108000.00,
    department: '物流部',
    status: '在用'
  },
  {
    assetCode: 'AST005',
    assetName: '空调系统',
    category: '电气设备',
    specification: '中央空调5P',
    purchaseDate: '2020-07-30',
    originalValue: 45000.00,
    netValue: 22500.00,
    department: '行政部',
    status: '维修中'
  }
])

// 工具栏按钮配置
const toolbarActions = [
  {
    title: '新增',
    icon: '/images/nav_icon_insert.gif'
  }
]

// 处理工具栏操作
const handleToolbarAction = ({ action }) => {
  if (action.title === '新增') {
    console.log('新增资产')
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
  <div class="asset-list">
    <h1 class="page-title">资产管理列表</h1>

    <!-- 资产列表 -->
    <MaximoSection title="资产信息">
      <MaximoTable
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
.asset-list {
  padding: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}
</style>
