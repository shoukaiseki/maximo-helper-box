<script setup>
import { ref } from 'vue'
import MaximoTextbox from '../../components/MaximoTextbox.vue'
import MaximoTable from '../../components/MaximoTable.vue'
import MaximoTableDetail from '../../components/MaximoTableDetail.vue'
import MaximoSection from '../../components/MaximoSection.vue'
import MaximoSectionRow from '../../components/MaximoSectionRow.vue'
import MaximoSectionCol from '../../components/MaximoSectionCol.vue'
import MaximoTabs from '../../components/MaximoTabs.vue'
import MaximoTab from '../../components/MaximoTab.vue'
import MaximoButton from '../../components/MaximoButton.vue'
import MaximoButtonGroup from '../../components/MaximoButtonGroup.vue'
import MaximoLabel from '../../components/MaximoLabel.vue'
import MaximoCheckbox from '../../components/MaximoCheckbox.vue'

// 主表数据
const formData = ref({
  poNumber: 'PO2026050001',
  supplier: '北京科技有限公司',
  orderDate: '2026-05-01',
  deliveryDate: '2026-05-15',
  totalAmount: 50000.00,
  status: '已审批',
  creator: '张三',
  department: '采购部',
  contactPerson: '张经理',
  contactPhone: '010-12345678',
  remark: '紧急采购，需按时交货'
})

// 子表1：订单明细
const detailColumns = [
  { key: 'lineNum', label: '行号', width: '80px', align: 'center', dataAlign: 'center' },
  { key: 'itemCode', label: '物料编码', width: '150px', align: 'center', dataAlign: 'left' },
  { key: 'itemName', label: '物料名称', width: '200px', align: 'center', dataAlign: 'left' },
  { key: 'specification', label: '规格型号', width: '180px', align: 'center', dataAlign: 'left' },
  { key: 'quantity', label: '数量', width: '100px', align: 'center', dataAlign: 'right' },
  { key: 'unit', label: '单位', width: '80px', align: 'center', dataAlign: 'center' },
  { key: 'unitPrice', label: '单价(CNY)', width: '120px', align: 'center', dataAlign: 'right' },
  { key: 'amount', label: '金额(CNY)', width: '120px', align: 'center', dataAlign: 'right' }
]

const detailData = ref([
  { lineNum: 1, itemCode: 'MAT001', itemName: '钢材A', specification: 'Q235 10mm', quantity: 100, unit: '吨', unitPrice: 300.00, amount: 30000.00 },
  { lineNum: 2, itemCode: 'MAT002', itemName: '铝材B', specification: '6061 5mm', quantity: 50, unit: '吨', unitPrice: 250.00, amount: 12500.00 },
  { lineNum: 3, itemCode: 'MAT003', itemName: '铜材C', specification: 'T2 3mm', quantity: 20, unit: '吨', unitPrice: 375.00, amount: 7500.00 }
])

// 子表2：付款记录
const paymentColumns = [
  { key: 'paymentDate', label: '付款日期', width: '120px', align: 'center', dataAlign: 'center' },
  { key: 'paymentType', label: '付款方式', width: '120px', align: 'center', dataAlign: 'left' },
  { key: 'amount', label: '付款金额(CNY)', width: '130px', align: 'center', dataAlign: 'right' },
  { key: 'rate', label: '比例', width: '80px', align: 'center', dataAlign: 'center' },
  { key: 'status', label: '状态', width: '100px', align: 'center', dataAlign: 'center' },
  { key: 'remark', label: '备注', width: '200px', align: 'center', dataAlign: 'left' }
]

const paymentData = ref([
  { paymentDate: '2026-05-02', paymentType: '预付款', amount: 15000.00, rate: '30%', status: '已完成', remark: '合同签订后支付' },
  { paymentDate: '2026-05-10', paymentType: '进度款', amount: 20000.00, rate: '40%', status: '已完成', remark: '发货前支付' },
  { paymentDate: '', paymentType: '尾款', amount: 15000.00, rate: '30%', status: '待支付', remark: '验收合格后支付' }
])

// 子表3：交货记录
const deliveryColumns = [
  { key: 'deliveryDate', label: '交货日期', width: '120px', align: 'center', dataAlign: 'center' },
  { key: 'batchNum', label: '批次号', width: '150px', align: 'center', dataAlign: 'left' },
  { key: 'quantity', label: '交货数量', width: '100px', align: 'center', dataAlign: 'right' },
  { key: 'receiver', label: '收货人', width: '100px', align: 'center', dataAlign: 'left' },
  { key: 'status', label: '状态', width: '100px', align: 'center', dataAlign: 'center' },
  { key: 'location', label: '交货地点', width: '200px', align: 'center', dataAlign: 'left' }
]

