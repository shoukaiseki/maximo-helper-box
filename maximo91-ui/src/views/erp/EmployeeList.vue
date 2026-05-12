<script setup>
import { ref } from 'vue'
import MaximoTable from '../../components/MaximoTable.vue'
import MaximoSection from '../../components/MaximoSection.vue'

// 表格列定义
const columns = [
  { key: 'employeeId', label: '员工编号', width: '120px', align: 'center', dataAlign: 'left' },
  { key: 'name', label: '姓名', width: '100px', align: 'center', dataAlign: 'left' },
  { key: 'department', label: '部门', width: '150px', align: 'center', dataAlign: 'left' },
  { key: 'position', label: '职位', width: '150px', align: 'center', dataAlign: 'left' },
  { key: 'phone', label: '电话', width: '130px', align: 'center', dataAlign: 'left' },
  { key: 'email', label: '邮箱', width: '200px', align: 'center', dataAlign: 'left' },
  { key: 'hireDate', label: '入职日期', width: '120px', align: 'center', dataAlign: 'center' },
  { key: 'status', label: '状态', width: '80px', align: 'center', dataAlign: 'center' }
]

// 模拟数据
const tableData = ref([
  {
    employeeId: 'EMP001',
    name: '张三',
    department: '采购部',
    position: '采购经理',
    phone: '13800138001',
    email: 'zhangsan@company.com',
    hireDate: '2020-03-15',
    status: '在职'
  },
  {
    employeeId: 'EMP002',
    name: '李四',
    department: '仓储部',
    position: '仓库主管',
    phone: '13800138002',
    email: 'lisi@company.com',
    hireDate: '2019-07-20',
    status: '在职'
  },
  {
    employeeId: 'EMP003',
    name: '王五',
    department: '财务部',
    position: '财务专员',
    phone: '13800138003',
    email: 'wangwu@company.com',
    hireDate: '2021-01-10',
    status: '在职'
  },
  {
    employeeId: 'EMP004',
    name: '赵六',
    department: '技术部',
    position: '工程师',
    phone: '13800138004',
    email: 'zhaoliu@company.com',
    hireDate: '2022-05-08',
    status: '在职'
  },
  {
    employeeId: 'EMP005',
    name: '孙七',
    department: '人力资源部',
    position: 'HR专员',
    phone: '13800138005',
    email: 'sunqi@company.com',
    hireDate: '2021-11-25',
    status: '在职'
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
    console.log('新增员工')
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
  <div class="employee-list">
    <h1 class="page-title">员工管理列表</h1>

    <!-- 员工列表 -->
    <MaximoSection title="员工信息">
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
.employee-list {
  padding: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}
</style>
