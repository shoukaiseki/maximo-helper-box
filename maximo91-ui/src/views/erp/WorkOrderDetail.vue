<script setup>
import { ref } from 'vue'
import MaximoTextbox from '../../components/MaximoTextbox.vue'
import MaximoMultilineTextbox from '../../components/MaximoMultilineTextbox.vue'
import MaximoTable from '../../components/MaximoTable.vue'
import MaximoSection from '../../components/MaximoSection.vue'
import MaximoSectionRow from '../../components/MaximoSectionRow.vue'
import MaximoSectionCol from '../../components/MaximoSectionCol.vue'
import MaximoTabs from '../../components/MaximoTabs.vue'
import MaximoTab from '../../components/MaximoTab.vue'
import MaximoButton from '../../components/MaximoButton.vue'
import MaximoLabel from '../../components/MaximoLabel.vue'
import MaximoCheckbox from '../../components/MaximoCheckbox.vue'
import MaximoAttachments from '../../components/MaximoAttachments.vue'

// 主表数据
const formData = ref({
  workOrderNum: 'WO2026050001',
  equipmentName: '数控机床A',
  equipmentCode: 'EQ-CNC-001',
  faultType: '机械故障',
  priority: '高',
  reportDate: '2026-05-10',
  reporter: '张三',
  status: '处理中',
  department: '生产部',
  location: '车间A-01',
  description: '设备运行时出现异常噪音，主轴振动过大',
  handler: '李工程师',
  startDate: '2026-05-11',
  endDate: '',
  cost: 0
})

// 子表1：维修记录
const repairColumns = [
  { key: 'repairDate', label: '维修日期', width: '120px', align: 'center', dataAlign: 'center' },
  { key: 'handler', label: '维修人员', width: '100px', align: 'center', dataAlign: 'left' },
  { key: 'action', label: '维修内容', width: '300px', align: 'center', dataAlign: 'left' },
  { key: 'duration', label: '耗时(小时)', width: '100px', align: 'center', dataAlign: 'right' },
  { key: 'result', label: '结果', width: '150px', align: 'center', dataAlign: 'left' }
]

const repairData = ref([
  { repairDate: '2026-05-11', handler: '李工程师', action: '检查主轴轴承，发现磨损严重，需要更换', duration: 2, result: '待更换配件' },
  { repairDate: '2026-05-12', handler: '李工程师', action: '更换主轴轴承，调试设备', duration: 4, result: '维修完成' }
])

// 子表2：备件使用
const partsColumns = [
  { key: 'partCode', label: '备件编码', width: '150px', align: 'center', dataAlign: 'left' },
  { key: 'partName', label: '备件名称', width: '200px', align: 'center', dataAlign: 'left' },
  { key: 'specification', label: '规格型号', width: '180px', align: 'center', dataAlign: 'left' },
  { key: 'quantity', label: '使用数量', width: '100px', align: 'center', dataAlign: 'right' },
  { key: 'unit', label: '单位', width: '80px', align: 'center', dataAlign: 'center' },
  { key: 'unitPrice', label: '单价(CNY)', width: '120px', align: 'center', dataAlign: 'right' },
  { key: 'amount', label: '金额(CNY)', width: '120px', align: 'center', dataAlign: 'right' }
]

const partsData = ref([
  { partCode: 'PART001', partName: '主轴轴承', specification: 'SKF 6205', quantity: 2, unit: '个', unitPrice: 150.00, amount: 300.00 },
  { partCode: 'PART002', partName: '密封圈', specification: 'O型 Φ50', quantity: 4, unit: '个', unitPrice: 25.00, amount: 100.00 }
])

// 子表3：费用明细
const costColumns = [
  { key: 'costType', label: '费用类型', width: '120px', align: 'center', dataAlign: 'left' },
  { key: 'description', label: '说明', width: '300px', align: 'center', dataAlign: 'left' },
  { key: 'amount', label: '金额(CNY)', width: '120px', align: 'center', dataAlign: 'right' },
  { key: 'date', label: '发生日期', width: '120px', align: 'center', dataAlign: 'center' }
]

