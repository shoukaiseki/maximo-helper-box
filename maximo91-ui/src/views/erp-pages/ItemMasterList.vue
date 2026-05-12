<script setup>
import { ref } from 'vue'
import MaximoTable from '../components/MaximoTable.vue'
import MaximoSection from '../components/MaximoSection.vue'

// 表格列定义
const columns = [
  { key: 'itemnum', label: '零件编号', width: '150px', align: 'center', dataAlign: 'left' },
  { key: 'description', label: '零件名称', width: '200px', align: 'center', dataAlign: 'left' },
  { key: 'descriptionEn', label: '英文名称', width: '200px', align: 'center', dataAlign: 'left' },
  { key: 'classification', label: '分类', width: '120px', align: 'center', dataAlign: 'left' },
  { key: 'orderunit', label: '单位', width: '80px', align: 'center', dataAlign: 'center' },
  { key: 'unitcost', label: '单价(CNY)', width: '120px', align: 'center', dataAlign: 'right' },
  { key: 'amount', label: '金额(CNY)', width: '120px', align: 'center', dataAlign: 'right' },
  { key: 'supplier', label: '供应商', width: '150px', align: 'center', dataAlign: 'left' },
  { key: 'status', label: '状态', width: '80px', align: 'center', dataAlign: 'center' }
]

// 模拟数据
const tableData = ref([
  {
    itemnum: 'ITEM001',
    description: '螺栓M10',
    descriptionEn: 'Bolt M10',
    classification: '紧固件',
    orderunit: '个',
    unitcost: 2.50,
    amount: 2500.00,
    supplier: '供应商A',
    status: '活动'
  },
  {
    itemnum: 'ITEM002',
    description: '螺母M10',
    descriptionEn: 'Nut M10',
    classification: '紧固件',
    orderunit: '个',
    unitcost: 1.80,
    amount: 3600.00,
    supplier: '供应商B',
    status: '活动'
  },
  {
    itemnum: 'ITEM003',
    description: '垫片M10',
    descriptionEn: 'Washer M10',
    classification: '紧固件',
    orderunit: '个',
    unitcost: 0.50,
    amount: 2500.00,
    supplier: '供应商A',
    status: '活动'
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
    console.log('新增零件Master')
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
  <div class="item-master-list">
    <h1 class="page-title">零件Master列表</h1>

    <!-- 零件Master列表 -->
    <MaximoSection>
      <MaximoTable
    title="零件Master列表"
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
.item-master-list {
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
