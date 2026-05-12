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
  assetCode: 'AST001',
  assetName: '数控机床A',
  category: '生产设备',
  specification: 'CNC-5000',
  manufacturer: '沈阳机床集团',
  purchaseDate: '2023-06-15',
  originalValue: 500000.00,
  netValue: 425000.00,
  department: '生产部',
  location: '车间A-01',
  status: '在用',
  isInsured: true,
  needMaintenance: true,
  warrantyPeriod: '2年',
  warrantyExpiry: '2025-06-15',
  description: '高精度数控加工中心，用于精密零件加工'
})

// 子表1：折旧记录
const depreciationColumns = [
  { key: 'year', label: '年度', width: '100px', align: 'center', dataAlign: 'center' },
  { key: 'month', label: '月份', width: '80px', align: 'center', dataAlign: 'center' },
  { key: 'depreciationAmount', label: '折旧金额(CNY)', width: '130px', align: 'center', dataAlign: 'right' },
  { key: 'accumulatedDepreciation', label: '累计折旧(CNY)', width: '140px', align: 'center', dataAlign: 'right' },
  { key: 'netValue', label: '净值(CNY)', width: '130px', align: 'center', dataAlign: 'right' }
]

const depreciationData = ref([
  { year: 2023, month: 7, depreciationAmount: 6250.00, accumulatedDepreciation: 6250.00, netValue: 493750.00 },
  { year: 2023, month: 8, depreciationAmount: 6250.00, accumulatedDepreciation: 12500.00, netValue: 487500.00 },
  { year: 2023, month: 9, depreciationAmount: 6250.00, accumulatedDepreciation: 18750.00, netValue: 481250.00 },
  { year: 2023, month: 10, depreciationAmount: 6250.00, accumulatedDepreciation: 25000.00, netValue: 475000.00 },
  { year: 2023, month: 11, depreciationAmount: 6250.00, accumulatedDepreciation: 31250.00, netValue: 468750.00 },
  { year: 2023, month: 12, depreciationAmount: 6250.00, accumulatedDepreciation: 37500.00, netValue: 462500.00 }
])

// 子表2：维修历史
const maintenanceColumns = [
  { key: 'maintenanceDate', label: '维修日期', width: '120px', align: 'center', dataAlign: 'center' },
  { key: 'maintenanceType', label: '维修类型', width: '120px', align: 'center', dataAlign: 'left' },
  { key: 'description', label: '维修内容', width: '300px', align: 'center', dataAlign: 'left' },
  { key: 'cost', label: '费用(CNY)', width: '120px', align: 'center', dataAlign: 'right' },
  { key: 'handler', label: '维修人员', width: '100px', align: 'center', dataAlign: 'left' }
]

const maintenanceData = ref([
  { maintenanceDate: '2024-03-15', maintenanceType: '定期保养', description: '更换润滑油、检查电气系统', cost: 2000.00, handler: '王工程师' },
  { maintenanceDate: '2024-09-20', maintenanceType: '故障维修', description: '主轴轴承更换', cost: 5000.00, handler: '李工程师' },
  { maintenanceDate: '2025-03-10', maintenanceType: '定期保养', description: '全面检查、校准精度', cost: 3000.00, handler: '王工程师' }
])

// 子表3：使用记录
const usageColumns = [
  { key: 'date', label: '日期', width: '120px', align: 'center', dataAlign: 'center' },
  { key: 'operator', label: '操作员', width: '100px', align: 'center', dataAlign: 'left' },
  { key: 'startTime', label: '开始时间', width: '100px', align: 'center', dataAlign: 'center' },
  { key: 'endTime', label: '结束时间', width: '100px', align: 'center', dataAlign: 'center' },
  { key: 'duration', label: '使用时长(小时)', width: '120px', align: 'center', dataAlign: 'right' },
  { key: 'product', label: '生产产品', width: '200px', align: 'center', dataAlign: 'left' }
]

