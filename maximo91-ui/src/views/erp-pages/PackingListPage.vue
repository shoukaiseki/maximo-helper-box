<script setup>
import { ref } from 'vue'
import MaximoTextbox from '../components/MaximoTextbox.vue'
import MaximoTable from '../components/MaximoTable.vue'
import MaximoSection from '../components/MaximoSection.vue'
import MaximoSectionRow from '../components/MaximoSectionRow.vue'
import MaximoSectionCol from '../components/MaximoSectionCol.vue'

// 主表数据
const formData = ref({
  plNum: 'PL001',               // PL Num
  description: '',              // 描述
  creator: 'XXXX',              // 创建人
  status: '批准',               // 状态
  createTime: '2027/1/1',       // 创建时间
  
  // 购买方信息
  buyer: '',                    // 购买方
  buyerPhone: '',               // 购买电话
  buyerAddress: '',             // 购买地址
  
  // 销售方信息
  seller: '',                   // 销售方
  sellerPhone: '',              // 销售电话
  sellerAddress: '',            // 销售地址
  
  // 通知方信息
  notifyParty: '',              // 通知方
  notifyPhone: '',              // 通知电话
  notifyAddress: '',            // 通知地址
  
  // 物流信息
  deliveryPlace: '',            // 交货地点
  targetPort: '',               // 目标港口
  transitVia: '',               // 中转经由
  packaging: '',                // 包装
  transportMode: '',            // 运输方式
  packingDate: '',              // 装箱日期
  totalQuantity: '',            // 总数量
  totalNetWeight: '',           // 总净重
  totalGrossWeight: ''          // 总毛重
})

// Packing List 明细数据
const packingListDetails = ref([
  {
    sn: 1,
    orderNum: 'P001',
    packingListNum: 'PL001',
    materialNum: 'XXXXX1',
    name: 'XX1总成',
    quantity: 15,
    boxNum: '',
    route: '',
    packingOrderNum: '',
    status: '批准'
  },
  {
    sn: 2,
    orderNum: 'P001',
    packingListNum: 'PL001',
    materialNum: 'XXXXX1',
    name: 'XX1总成',
    quantity: 15,
    boxNum: '',
    route: '',
    packingOrderNum: '',
    status: '批准'
  },
  {
    sn: 3,
    orderNum: 'P002',
    packingListNum: 'PL001',
    materialNum: 'XXXXX2',
    name: 'XX2总成',
    quantity: 20,
    boxNum: '',
    route: '',
    packingOrderNum: '',
    status: '批准'
  },
  {
    sn: 4,
    orderNum: 'P002',
    packingListNum: 'PL001',
    materialNum: 'XXXXX2',
    name: 'XX2总成',
    quantity: 20,
    boxNum: '',
    route: '',
    packingOrderNum: '',
    status: '批准'
  },
  {
    sn: 5,
    orderNum: 'P002',
    packingListNum: 'PL001',
    materialNum: 'XXXXX2',
    name: 'XX2总成',
    quantity: 20,
    boxNum: '',
    route: '',
    packingOrderNum: '',
    status: '批准'
  }
])

// Packing List 明细列定义
const detailColumns = [
  { key: 'sn', label: '序号', width: '80px', dataAlign: 'center' },
  { key: 'orderNum', label: '订单号', width: '120px', dataAlign: 'left' },
  { key: 'packingListNum', label: 'Packing List Num', width: '150px', dataAlign: 'left' },
  { key: 'materialNum', label: '零件编号', width: '120px', dataAlign: 'left' },
  { key: 'name', label: '名称', width: '150px', dataAlign: 'left' },
  { key: 'quantity', label: '数量', width: '100px', dataAlign: 'right' },
  { key: 'boxNum', label: '箱号', width: '100px', dataAlign: 'center' },
  { key: 'route', label: '路线', width: '100px', dataAlign: 'left' },
  { key: 'packingOrderNum', label: '装箱单号', width: '120px', dataAlign: 'left' },
  { key: 'status', label: '状态', width: '100px', dataAlign: 'center' }
]
</script>

