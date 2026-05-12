<script setup>
import { ref } from 'vue'
import MaximoTable from '../../components/MaximoTable.vue'
import MaximoSection from '../../components/MaximoSection.vue'

// 表格列定义
const columns = [
  { key: 'poNumber', label: '采购订单号', width: '150px', align: 'center', dataAlign: 'left' },
  { key: 'supplier', label: '供应商', width: '200px', align: 'center', dataAlign: 'left' },
  { key: 'orderDate', label: '订单日期', width: '120px', align: 'center', dataAlign: 'center' },
  { key: 'deliveryDate', label: '交货日期', width: '120px', align: 'center', dataAlign: 'center' },
  { key: 'totalAmount', label: '总金额(CNY)', width: '130px', align: 'center', dataAlign: 'right' },
  { key: 'status', label: '状态', width: '100px', align: 'center', dataAlign: 'center' },
  { key: 'creator', label: '创建人', width: '100px', align: 'center', dataAlign: 'left' }
]

// 模拟数据
const tableData = ref([
  {
    poNumber: 'PO2026050001',
    supplier: '北京科技有限公司',
    orderDate: '2026-05-01',
    deliveryDate: '2026-05-15',
    totalAmount: 50000.00,
    status: '已审批',
    creator: '张三'
  },
  {
    poNumber: 'PO2026050002',
    supplier: '上海贸易公司',
    orderDate: '2026-05-02',
    deliveryDate: '2026-05-20',
    totalAmount: 75000.00,
    status: '待审批',
    creator: '李四'
  },
  {
    poNumber: 'PO2026050003',
    supplier: '广州制造厂',
    orderDate: '2026-05-03',
    deliveryDate: '2026-05-18',
    totalAmount: 32000.00,
    status: '已完成',
    creator: '王五'
  },
  {
    poNumber: 'PO2026050004',
    supplier: '深圳电子公司',
    orderDate: '2026-05-05',
    deliveryDate: '2026-05-25',
    totalAmount: 128000.00,
    status: '已发货',
    creator: '赵六'
  },
  {
    poNumber: 'PO2026050005',
    supplier: '杭州机械厂',
    orderDate: '2026-05-08',
    deliveryDate: '2026-05-22',
    totalAmount: 95000.00,
    status: '待审批',
    creator: '孙七'
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
    console.log('新增采购订单')
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
  <div class="purchase-order-list">
    <h1 class="page-title">采购订单列表</h1>

    <!-- 采购订单列表 -->
    <MaximoSection title="采购订单信息">
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
.purchase-order-list {
  padding: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}
</style>
