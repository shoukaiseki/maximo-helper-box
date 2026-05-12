<script setup>
import { ref } from 'vue'
import MaximoTable from '../components/MaximoTable.vue'
import MaximoSection from '../components/MaximoSection.vue'

// 表格列定义
const columns = [
  { key: 'storeroomnum', label: '库房编号', width: '150px', align: 'center', dataAlign: 'left' },
  { key: 'isdirectship', label: '是否直发库', width: '120px', align: 'center', dataAlign: 'center' },
  { key: 'description', label: '库房名称', width: '200px', align: 'center', dataAlign: 'left' },
  { key: 'address', label: '仓库地址', width: '300px', align: 'center', dataAlign: 'left' }
]

// 模拟数据
const tableData = ref([
  {
    storeroomnum: 'WH001',
    isdirectship: '是',
    description: '主仓库',
    address: '北京市朝阳区建国路100号'
  },
  {
    storeroomnum: 'WH002',
    isdirectship: '否',
    description: '备件仓库',
    address: '上海市浦东新区张江路200号'
  },
  {
    storeroomnum: 'WH003',
    isdirectship: '否',
    description: '直发库',
    address: '广州市天河区天河路300号'
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
    console.log('新增库房')
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
  <div class="storeroom-list">
    <h1 class="page-title">库房列表</h1>

    <!-- 库房列表 -->
    <MaximoSection title="库房信息">
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
.storeroom-list {
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
