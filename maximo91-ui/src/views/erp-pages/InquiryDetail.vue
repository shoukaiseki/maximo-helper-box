<script setup>
import { ref } from 'vue'
import MaximoTable from '../components/MaximoTable.vue'
import MaximoTextbox from '../components/MaximoTextbox.vue'
import MaximoSection from '../components/MaximoSection.vue'
import MaximoSectionRow from '../components/MaximoSectionRow.vue'
import MaximoSectionCol from '../components/MaximoSectionCol.vue'
import MaximoButton from '../components/MaximoButton.vue'
import MaximoButtonGroup from '../components/MaximoButtonGroup.vue'

// 询价单基本信息
const inquiryData = ref({
  inquiryNo: 'RFQ0001',
  description: 'XXX零件总成询价',
  projectCode: '',
  projectName: '',
  status: 'INPRG',
  inquiryTemplate: 'XXX01'
})

// 零件明细列配置
const partColumns = [
  { key: 'partNo', label: '零件编号', width: '120px' },
  { key: 'partName', label: '零件名称', width: '150px' },
  { key: 'requireDate', label: '要求日期', width: '120px' },
  { key: 'suggestReply', label: '建议回复', width: '120px' },
  { key: 'quantity', label: '交期数量', width: '100px' },
  { key: 'unit', label: '订购单位', width: '100px' }
]

// 零件明细表格自定义操作按钮（在默认按钮之前）
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
    suggestReply: '########',
    quantity: '1000',
    unit: '个'
  },
  {
    partNo: 'XXX002',
    partName: 'XXXX总成2',
    requireDate: '2027/1/1',
    suggestReply: '########',
    quantity: '1000',
    unit: '个'
  },
  {
    partNo: 'XXX003',
    partName: 'XXXX总成3',
    requireDate: '2027/1/1',
    suggestReply: '########',
    quantity: '1000',
    unit: '台'
  }
])

// 供应商列配置
const supplierColumns = [
  { key: 'supplierNo', label: '供应商编号', width: '150px' },
  { key: 'supplierName', label: '供应商名称', width: '200px' }
]

// 供应商表格自定义操作按钮（在默认按钮之前）
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

// 调查表列配置
const surveyColumns = [
  { key: 'surveyNo', label: '调查表编号', width: '120px' },
  { key: 'surveyTime', label: '调查时间', width: '120px' },
  { key: 'companyName', label: '公司名称', width: '150px' },
  { key: 'status', label: '状态', width: '100px' },
  { key: 'mainProduct', label: '主要产品', width: '120px' },
  { key: 'productionLine', label: '生产线', width: '100px' },
  { key: 'qualityControl', label: '品控', width: '100px' }
]

// 调查表表格主要操作按钮
const surveyPrimaryAction = {
  label: '发送调查表'
}

const handleSurveyPrimaryAction = () => {
  console.log('发送调查表')
}

// 调查表行内操作按钮
const surveyRowActions = [
  {
    title: '删除',
    icon: '/images/btn_garbage.gif'
  }
]

const handleSurveyRowAction = (action, rowIndex, row) => {
  console.log('调查表行内操作:', action.title, '行索引:', rowIndex, '数据:', row)
}

// 调查表数据
const surveyData = ref([
  {
    surveyNo: 'XXX01',
    surveyTime: '2024/6/1',
    companyName: 'XXX公司',
    status: '草稿',
    mainProduct: 'XX',
    productionLine: 'XXX',
    qualityControl: 'XXX'
  }
])

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
  <div class="inquiry-detail">
    <h1 class="page-title">询价单详情</h1>

    <!-- 询价单基本信息 -->
    <MaximoSection title="询价单基本信息">
      <table class="tdtblw">
        <MaximoSectionRow>
          <MaximoSectionCol>
            <MaximoTextbox
              v-model="inquiryData.inquiryNo"
              label="询价单"
              :readonly="true"
              width="200px"
            />
          </MaximoSectionCol>
          <MaximoSectionCol>
            <MaximoTextbox
              v-model="inquiryData.projectCode"
              label="项目编码"
              :readonly="true"
              width="200px"
            />
          </MaximoSectionCol>
          <MaximoSectionCol>
            <MaximoTextbox
              v-model="inquiryData.status"
              label="状态"
              :readonly="true"
              width="200px"
            />
          </MaximoSectionCol>
        </MaximoSectionRow>

        <MaximoSectionRow>
          <MaximoSectionCol>
            <MaximoTextbox
              v-model="inquiryData.description"
              label="描述"
              :readonly="true"
              width="200px"
            />
          </MaximoSectionCol>
          <MaximoSectionCol>
            <MaximoTextbox
              v-model="inquiryData.projectName"
              label="项目名称"
              :readonly="true"
              width="200px"
            />
          </MaximoSectionCol>
          <MaximoSectionCol>
            <MaximoTextbox
              v-model="inquiryData.inquiryTemplate"
              label="询价单模板"
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

    <!-- 调查表 -->
    <MaximoSection title="调查表">
      <MaximoTable
        v-model="selectedRowIndex"
        :columns="surveyColumns"
        :data="surveyData"
        title="调查表"
        :total-records="1"
        :current-page="1"
        :page-size="1"
        :primary-action="surveyPrimaryAction"
        :show-action-column="true"
        :row-actions="surveyRowActions"
        @primary-action="handleSurveyPrimaryAction"
        @row-action="handleSurveyRowAction"
      />
      
      <!-- 按钮组示例 -->
      <!-- <MaximoButtonGroup align="right">
        <MaximoButton label="保存" :default="true" @click="handleSave" />
        <MaximoButton label="取消" @click="handleCancel" />
        <MaximoButton label="关闭" @click="handleClose" />
      </MaximoButtonGroup> -->
    </MaximoSection>
  </div>
</template>

<style scoped>
.inquiry-detail {
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