const usageData = ref([
  { date: '2026-05-10', operator: '张三', startTime: '08:00', endTime: '12:00', duration: 4, product: '零件A-001' },
  { date: '2026-05-10', operator: '李四', startTime: '13:00', endTime: '17:00', duration: 4, product: '零件B-002' },
  { date: '2026-05-11', operator: '张三', startTime: '08:00', endTime: '16:00', duration: 8, product: '零件C-003' }
])

// 附件列表
const attachments = ref([
  { name: '设备照片.jpg', size: '3.2MB', uploadDate: '2023-06-15' },
  { name: '合格证.pdf', size: '0.5MB', uploadDate: '2023-06-15' },
  { name: '使用说明书.pdf', size: '5.8MB', uploadDate: '2023-06-15' }
])

// 当前激活的标签页
const activeTab = ref('basic')

// 工具栏按钮配置
const toolbarActions = [
  { title: '保存', icon: '/images/nav_icon_save.gif' },
  { title: '取消', icon: '/images/nav_icon_undo.gif' }
]

const handleToolbarAction = ({ action }) => {
  console.log('操作:', action.title)
}
</script>

<template>
  <div class="asset-detail">
    <h1 class="page-title">资产详情</h1>

    <!-- 多标签页 -->
    <MaximoTabs v-model="activeTab">
      <MaximoTab name="basic" label="基本信息" />
      <MaximoTab name="depreciation" label="折旧记录" />
      <MaximoTab name="maintenance" label="维修历史" />
      <MaximoTab name="usage" label="使用记录" />
      
      <template #content>
        <!-- 基本信息标签 -->
        <div v-if="activeTab === 'basic'">
          <MaximoSection title="资产信息">
          <MaximoSectionRow>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.assetCode" label="资产编号" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.assetName" label="资产名称" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.category" label="资产类别" readonly />
            </MaximoSectionCol>
          </MaximoSectionRow>
          <MaximoSectionRow>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.specification" label="规格型号" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.manufacturer" label="制造商" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.purchaseDate" label="购置日期" readonly />
            </MaximoSectionCol>
          </MaximoSectionRow>
          <MaximoSectionRow>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.originalValue" label="原值(CNY)" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.netValue" label="净值(CNY)" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.department" label="使用部门" readonly />
            </MaximoSectionCol>
          </MaximoSectionRow>
          <MaximoSectionRow>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.location" label="位置" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.status" label="状态" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.warrantyPeriod" label="保修期" readonly />
            </MaximoSectionCol>
          </MaximoSectionRow>
          <MaximoSectionRow>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.warrantyExpiry" label="保修到期日" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoCheckbox v-model="formData.isInsured" label="已投保" disabled />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoCheckbox v-model="formData.needMaintenance" label="需定期维护" disabled />
            </MaximoSectionCol>
          </MaximoSectionRow>
          <MaximoSectionRow>
            <MaximoSectionCol :span="24">
              <MaximoMultilineTextbox v-model="formData.description" label="资产描述" :rows="3" readonly />
            </MaximoSectionCol>
          </MaximoSectionRow>
        </MaximoSection>

        <!-- 附件 -->
        <MaximoSection title="附件">
          <MaximoAttachments :attachments="attachments" />
        </MaximoSection>
        </div>

        <!-- 折旧记录标签 -->
        <div v-if="activeTab === 'depreciation'">
          <MaximoSection title="折旧记录">
          <MaximoTable
            :columns="depreciationColumns"
            :data="depreciationData"
            :show-toolbar="false"
            :show-footer="true"
          />
        </MaximoSection>
        </div>

        <!-- 维修历史标签 -->
        <div v-if="activeTab === 'maintenance'">
          <MaximoSection title="维修历史">
          <MaximoTable
            :columns="maintenanceColumns"
            :data="maintenanceData"
            :show-toolbar="true"
            :show-footer="true"
            :toolbar-actions-before="toolbarActions"
            @toolbar-action="handleToolbarAction"
          />
        </MaximoSection>
        </div>

        <!-- 使用记录标签 -->
        <div v-if="activeTab === 'usage'">
          <MaximoSection title="使用记录">
          <MaximoTable
            :columns="usageColumns"
            :data="usageData"
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
.asset-detail {
  padding: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}
</style>
