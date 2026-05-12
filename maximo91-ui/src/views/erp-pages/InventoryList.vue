<script setup>
import { ref } from 'vue'
import MaximoTable from '../components/MaximoTable.vue'
import MaximoSection from '../components/MaximoSection.vue'

// 表格列定义
const columns = [
  { key: 'itemnum', label: '零件编号', width: '120px', align: 'center', dataAlign: 'left' },
  { key: 'description', label: '零件名称', width: '150px', align: 'center', dataAlign: 'left' },
  { key: 'descriptionEn', label: '英文名称', width: '180px', align: 'center', dataAlign: 'left' },
  { key: 'batchnum', label: '批号', width: '120px', align: 'center', dataAlign: 'left' },
  { key: 'storeroom', label: '仓库', width: '120px', align: 'center', dataAlign: 'left' },
  { key: 'inventory', label: '库存数量', width: '100px', align: 'center', dataAlign: 'right' },
  { key: 'availableqty', label: '可用数量', width: '100px', align: 'center', dataAlign: 'right' },
  { key: 'reservedqty', label: '预留数量', width: '100px', align: 'center', dataAlign: 'right' },
  { key: 'safetyqty', label: '安全库存', width: '100px', align: 'center', dataAlign: 'right' },
  { key: 'totalpurchase', label: '累计采购数', width: '100px', align: 'center', dataAlign: 'right' },
  { key: 'invstatus', label: '库存状态', width: '100px', align: 'center', dataAlign: 'center' },
  { key: 'status', label: '状态', width: '80px', align: 'center', dataAlign: 'center' }
]

// 模拟数据（8条）
const tableData = ref([
  {
    itemnum: 'ITEM001',
    description: '螺栓M10',
    descriptionEn: 'Bolt M10',
    batchnum: 'BATCH20260501',
    storeroom: 'WH-001',
    inventory: 950,
    availableqty: 850,
    reservedqty: 100,
    safetyqty: 500,
    totalpurchase: 5000,
    invstatus: '正常',
    status: '正常'
  },
  {
    itemnum: 'ITEM002',
    description: '螺母M10',
    descriptionEn: 'Nut M10',
    batchnum: 'BATCH20260502',
    storeroom: 'WH-002',
    inventory: 2000,
    availableqty: 1800,
    reservedqty: 200,
    safetyqty: 1000,
    totalpurchase: 8000,
    invstatus: '冻结',
    status: '低于安全库存'
  },
  {
    itemnum: 'ITEM003',
    description: '垫片M10',
    descriptionEn: 'Washer M10',
    batchnum: 'BATCH20260503',
    storeroom: 'WH-001',
    inventory: 5000,
    availableqty: 4500,
    reservedqty: 500,
    safetyqty: 2000,
    totalpurchase: 15000,
    invstatus: '正常',
    status: '正常'
  },
  {
    itemnum: 'ITEM004',
    description: '轴承6205',
    descriptionEn: 'Bearing 6205',
    batchnum: 'BATCH20260504',
    storeroom: 'WH-002',
    inventory: 500,
    availableqty: 425,
    reservedqty: 75,
    safetyqty: 166,
    totalpurchase: 8000,
    invstatus: '正常',
    status: '正常'
  },
  {
    itemnum: 'ITEM005',
    description: '密封圈O型',
    descriptionEn: 'O-ring Seal',
    batchnum: 'BATCH20260505',
    storeroom: 'WH-003',
    inventory: 600,
    availableqty: 510,
    reservedqty: 90,
    safetyqty: 200,
    totalpurchase: 10000,
    invstatus: '冻结',
    status: '低于安全库存'
  },
  {
    itemnum: 'ITEM006',
    description: '弹簧垫圈M8',
    descriptionEn: 'Spring Washer M8',
    batchnum: 'BATCH20260506',
    storeroom: 'WH-001',
    inventory: 700,
    availableqty: 595,
    reservedqty: 105,
    safetyqty: 233,
    totalpurchase: 12000,
    invstatus: '正常',
    status: '正常'
  },
  {
    itemnum: 'ITEM007',
    description: '内六角螺钉M6',
    descriptionEn: 'Hex Socket Screw M6',
    batchnum: 'BATCH20260507',
    storeroom: 'WH-002',
    inventory: 800,
    availableqty: 680,
    reservedqty: 120,
    safetyqty: 266,
    totalpurchase: 14000,
    invstatus: '正常',
    status: '正常'
  },
  {
    itemnum: 'ITEM008',
    description: '平键8x25',
    descriptionEn: 'Flat Key 8x25',
    batchnum: 'BATCH20260508',
    storeroom: 'WH-003',
    inventory: 900,
    availableqty: 765,
    reservedqty: 135,
    safetyqty: 300,
    totalpurchase: 16000,
    invstatus: '正常',
    status: '正常'
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
    console.log('新增库存')
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
  <div class="inventory-list">
    <h1 class="page-title">库存列表</h1>

    <!-- 库存列表 -->
    <MaximoSection>
      <MaximoTable
        title="库存信息"
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
.inventory-list {
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
