<script setup>
import { ref } from 'vue'
import MaximoTable from '../../components/MaximoTable.vue'
import MaximoSection from '../../components/MaximoSection.vue'

// 表格列定义
const columns = [
  { key: 'workOrderNum', label: '工单号', width: '150px', align: 'center', dataAlign: 'left' },
  { key: 'equipmentName', label: '设备名称', width: '200px', align: 'center', dataAlign: 'left' },
  { key: 'equipmentCode', label: '设备编号', width: '150px', align: 'center', dataAlign: 'left' },
  { key: 'faultType', label: '故障类型', width: '120px', align: 'center', dataAlign: 'left' },
  { key: 'priority', label: '优先级', width: '80px', align: 'center', dataAlign: 'center' },
  { key: 'reportDate', label: '报修日期', width: '120px', align: 'center', dataAlign: 'center' },
  { key: 'reporter', label: '报修人', width: '100px', align: 'center', dataAlign: 'left' },
  { key: 'status', label: '状态', width: '100px', align: 'center', dataAlign: 'center' }
]

// 模拟数据
const tableData = ref([
  {
    workOrderNum: 'WO2026050001',
    equipmentName: '数控机床A',
    equipmentCode: 'EQ-CNC-001',
    faultType: '机械故障',
    priority: '高',
    reportDate: '2026-05-10',
    reporter: '张三',
    status: '处理中'
  },
  {
    workOrderNum: 'WO2026050002',
    equipmentName: '注塑机B',
    equipmentCode: 'EQ-INJ-002',
    faultType: '电气故障',
    priority: '中',
    reportDate: '2026-05-11',
    reporter: '李四',
    status: '待处理'
  },
  {
    workOrderNum: 'WO2026050003',
    equipmentName: '包装机C',
    equipmentCode: 'EQ-PKG-003',
    faultType: '软件故障',
    priority: '低',
    reportDate: '2026-05-12',
    reporter: '王五',
    status: '已完成'
  },
  {
    workOrderNum: 'WO2026050004',
    equipmentName: '冲压机D',
    equipmentCode: 'EQ-PRS-004',
    faultType: '机械故障',
    priority: '高',
    reportDate: '2026-05-13',
    reporter: '赵六',
    status: '待处理'
  },
  {
    workOrderNum: 'WO2026050005',
    equipmentName: '焊接机器人E',
    equipmentCode: 'EQ-WLD-005',
    faultType: '电气故障',
    priority: '中',
    reportDate: '2026-05-14',
    reporter: '孙七',
    status: '处理中'
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
    console.log('新增工单')
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
  <div class="work-order-list">
    <h1 class="page-title">设备维护工单列表</h1>

    <!-- 工单列表 -->
    <MaximoSection title="工单信息">
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
.work-order-list {
  padding: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}
</style>
