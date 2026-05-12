<script setup>
import { ref } from 'vue'
import MaximoTextbox from '../components/MaximoTextbox.vue'
import MaximoTable from '../components/MaximoTable.vue'
import MaximoSection from '../components/MaximoSection.vue'
import MaximoSectionRow from '../components/MaximoSectionRow.vue'
import MaximoSectionCol from '../components/MaximoSectionCol.vue'

// 主表数据
const formData = ref({
  packingListNum: 'PL001',        // 装箱单号
  description: '',                // 描述
  creator: 'XXXX',                // 创建人
  status: '已批准',               // 状态
  approveStatus: '批准',          // 批准
  createTime: '2027-01-01',       // 创建时间
  
  // 购买方信息
  buyer: '',                      // 购买方
  buyerPhone: '',                 // 购买电话
  buyerAddress: '',               // 购买地址
  
  // 销售方信息
  seller: '',                     // 销售方
  sellerPhone: '',                // 销售电话
  sellerAddress: '',              // 销售地址
  
  // 通知方信息
  notifyParty: '',                // 通知方
  notifyPhone: '',                // 通知电话
  notifyAddress: '',              // 通知地址
  
  // 物流信息
  deliveryPlace: '',              // 交货地点
  targetPort: '',                 // 目标港口
  transitVia: '',                 // 中转经由
  packaging: '',                  // 包装
  transportMode: '',              // 运输方式
  packingDate: '',                // 装箱日期
  
  // 总计信息
  totalQuantity: '',              // 总数量
  totalNetWeight: '',             // 总净重
  totalGrossWeight: ''            // 总毛重
})

// 装箱单明细数据
const packingDetails = ref([
  {
    sn: 1,
    packingListNum: 'PN01',
    packing: 'PL001',
    materialNum: 'XXXXX1',
    name: 'XXXXX1',
    quantity: 15,
    boxNum: 'A01',
    route: 'L001',
    estimatedOutDate: '2027-01-01'
  },
  {
    sn: 2,
    packingListNum: 'PN01',
    packing: 'PL001',
    materialNum: 'XXXXX1',
    name: 'XXXXX1',
    quantity: 15,
    boxNum: 'A01',
    route: 'L001',
    estimatedOutDate: '2027-01-01'
  },
  {
    sn: 3,
    packingListNum: 'PN01',
    packing: 'PL002',
    materialNum: 'XXXXX2',
    name: 'XXXXX2',
    quantity: 20,
    boxNum: 'A01',
    route: 'L001',
    estimatedOutDate: '2027-01-01'
  }
])

// 装箱单出库操作数据
const outboundOperations = ref([
  {
    sn: 1,
    packingListNum: 'PN01',
    transactionTime: '2026-xx-x',
    materialNum: 'XXXXX1',
    name: 'XXXXX1',
    quantity: 15,
    salesPrice: 100,
    purchasePrice: 88,
    totalPrice: 1500
  },
  {
    sn: 2,
    packingListNum: 'PN01',
    transactionTime: '2026-xx-x',
    materialNum: 'XXXXX1',
    name: 'XXXXX1',
    quantity: 15,
    salesPrice: 98,
    purchasePrice: 88,
    totalPrice: 1470
  },
  {
    sn: 3,
    packingListNum: 'PN01',
    transactionTime: '2026-xx-x',
    materialNum: 'XXXXX1',
    name: 'XXXXX1',
    quantity: 15,
    salesPrice: 98,
    purchasePrice: 88,
    totalPrice: 1470
  },
  {
    sn: 4,
    packingListNum: 'PN01',
    transactionTime: '2026-xx-x',
    materialNum: 'XXXXX2',
    name: 'XXXXX2',
    quantity: 10,
    salesPrice: 50,
    purchasePrice: 66,
    totalPrice: 500
  },
  {
    sn: 5,
    packingListNum: 'PN01',
    transactionTime: '2026-xx-x',
    materialNum: 'XXXXX2',
    name: 'XXXXX2',
    quantity: 10,
    salesPrice: 49,
    purchasePrice: 66,
    totalPrice: 490
  }
])

// 装箱单明细列定义
const packingDetailColumns = [
  { key: 'sn', label: '序号', width: '80px', dataAlign: 'center' },
  { key: 'packingListNum', label: '装箱单号', width: '120px', dataAlign: 'left' },
  { key: 'packing', label: 'Packing', width: '100px', dataAlign: 'left' },
  { key: 'materialNum', label: '零件编号', width: '120px', dataAlign: 'left' },
  { key: 'name', label: '名称', width: '150px', dataAlign: 'left' },
  { key: 'quantity', label: '数量', width: '100px', dataAlign: 'right' },
  { key: 'boxNum', label: '箱号', width: '100px', dataAlign: 'center' },
  { key: 'route', label: '路线', width: '100px', dataAlign: 'left' },
  { key: 'estimatedOutDate', label: '预计出库日期', width: '150px', dataAlign: 'center' }
]

