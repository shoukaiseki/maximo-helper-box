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
  supplierCode: 'SUP001',
  supplierName: '北京科技有限公司',
  contactPerson: '张经理',
  phone: '010-12345678',
  email: 'zhang@bjtech.com',
  address: '北京市朝阳区建国路100号',
  rating: 'A',
  status: '合格',
  establishedDate: '2010-05-20',
  registeredCapital: '1000万元',
  businessScope: '机械设备、电子产品销售',
  bankName: '中国工商银行',
  bankAccount: '1234567890123456789',
  taxNumber: '91110000MA01234567',
  isApproved: true,
  hasISO: true,
  cooperationYears: 5,
  description: '长期合作伙伴，产品质量稳定，交货及时'
})

// 子表1：供应产品
const productColumns = [
  { key: 'productCode', label: '产品编码', width: '150px', align: 'center', dataAlign: 'left' },
  { key: 'productName', label: '产品名称', width: '200px', align: 'center', dataAlign: 'left' },
  { key: 'category', label: '类别', width: '120px', align: 'center', dataAlign: 'left' },
  { key: 'unitPrice', label: '单价(CNY)', width: '120px', align: 'center', dataAlign: 'right' },
  { key: 'minOrderQty', label: '最小起订量', width: '120px', align: 'center', dataAlign: 'right' },
  { key: 'deliveryDays', label: '交货周期(天)', width: '120px', align: 'center', dataAlign: 'right' },
  { key: 'status', label: '状态', width: '80px', align: 'center', dataAlign: 'center' }
]

const productData = ref([
  { productCode: 'PROD001', productName: '钢材A', category: '原材料', unitPrice: 300.00, minOrderQty: 10, deliveryDays: 7, status: '正常' },
  { productCode: 'PROD002', productName: '铝材B', category: '原材料', unitPrice: 250.00, minOrderQty: 5, deliveryDays: 5, status: '正常' },
  { productCode: 'PROD003', productName: '铜材C', category: '原材料', unitPrice: 375.00, minOrderQty: 3, deliveryDays: 10, status: '正常' }
])

// 子表2：评估记录
const evaluationColumns = [
  { key: 'evalDate', label: '评估日期', width: '120px', align: 'center', dataAlign: 'center' },
  { key: 'evaluator', label: '评估人', width: '100px', align: 'center', dataAlign: 'left' },
  { key: 'qualityScore', label: '质量评分', width: '100px', align: 'center', dataAlign: 'right' },
  { key: 'deliveryScore', label: '交货评分', width: '100px', align: 'center', dataAlign: 'right' },
  { key: 'serviceScore', label: '服务评分', width: '100px', align: 'center', dataAlign: 'right' },
  { key: 'totalScore', label: '总分', width: '100px', align: 'center', dataAlign: 'right' },
  { key: 'rating', label: '等级', width: '80px', align: 'center', dataAlign: 'center' }
]

const evaluationData = ref([
  { evalDate: '2025-12-15', evaluator: '王主管', qualityScore: 95, deliveryScore: 90, serviceScore: 92, totalScore: 92.3, rating: 'A' },
  { evalDate: '2025-06-20', evaluator: '李主管', qualityScore: 93, deliveryScore: 88, serviceScore: 90, totalScore: 90.3, rating: 'A' },
  { evalDate: '2024-12-10', evaluator: '王主管', qualityScore: 90, deliveryScore: 85, serviceScore: 88, totalScore: 87.7, rating: 'B' }
])

// 子表3：合作订单
const orderColumns = [
  { key: 'orderNumber', label: '订单号', width: '150px', align: 'center', dataAlign: 'left' },
  { key: 'orderDate', label: '订单日期', width: '120px', align: 'center', dataAlign: 'center' },
  { key: 'amount', label: '金额(CNY)', width: '130px', align: 'center', dataAlign: 'right' },
  { key: 'deliveryDate', label: '交货日期', width: '120px', align: 'center', dataAlign: 'center' },
  { key: 'actualDeliveryDate', label: '实际交货', width: '120px', align: 'center', dataAlign: 'center' },
  { key: 'status', label: '状态', width: '100px', align: 'center', dataAlign: 'center' }
]

const orderData = ref([
  { orderNumber: 'PO2026050001', orderDate: '2026-05-01', amount: 50000.00, deliveryDate: '2026-05-15', actualDeliveryDate: '2026-05-14', status: '已完成' },
  { orderNumber: 'PO2026040015', orderDate: '2026-04-10', amount: 35000.00, deliveryDate: '2026-04-25', actualDeliveryDate: '2026-04-25', status: '已完成' },
  { orderNumber: 'PO2026030008', orderDate: '2026-03-15', amount: 42000.00, deliveryDate: '2026-03-30', actualDeliveryDate: '2026-03-29', status: '已完成' }
])

