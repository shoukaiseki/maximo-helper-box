<script setup>
import { ref } from 'vue'
import MaximoTextbox from '../components/MaximoTextbox.vue'
import MaximoTable from '../components/MaximoTable.vue'
import MaximoSection from '../components/MaximoSection.vue'
import MaximoSectionRow from '../components/MaximoSectionRow.vue'
import MaximoSectionCol from '../components/MaximoSectionCol.vue'
import MaximoTabs from '../components/MaximoTabs.vue'
import MaximoTab from '../components/MaximoTab.vue'

// 主表数据
const formData = ref({
  documentNum: 'PL001',           // 文件单号
  description: 'XXXX装箱单文件',  // 描述
  creator: 'XXXX',                // 创建人
  status: '批准',                 // 状态
  createTime: '2027/1/1',         // 创建时间
  
  // 购买方信息
  buyer: '',                      // 购买方
  buyerPhone: '',                 // 购买电话
  buyerAddress: '',               // 购买地址

  boxNum: '',
  
  // 销售方信息
  seller: '',                     // 销售方
  sellerPhone: '',                // 销售电话
  sellerAddress: '',              // 销售地址
  
  // 财务信息
  amount: '',                     // 金额
  remark: ''                      // 备注
})

// 装箱单明细数据
const packingListDetails = ref([
  {
    sn: 1,
    packingListNum: 'PN01',
    plNum: 'PL001',
    materialNum: 'XXXXX1',
    name: 'XXXXX1',
    quantity: 30,
    salesPrice: 2970,
    boxNum: 'A01',
    route: 'L001',
    logisticsCost: '默认0',
    reserveStatus: '已预留'
  },
  {
    sn: 2,
    packingListNum: 'PN01',
    plNum: 'PL001',
    materialNum: 'XXXXX1',
    name: 'XXXXX1',
    quantity: 15,
    salesPrice: 1470,
    boxNum: 'A01',
    route: 'L001',
    logisticsCost: '默认0',
    reserveStatus: '已预留'
  },
  {
    sn: 3,
    packingListNum: 'PN01',
    plNum: 'PL002',
    materialNum: 'XXXXX2',
    name: 'XXXXX2',
    quantity: 20,
    salesPrice: 990,
    boxNum: 'A01',
    route: 'L001',
    logisticsCost: '默认0',
    reserveStatus: '已预留'
  }
])

// 发票明细数据
const invoiceDetails = ref([
  {
    sn: 1,
    packingListNum: 'PN01',
    plNum: 'PL001',
    materialNum: 'XXXXX1',
    name: 'XXXXX1',
    quantity: 30,
    salesPrice: 2970,
    boxNum: 'A01',
    route: 'L001',
    logisticsCost: '默认0',
    reserveStatus: '已预留'
  },
  {
    sn: 2,
    packingListNum: 'PN01',
    plNum: 'PL001',
    materialNum: 'XXXXX1',
    name: 'XXXXX1',
    quantity: 15,
    salesPrice: 1470,
    boxNum: 'A01',
    route: 'L001',
    logisticsCost: '默认0',
    reserveStatus: '已预留'
  },
  {
    sn: 3,
    packingListNum: 'PN01',
    plNum: 'PL002',
    materialNum: 'XXXXX2',
    name: 'XXXXX2',
    quantity: 20,
    salesPrice: 990,
    boxNum: 'A01',
    route: 'L001',
    logisticsCost: '默认0',
    reserveStatus: '已预留'
  }
])

// 报关单明细数据
const customsDetails = ref([
  {
    sn: 1,
    packingListNum: 'PN01',
    plNum: 'PL001',
    materialNum: 'XXXXX1',
    name: 'XXXXX1',
    quantity: 30,
    salesPrice: 2970,
    boxNum: 'A01',
    route: 'L001',
    logisticsCost: '默认0',
    reserveStatus: '已预留'
  }
])

// 运输费明细数据
const transportDetails = ref([
  {
    sn: 1,
    packingListNum: 'PN01',
    plNum: 'PL001',
    materialNum: 'XXXXX1',
    name: 'XXXXX1',
    quantity: 30,
    salesPrice: 2970,
    boxNum: 'A01',
    route: 'L001',
    logisticsCost: '默认0',
    reserveStatus: '已预留'
  }
])

// 明细列定义
const detailColumns = [
  { key: 'sn', label: '序号', width: '80px', dataAlign: 'center' },
  { key: 'packingListNum', label: '装箱单号', width: '120px', dataAlign: 'left' },
  { key: 'plNum', label: 'PL Num', width: '100px', dataAlign: 'left' },
  { key: 'materialNum', label: '零件编号', width: '120px', dataAlign: 'left' },
  { key: 'name', label: '名称', width: '150px', dataAlign: 'left' },
  { key: 'quantity', label: '数量', width: '100px', dataAlign: 'right' },
  { key: 'salesPrice', label: '销售价', width: '120px', dataAlign: 'right' },
  { key: 'boxNum', label: '箱号', width: '100px', dataAlign: 'center' },
  { key: 'route', label: '路线', width: '100px', dataAlign: 'left' },
  { key: 'logisticsCost', label: '物流费分摊', width: '120px', dataAlign: 'center' },
  { key: 'reserveStatus', label: '预留状态', width: '120px', dataAlign: 'center' }
]