// 装箱单出库操作列定义
const outboundColumns = [
  { key: 'sn', label: '序号', width: '80px', dataAlign: 'center' },
  { key: 'packingListNum', label: '装箱单号', width: '120px', dataAlign: 'left' },
  { key: 'transactionTime', label: '交易时间', width: '120px', dataAlign: 'center' },
  { key: 'materialNum', label: '零件编号', width: '120px', dataAlign: 'left' },
  { key: 'name', label: '名称', width: '150px', dataAlign: 'left' },
  { key: 'quantity', label: '数量', width: '100px', dataAlign: 'right' },
  { key: 'salesPrice', label: '销售单价', width: '120px', dataAlign: 'right' },
  { key: 'purchasePrice', label: '采购单价', width: '120px', dataAlign: 'right' },
  { key: 'totalPrice', label: '销售价', width: '120px', dataAlign: 'right' }
]
</script>

<template>
  <div class="packing-list-detail">
    <h1 class="page-title">装箱单详情</h1>

    <!-- 装箱单主表 -->
    <MaximoSection title="装箱单信息">
      <table class="tdtblw">
        <MaximoSectionRow>
          <!-- 第一列：基本信息 -->
          <MaximoSectionCol>
            <MaximoTextbox v-model="formData.packingListNum" label="装箱单号" :readonly="true" width="200px" />
          </MaximoSectionCol>
          
          <!-- 第二列：销售方信息 -->
          <MaximoSectionCol>
            <MaximoTextbox v-model="formData.creator" label="创建人" :readonly="true" width="200px" />
          </MaximoSectionCol>
          
          <!-- 第三列：状态与通知信息 -->
          <MaximoSectionCol>
            <MaximoTextbox v-model="formData.status" label="状态" :readonly="true" width="200px" />
          </MaximoSectionCol>
        </MaximoSectionRow>
        <MaximoSectionRow>
          <!-- 第一列：基本信息 -->
          <MaximoSectionCol colspan="2">
            <MaximoTextbox v-model="formData.description" label="描述" width="700px" />
          </MaximoSectionCol>
          
          
          <!-- 第三列：状态与通知信息 -->
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
            <MaximoTextbox v-model="formData.deliveryPlace" label="交货地点" width="200px" />
            <MaximoTextbox v-model="formData.packaging" label="包装" width="200px" />
            <MaximoTextbox v-model="formData.totalQuantity" label="总数量" width="200px" />
          </MaximoSectionCol>
          
          <!-- 第二列：销售方信息 -->
          <MaximoSectionCol>
            <MaximoTextbox v-model="formData.seller" label="销售方" width="200px" />
            <MaximoTextbox v-model="formData.sellerPhone" label="销售电话" width="200px" />
            <MaximoTextbox v-model="formData.sellerAddress" label="销售地址" width="200px" />
            <MaximoTextbox v-model="formData.targetPort" label="目标港口" width="200px" />
            <MaximoTextbox v-model="formData.transportMode" label="运输方式" width="200px" />
            <MaximoTextbox v-model="formData.totalNetWeight" label="总净重" width="200px" />
          </MaximoSectionCol>
          
          <!-- 第三列：状态与通知信息 -->
          <MaximoSectionCol>
            <MaximoTextbox v-model="formData.notifyParty" label="通知方" width="200px" />
            <MaximoTextbox v-model="formData.notifyPhone" label="通知电话" width="200px" />
            <MaximoTextbox v-model="formData.notifyAddress" label="通知地址" width="200px" />
            <MaximoTextbox v-model="formData.transitVia" label="中转经由" width="200px" />
            <MaximoTextbox v-model="formData.packingDate" label="装箱日期" width="200px" />
            <MaximoTextbox v-model="formData.totalGrossWeight" label="总毛重" width="200px" />
          </MaximoSectionCol>
        </MaximoSectionRow>
      </table>
    </MaximoSection>

    <!-- 装箱单明细 -->
    <MaximoSection>
      <MaximoTable
        title="装箱单明细"
        :columns="packingDetailColumns"
        :data="packingDetails"
        :show-toolbar="true"
        :show-footer="false"
        :selectable="true"
        :show-action-column="false"
      />
    </MaximoSection>

    <!-- 装箱单出库操作 -->
    <MaximoSection>
      <MaximoTable
        title="装箱单出库操作"
        :columns="outboundColumns"
        :data="outboundOperations"
        :show-toolbar="true"
        :show-footer="false"
        :selectable="true"
        :show-action-column="false"
      />
    </MaximoSection>
  </div>
</template>

<style scoped>
.packing-list-detail {
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
