<script setup>
import { ref } from 'vue'
import MaximoTable from '../../components/MaximoTable.vue'
import MaximoSection from '../../components/MaximoSection.vue'

// 表格列定义
const columns = [
  { key: 'supplierCode', label: '供应商编码', width: '150px', align: 'center', dataAlign: 'left' },
  { key: 'supplierName', label: '供应商名称', width: '250px', align: 'center', dataAlign: 'left' },
  { key: 'contactPerson', label: '联系人', width: '100px', align: 'center', dataAlign: 'left' },
  { key: 'phone', label: '联系电话', width: '130px', align: 'center', dataAlign: 'left' },
  { key: 'email', label: '邮箱', width: '200px', align: 'center', dataAlign: 'left' },
  { key: 'rating', label: '评级', width: '80px', align: 'center', dataAlign: 'center' },
  { key: 'status', label: '状态', width: '80px', align: 'center', dataAlign: 'center' }
]

// 模拟数据
const tableData = ref([
  {
    supplierCode: 'SUP001',
    supplierName: '北京科技有限公司',
    contactPerson: '张经理',
    phone: '010-12345678',
    email: 'zhang@bjtech.com',
    rating: 'A',
    status: '合格'
  },
  {
    supplierCode: 'SUP002',
    supplierName: '上海贸易公司',
    contactPerson: '李总',
    phone: '021-87654321',
    email: 'li@shtrade.com',
    rating: 'B',
    status: '合格'
  },
  {
    supplierCode: 'SUP003',
    supplierName: '广州制造厂',
    contactPerson: '王厂长',
    phone: '020-11112222',
    email: 'wang@gzfactory.com',
    rating: 'A',
    status: '合格'
  },
  {
    supplierCode: 'SUP004',
    supplierName: '深圳电子公司',
    contactPerson: '赵总监',
    phone: '0755-33334444',
    email: 'zhao@szelec.com',
    rating: 'C',
    status: '待审核'
  },
  {
    supplierCode: 'SUP005',
    supplierName: '杭州机械厂',
    contactPerson: '孙经理',
    phone: '0571-55556666',
    email: 'sun@hzmech.com',
    rating: 'B',
    status: '合格'
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
    console.log('新增供应商')
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
  <div class="supplier-list">
    <h1 class="page-title">供应商管理列表</h1>

    <!-- 供应商列表 -->
    <MaximoSection title="供应商信息">
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
.supplier-list {
  padding: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}
</style>