// 当前选中的标签页
const activeTab = ref('invoice')
</script>

<template>
  <div class="document-creation-detail">
    <h1 class="page-title">文件做成</h1>

    <!-- 文件做成主表 -->
    <MaximoSection title="文件做成信息">
      <table class="tdtblw">
        <MaximoSectionRow>
          <MaximoSectionCol colspan="1">
            <MaximoTextbox v-model="formData.documentNum" label="文件单号" :readonly="true" width="200px" />
          </MaximoSectionCol>
          <MaximoSectionCol>
            <MaximoTextbox v-model="formData.creator" label="创建人" :readonly="true" width="200px" />
          </MaximoSectionCol>
          <MaximoSectionCol>
            <MaximoTextbox v-model="formData.status" label="状态" :readonly="true" width="200px" />
          </MaximoSectionCol>
        </MaximoSectionRow>
        <!-- 描述占两列 -->
        <MaximoSectionRow>
          <MaximoSectionCol colspan="1">
            <MaximoTextbox v-model="formData.description" label="描述" width="200px" />
          </MaximoSectionCol>
          <MaximoSectionCol>
            <MaximoTextbox v-model="formData.boxNum" label="装箱单号" :readonly="true" width="200px" />
          </MaximoSectionCol>
          <MaximoSectionCol>
            <MaximoTextbox v-model="formData.createTime" label="创建时间" :readonly="true" width="200px" />
          </MaximoSectionCol>
        </MaximoSectionRow>
        
        <!-- 紧凑型三列布局 -->
        <MaximoSectionRow>
          <!-- 第一列：基本信息 -->
          <MaximoSectionCol>
            <MaximoTextbox v-model="formData.buyer" label="购买方" width="200px" />
            <MaximoTextbox v-model="formData.buyerPhone" label="购买电话" width="200px" />
            <MaximoTextbox v-model="formData.buyerAddress" label="购买地址" width="200px" />
          </MaximoSectionCol>
          
          <!-- 第二列：销售方信息 -->
          <MaximoSectionCol>
            <MaximoTextbox v-model="formData.seller" label="销售方" width="200px" />
            <MaximoTextbox v-model="formData.sellerPhone" label="销售电话" width="200px" />
            <MaximoTextbox v-model="formData.sellerAddress" label="销售地址" width="200px" />
          </MaximoSectionCol>
          
          <!-- 第三列：财务信息 -->
          <MaximoSectionCol>
            <MaximoTextbox v-model="formData.amount" label="金额" width="200px" />
            <MaximoTextbox v-model="formData.remark" label="备注" width="200px" />
          </MaximoSectionCol>
        </MaximoSectionRow>
      </table>
    </MaximoSection>

    <!-- 装箱单明细 -->
    <MaximoSection>
      <MaximoTabs v-model="activeTab">
        <!-- 标签页按钮 -->
        <MaximoTab name="packingList" label="装箱单明细" />
        <MaximoTab name="invoice" label="发票" />
        <MaximoTab name="customs" label="报关单" />
        <MaximoTab name="transport" label="运输费" />

        <!-- 标签页内容 -->
        <template #content>
          <!-- 装箱单明细 -->
          <div v-show="activeTab === 'packingList'">
            <MaximoTable
              title="装箱单明细"
              :columns="detailColumns"
              :data="packingListDetails"
              :show-toolbar="true"
              :show-footer="false"
              :selectable="true"
              :show-action-column="false"
            />
          </div>

          <!-- 发票 -->
          <div v-show="activeTab === 'invoice'">
            <MaximoTable
                title="发票" 
              :columns="detailColumns"
              :data="invoiceDetails"
              :show-toolbar="true"
              :show-footer="false"
              :selectable="true"
              :show-action-column="false"
            />
          </div>

          <!-- 报关单 -->
          <div v-show="activeTab === 'customs'">
            <MaximoTable
                title="报关单" 
              :columns="detailColumns"
              :data="customsDetails"
              :show-toolbar="true"
              :show-footer="false"
              :selectable="true"
              :show-action-column="false"
            />
          </div>

          <!-- 运输费 -->
          <div v-show="activeTab === 'transport'">
            <MaximoTable
                title="运输费" 
              :columns="detailColumns"
              :data="transportDetails"
              :show-toolbar="true"
              :show-footer="false"
              :selectable="true"
              :show-action-column="false"
            />
          </div>
        </template>
      </MaximoTabs>
    </MaximoSection>
  </div>
</template>

<style scoped>
.document-creation-detail {
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