const deliveryData = ref([
  { deliveryDate: '2026-05-12', batchNum: 'DLV20260512001', quantity: 80, receiver: '李四', status: '已收货', location: '北京市朝阳区仓库' },
  { deliveryDate: '2026-05-14', batchNum: 'DLV20260514001', quantity: 90, receiver: '李四', status: '已收货', location: '北京市朝阳区仓库' }
])

// 当前激活的标签页
const activeTab = ref('detail')

// 工具栏按钮配置
const toolbarActions = [
  { title: '保存', icon: '/images/nav_icon_save.gif' },
  { title: '取消', icon: '/images/btn_cancelchanges.gif' }
]

const handleToolbarAction = ({ action }) => {
  console.log('操作:', action.title)
}

// 按钮组操作
const handleButtonGroupAction = (action) => {
  console.log('按钮组操作:', action.label)
}

// 按钮组配置
const buttonGroupActions = [
  { label: '打印订单', type: 'secondary', icon: '🖨️' },
  { label: '导出PDF', type: 'secondary', icon: '📄' },
  { label: '发送邮件', type: 'secondary', icon: '📧' }
]
</script>

<template>
  <div class="purchase-order-detail">
    <h1 class="page-title">采购订单详情</h1>

    <!-- 顶部按钮组 -->
    <div style="margin-bottom: 20px;">
      <MaximoButtonGroup :actions="buttonGroupActions" @action="handleButtonGroupAction" />
    </div>

    <!-- 基本信息 -->
    <MaximoSection title="基本信息">
      <MaximoSectionRow>
        <MaximoSectionCol :span="8">
          <MaximoTextbox v-model="formData.poNumber" label="采购订单号" readonly />
        </MaximoSectionCol>
        <MaximoSectionCol :span="8">
          <MaximoTextbox v-model="formData.supplier" label="供应商" readonly />
        </MaximoSectionCol>
        <MaximoSectionCol :span="8">
          <MaximoTextbox v-model="formData.status" label="状态" readonly />
        </MaximoSectionCol>
      </MaximoSectionRow>
      <MaximoSectionRow>
        <MaximoSectionCol :span="8">
          <MaximoTextbox v-model="formData.orderDate" label="订单日期" readonly />
        </MaximoSectionCol>
        <MaximoSectionCol :span="8">
          <MaximoTextbox v-model="formData.deliveryDate" label="交货日期" readonly />
        </MaximoSectionCol>
        <MaximoSectionCol :span="8">
          <MaximoTextbox v-model="formData.totalAmount" label="总金额" readonly />
        </MaximoSectionCol>
      </MaximoSectionRow>
      <MaximoSectionRow>
        <MaximoSectionCol :span="8">
          <MaximoTextbox v-model="formData.creator" label="创建人" readonly />
        </MaximoSectionCol>
        <MaximoSectionCol :span="8">
          <MaximoTextbox v-model="formData.department" label="部门" readonly />
        </MaximoSectionCol>
        <MaximoSectionCol :span="8">
          <MaximoTextbox v-model="formData.contactPerson" label="联系人" readonly />
        </MaximoSectionCol>
      </MaximoSectionRow>
      <MaximoSectionRow>
        <MaximoSectionCol :span="8">
          <MaximoTextbox v-model="formData.contactPhone" label="联系电话" readonly />
        </MaximoSectionCol>
        <MaximoSectionCol :span="16">
          <MaximoTextbox v-model="formData.remark" label="备注" readonly />
        </MaximoSectionCol>
      </MaximoSectionRow>
    </MaximoSection>

    <!-- 多标签页 -->
    <MaximoTabs v-model="activeTab">
      <MaximoTab name="detail" label="订单明细" />
      <MaximoTab name="payment" label="付款记录" />
      <MaximoTab name="delivery" label="交货记录" />
      
      <template #content>
        <div v-if="activeTab === 'detail'">
          <MaximoSection title="订单明细">
            <MaximoTable
              :columns="detailColumns"
              :data="detailData"
              :show-toolbar="true"
              :show-footer="true"
              :toolbar-actions-before="toolbarActions"
              @toolbar-action="handleToolbarAction"
            />
          </MaximoSection>
        </div>
        <div v-if="activeTab === 'payment'">
          <MaximoSection title="付款记录">
            <MaximoTable
              :columns="paymentColumns"
              :data="paymentData"
              :show-toolbar="true"
              :show-footer="true"
              :toolbar-actions-before="toolbarActions"
              @toolbar-action="handleToolbarAction"
            />
          </MaximoSection>
        </div>
        <div v-if="activeTab === 'delivery'">
          <MaximoSection title="交货记录">
            <MaximoTable
              :columns="deliveryColumns"
              :data="deliveryData"
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
.purchase-order-detail {
  padding: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}
</style>
