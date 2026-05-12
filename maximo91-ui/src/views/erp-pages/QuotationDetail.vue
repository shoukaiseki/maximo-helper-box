<script setup>
import { ref } from 'vue'
import MaximoTable from '../components/MaximoTable.vue'
import MaximoTextbox from '../components/MaximoTextbox.vue'
import MaximoSection from '../components/MaximoSection.vue'
import MaximoSectionRow from '../components/MaximoSectionRow.vue'
import MaximoSectionCol from '../components/MaximoSectionCol.vue'
import MaximoButton from '../components/MaximoButton.vue'
import MaximoButtonGroup from '../components/MaximoButtonGroup.vue'

// 报价单基本信息
const quotationData = ref({
  quotationNo: 'RFQ0001',
  description: 'XXX零件总成询价',
  projectCode: '',
  projectName: '',
  status: 'INPRG',
  location: '五十铃'
})

// 零件明细列配置
const partColumns = [
  { key: 'partNo', label: '零件编号', width: '120px' },
  { key: 'partName', label: '零件名称', width: '150px' },
  { key: 'requireDate', label: '要求日期', width: '120px' },
  { key: 'suggestReplyDate', label: '建议回复日期', width: '120px' },
  { key: 'quantity', label: '交期数量', width: '100px' },
  { key: 'unit', label: '订购单位', width: '100px' }
]

// 零件明细表格自定义操作按钮
const partToolbarActions = [
  {
    title: '新增',
    icon: '/images/nav_icon_insert.gif'
  }
]

// 零件明细行内操作按钮
const partRowActions = [
  {
    title: '删除',
    icon: '/images/btn_garbage.gif'
  }
]

const handlePartAction = (action) => {
  console.log('零件明细操作:', action.title)
}

const handlePartRowAction = (action, rowIndex, row) => {
  console.log('零件明细行内操作:', action.title, '行索引:', rowIndex, '数据:', row)
}

// 零件明细数据
const partData = ref([
  {
    partNo: 'XXX001',
    partName: 'XXXX总成1',
    requireDate: '2027/1/1',
    suggestReplyDate: '2026/5/20',
    quantity: '1000',
    unit: '个'
  },
  {
    partNo: 'XXX002',
    partName: 'XXXX总成2',
    requireDate: '2027/1/1',
    suggestReplyDate: '2026/5/20',
    quantity: '1000',
    unit: '个'
  },
  {
    partNo: 'XXX003',
    partName: 'XXXX总成3',
    requireDate: '2027/1/1',
    suggestReplyDate: '2026/5/20',
    quantity: '1000',
    unit: '台'
  }
])

// 供应商列配置
const supplierColumns = [
  { key: 'supplierNo', label: '供应商编号', width: '150px' },
  { key: 'supplierName', label: '供应商名称', width: '200px' }
]

// 供应商表格自定义操作按钮
const supplierToolbarActions = [
  {
    title: '新增',
    icon: '/images/nav_icon_insert.gif'
  }
]

// 供应商行内操作按钮
const supplierRowActions = [
  {
    title: '删除',
    icon: '/images/btn_garbage.gif'
  }
]

const handleSupplierAction = (action) => {
  console.log('供应商操作:', action.title)
}

const handleSupplierRowAction = (action, rowIndex, row) => {
  console.log('供应商行内操作:', action.title, '行索引:', rowIndex, '数据:', row)
}

// 供应商数据
const supplierData = ref([
  {
    supplierNo: 'X0011',
    supplierName: 'XXXX1公司'
  },
  {
    supplierNo: 'X0012',
    supplierName: 'XXXX2公司'
  },
  {
    supplierNo: 'X0013',
    supplierName: 'XXXX3公司'
  }
])

// 条款列配置
const termColumns = [
  { key: 'sequence', label: '序号', width: '100px' },
  { key: 'termCode', label: '条款', width: '200px' },
  { key: 'description', label: '描述', width: '300px' }
]