<template>
  <div class="packing-list-page">
    <h1 class="page-title">Packing List</h1>

    <!-- Packing List 主表 -->
    <MaximoSection title="Packing List 信息">
      <table class="tdtblw">
        <MaximoSectionRow>
          <MaximoSectionCol colspan="1">
            <MaximoTextbox v-model="formData.plNum" label="PL Num" :readonly="true" width="200px" />
          </MaximoSectionCol>
          <MaximoSectionCol colspan="1">
            <MaximoTextbox v-model="formData.seller" label="销售方" width="200px" />
          </MaximoSectionCol>
          <MaximoSectionCol>
            <MaximoTextbox v-model="formData.status" label="状态" :readonly="true" width="200px" />
          </MaximoSectionCol>
        </MaximoSectionRow>

        <!-- 描述占两列 -->
        <MaximoSectionRow>
          <MaximoSectionCol colspan="2">
            <MaximoTextbox v-model="formData.description" label="描述" width="420px" />
          </MaximoSectionCol>
          <MaximoSectionCol>
            <MaximoTextbox v-model="formData.notifyParty" label="通知方" width="200px" />
          </MaximoSectionCol>
        </MaximoSectionRow>
        
        <!-- 紧凑型三列布局 -->
        <MaximoSectionRow>
          <!-- 第一列：基本信息 -->
          <MaximoSectionCol>
            <MaximoTextbox v-model="formData.creator" label="创建人" :readonly="true" width="200px" />
            <MaximoTextbox v-model="formData.createTime" label="创建时间" :readonly="true" width="200px" />
            <MaximoTextbox v-model="formData.buyer" label="购买方" width="200px" />
            <MaximoTextbox v-model="formData.buyerPhone" label="购买电话" width="200px" />
            <MaximoTextbox v-model="formData.buyerAddress" label="购买地址" width="200px" />
            <MaximoTextbox v-model="formData.deliveryPlace" label="交货地点" width="200px" />
            <MaximoTextbox v-model="formData.packaging" label="包装" width="200px" />
            <MaximoTextbox v-model="formData.totalQuantity" label="总数量" width="200px" />
          </MaximoSectionCol>
          
          <!-- 第二列：销售方信息 -->
          <MaximoSectionCol>
            <MaximoTextbox v-model="formData.sellerPhone" label="销售电话" width="200px" />
            <MaximoTextbox v-model="formData.sellerAddress" label="销售地址" width="200px" />
            <MaximoTextbox v-model="formData.targetPort" label="目标港口" width="200px" />
            <MaximoTextbox v-model="formData.transportMode" label="运输方式" width="200px" />
            <MaximoTextbox v-model="formData.totalNetWeight" label="总净重" width="200px" />
          </MaximoSectionCol>
          
          <!-- 第三列：通知信息 -->
          <MaximoSectionCol>
            <MaximoTextbox v-model="formData.notifyPhone" label="通知电话" width="200px" />
            <MaximoTextbox v-model="formData.notifyAddress" label="通知地址" width="200px" />
            <MaximoTextbox v-model="formData.transitVia" label="中转经由" width="200px" />
            <MaximoTextbox v-model="formData.packingDate" label="装箱日期" width="200px" />
            <MaximoTextbox v-model="formData.totalGrossWeight" label="总毛重" width="200px" />
          </MaximoSectionCol>
        </MaximoSectionRow>
      </table>
    </MaximoSection>

    <!-- Packing List 明细 -->
    <MaximoSection>
      <MaximoTable
        title="Packing List 明细"
        :columns="detailColumns"
        :data="packingListDetails"
        :show-toolbar="true"
        :show-footer="false"
        :selectable="true"
        :show-action-column="false"
      />
    </MaximoSection>
  </div>
</template>

<style scoped>
.packing-list-page {
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