// 附件列表
const attachments = ref([
  { name: '营业执照.pdf', size: '1.2MB', uploadDate: '2021-01-10' },
  { name: '税务登记证.pdf', size: '0.8MB', uploadDate: '2021-01-10' },
  { name: 'ISO证书.pdf', size: '1.5MB', uploadDate: '2021-01-10' },
  { name: '合作协议.pdf', size: '2.3MB', uploadDate: '2021-01-15' }
])

// 当前激活的标签页
const activeTab = ref('basic')

// 工具栏按钮配置
const toolbarActions = [
  { title: '保存', icon: '/images/nav_icon_save.gif' },
  { title: '取消', icon: '/images/btn_cancelchanges.gif' }
]

const handleToolbarAction = ({ action }) => {
  console.log('操作:', action.title)
}
</script>

<template>
  <div class="supplier-detail">
    <h1 class="page-title">供应商详情</h1>

    <!-- 多标签页 -->
    <MaximoTabs v-model="activeTab">
      <MaximoTab name="basic" label="基本信息" />
      <MaximoTab name="products" label="供应产品" />
      <MaximoTab name="evaluation" label="评估记录" />
      <MaximoTab name="orders" label="合作订单" />
      
      <template #content>
        <!-- 基本信息标签 -->
        <div v-if="activeTab === 'basic'">
          <MaximoSection title="供应商信息">
          <MaximoSectionRow>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.supplierCode" label="供应商编码" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.supplierName" label="供应商名称" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.rating" label="评级" readonly />
            </MaximoSectionCol>
          </MaximoSectionRow>
          <MaximoSectionRow>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.contactPerson" label="联系人" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.phone" label="联系电话" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.email" label="邮箱" readonly />
            </MaximoSectionCol>
          </MaximoSectionRow>
          <MaximoSectionRow>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.status" label="状态" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.establishedDate" label="成立日期" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.registeredCapital" label="注册资本" readonly />
            </MaximoSectionCol>
          </MaximoSectionRow>
          <MaximoSectionRow>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.taxNumber" label="税号" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.bankName" label="开户银行" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.bankAccount" label="银行账号" readonly />
            </MaximoSectionCol>
          </MaximoSectionRow>
          <MaximoSectionRow>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.cooperationYears" label="合作年限" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoCheckbox v-model="formData.isApproved" label="已审核" disabled />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoCheckbox v-model="formData.hasISO" label="ISO认证" disabled />
            </MaximoSectionCol>
          </MaximoSectionRow>
          <MaximoSectionRow>
            <MaximoSectionCol :span="24">
              <MaximoTextbox v-model="formData.address" label="地址" readonly />
            </MaximoSectionCol>
          </MaximoSectionRow>
          <MaximoSectionRow>
            <MaximoSectionCol :span="24">
              <MaximoMultilineTextbox v-model="formData.businessScope" label="经营范围" :rows="2" readonly />
            </MaximoSectionCol>
          </MaximoSectionRow>
          <MaximoSectionRow>
            <MaximoSectionCol :span="24">
              <MaximoMultilineTextbox v-model="formData.description" label="备注" :rows="2" readonly />
            </MaximoSectionCol>
          </MaximoSectionRow>
        </MaximoSection>

        <!-- 附件 -->
        <MaximoSection title="资质文件">
          <MaximoAttachments :attachments="attachments" />
        </MaximoSection>
        </div>

        <!-- 供应产品标签 -->
        <div v-if="activeTab === 'products'">
          <MaximoSection title="供应产品列表">
          <MaximoTable
            :columns="productColumns"
            :data="productData"
            :show-toolbar="true"
            :show-footer="true"
            :toolbar-actions-before="toolbarActions"
            @toolbar-action="handleToolbarAction"
          />
        </MaximoSection>
        </div>

        <!-- 评估记录标签 -->
        <div v-if="activeTab === 'evaluation'">
          <MaximoSection title="评估记录">
          <MaximoTable
            :columns="evaluationColumns"
            :data="evaluationData"
            :show-toolbar="false"
            :show-footer="true"
          />
        </MaximoSection>
        </div>

        <!-- 合作订单标签 -->
        <div v-if="activeTab === 'orders'">
          <MaximoSection title="合作订单历史">
          <MaximoTable
            :columns="orderColumns"
            :data="orderData"
            :show-toolbar="false"
            :show-footer="true"
          />
        </MaximoSection>
        </div>
      </template>
    </MaximoTabs>
  </div>
</template>

<style scoped>
.supplier-detail {
  padding: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}
</style>