// 条款数据
const termData = ref([
  {
    sequence: '1',
    termCode: 'TM1002',
    description: 'XXX'
  },
  {
    sequence: '2',
    termCode: 'TM1003',
    description: 'XXX'
  },
  {
    sequence: '3',
    termCode: 'TM1004',
    description: 'XXX'
  }
])

// 发送门户报价按钮
const primaryAction = {
  label: '发送门户报价'
}

const handlePrimaryAction = () => {
  console.log('发送门户报价')
}

const selectedRowIndex = ref(null)

// 按钮组操作处理
const handleSave = () => {
  console.log('保存')
}

const handleCancel = () => {
  console.log('取消')
}

const handleClose = () => {
  console.log('关闭')
}
</script>

<template>
  <div class="quotation-detail">
    <h1 class="page-title">RFQ报价单</h1>

    <!-- 报价单基本信息 -->
    <MaximoSection title="报价单基本信息">
      <table class="tdtblw">
        <MaximoSectionRow>
          <MaximoSectionCol>
            <MaximoTextbox
              v-model="quotationData.quotationNo"
              label="询价单"
              :readonly="true"
              width="200px"
            />
          </MaximoSectionCol>
          <MaximoSectionCol>
            <MaximoTextbox
              v-model="quotationData.projectCode"
              label="项目编码"
              :readonly="true"
              width="200px"
            />
          </MaximoSectionCol>
          <MaximoSectionCol>
            <MaximoTextbox
              v-model="quotationData.status"
              label="状态"
              :readonly="true"
              width="200px"
            />
          </MaximoSectionCol>
        </MaximoSectionRow>

        <MaximoSectionRow>
          <MaximoSectionCol>
            <MaximoTextbox
              v-model="quotationData.description"
              label="描述"
              :readonly="true"
              width="200px"
            />
          </MaximoSectionCol>
          <MaximoSectionCol>
            <MaximoTextbox
              v-model="quotationData.projectName"
              label="项目名称"
              :readonly="true"
              width="200px"
            />
          </MaximoSectionCol>
          <MaximoSectionCol>
            <MaximoTextbox
              v-model="quotationData.location"
              label="地点"
              :readonly="true"
              width="200px"
            />
          </MaximoSectionCol>
        </MaximoSectionRow>
      </table>
    </MaximoSection>

    <!-- 零件明细 -->
    <MaximoSection title="零件明细">
      <MaximoTable
        v-model="selectedRowIndex"
        :columns="partColumns"
        :data="partData"
        title="零件明细"
        :total-records="3"
        :current-page="1"
        :page-size="3"
        :toolbar-actions="partToolbarActions"
        :custom-actions-first="true"
        :show-action-column="true"
        :primary-action="primaryAction"
        :row-actions="partRowActions"
        @toolbar-action="handlePartAction"
        @row-action="handlePartRowAction"
      />
    </MaximoSection>

    <!-- 供应商列表 -->
    <MaximoSection title="供应商列表">
      <MaximoTable
        v-model="selectedRowIndex"
        :columns="supplierColumns"
        :data="supplierData"
        title="供应商列表"
        :total-records="3"
        :current-page="1"
        :page-size="3"
        :toolbar-actions="supplierToolbarActions"
        :custom-actions-first="true"
        :show-action-column="true"
        :row-actions="supplierRowActions"
        @toolbar-action="handleSupplierAction"
        @row-action="handleSupplierRowAction"
      />
    </MaximoSection>

    <!-- 条款 -->
    <MaximoSection title="条款">
      <MaximoTable
        v-model="selectedRowIndex"
        :columns="termColumns"
        :data="termData"
        title="条款"
        :total-records="3"
        :current-page="1"
        :page-size="3"
        @primary-action="handlePrimaryAction"
      />
      
      <!-- 按钮组 -->
      <!-- <MaximoButtonGroup align="right">
        <MaximoButton label="保存" :default="true" @click="handleSave" />
        <MaximoButton label="取消" @click="handleCancel" />
        <MaximoButton label="关闭" @click="handleClose" />
      </MaximoButtonGroup> -->
    </MaximoSection>
  </div>
</template>

<style scoped>
.quotation-detail {
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