const costData = ref([
  { costType: '备件费', description: '主轴轴承、密封圈等', amount: 400.00, date: '2026-05-12' },
  { costType: '人工费', description: '维修工时6小时', amount: 600.00, date: '2026-05-12' },
  { costType: '其他', description: '运输费', amount: 100.00, date: '2026-05-12' }
])

// 附件列表
const attachments = ref([
  { name: '故障照片1.jpg', size: '2.5MB', uploadDate: '2026-05-10' },
  { name: '故障照片2.jpg', size: '3.1MB', uploadDate: '2026-05-10' },
  { name: '维修报告.pdf', size: '1.2MB', uploadDate: '2026-05-12' }
])

// 当前激活的标签页
const activeTab = ref('basic')

// 工具栏按钮配置
const toolbarActions = [
  { title: '保存', icon: '/images/nav_icon_save.gif' },
  { title: '提交', icon: '/images/btn_submit_editreq.gif' },
  { title: '取消', icon: '/images/btn_cancelchanges.gif' }
]

const handleToolbarAction = ({ action }) => {
  console.log('操作:', action.title)
}
</script>

<template>
  <div class="work-order-detail">
    <h1 class="page-title">设备维护工单详情</h1>

    <!-- 多标签页 -->
    <MaximoTabs v-model="activeTab">
      <MaximoTab name="basic" label="基本信息" />
      <MaximoTab name="repair" label="维修记录" />
      <MaximoTab name="parts" label="备件使用" />
      <MaximoTab name="cost" label="费用明细" />
      
      <template #content>
        <!-- 基本信息标签 -->
        <div v-if="activeTab === 'basic'">
          <MaximoSection title="工单信息">
          <MaximoSectionRow>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.workOrderNum" label="工单号" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.equipmentName" label="设备名称" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.equipmentCode" label="设备编号" readonly />
            </MaximoSectionCol>
          </MaximoSectionRow>
          <MaximoSectionRow>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.faultType" label="故障类型" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.priority" label="优先级" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.status" label="状态" readonly />
            </MaximoSectionCol>
          </MaximoSectionRow>
          <MaximoSectionRow>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.reportDate" label="报修日期" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.reporter" label="报修人" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.department" label="部门" readonly />
            </MaximoSectionCol>
          </MaximoSectionRow>
          <MaximoSectionRow>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.location" label="位置" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.handler" label="维修人员" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.startDate" label="开始日期" readonly />
            </MaximoSectionCol>
          </MaximoSectionRow>
          <MaximoSectionRow>
            <MaximoSectionCol :span="24">
              <MaximoMultilineTextbox v-model="formData.description" label="故障描述" :rows="4" readonly />
            </MaximoSectionCol>
          </MaximoSectionRow>
        </MaximoSection>

        <!-- 附件 -->
        <MaximoSection title="附件">
          <MaximoAttachments :attachments="attachments" />
        </MaximoSection>
        </div>

        <!-- 维修记录标签 -->
        <div v-if="activeTab === 'repair'">
          <MaximoSection title="维修记录">
          <MaximoTable
            :columns="repairColumns"
            :data="repairData"
            :show-toolbar="true"
            :show-footer="true"
            :toolbar-actions-before="toolbarActions"
            @toolbar-action="handleToolbarAction"
          />
        </MaximoSection>
        </div>

        <!-- 备件使用标签 -->
        <div v-if="activeTab === 'parts'">
          <MaximoSection title="备件使用明细">
          <MaximoTable
            :columns="partsColumns"
            :data="partsData"
            :show-toolbar="true"
            :show-footer="true"
            :toolbar-actions-before="toolbarActions"
            @toolbar-action="handleToolbarAction"
          />
        </MaximoSection>
        </div>

        <!-- 费用明细标签 -->
        <div v-if="activeTab === 'cost'">
          <MaximoSection title="费用明细">
          <MaximoTable
            :columns="costColumns"
            :data="costData"
            :show-toolbar="true"
            :show-footer="true"
            :toolbar-actions-before="toolbarActions"
            @toolbar-action="handleToolbarAction"
          />
        </MaximoSection>
        </div>
      </template>
    </MaximoTabs>
  </div>
</template>

<style scoped>
.work-order-detail {
  padding: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}
</style>
