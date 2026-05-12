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
  unit: '个',
  itemnum: '',             // 零件编号 (*)
  description: '',         // 零件名称 (*)
  descriptionEn: '',       // 英文名称 (*)
  batchnum: '',            // 批号
  storeroom: '',           // 仓库
  inventory: '',           // 库存数量
  availableqty: '',        // 可用数量
  reservedqty: '',         // 预留数量
  safetyqty: '',           // 安全库存
  totalpurchase: '',       // 累计采购数
  invstatus: '正常',       // 库存状态
  status: '有效'           // 状态 (-)
})

// 子表数据：库存余量
const inventoryBalance = ref([
  {
    balanceid: 1,
    cabinetnum: 'A-01-001',
    actualqty: 50,
    batchnum: 'BATCH-2026-001',
    unitcost: 5.71
  },
  {
    balanceid: 2,
    cabinetnum: 'A-01-002',
    actualqty: 30,
    batchnum: 'BATCH-2026-002',
    unitcost: 5.50
  },
  {
    balanceid: 3,
    cabinetnum: 'B-02-001',
    actualqty: 20,
    batchnum: 'BATCH-2026-003',
    unitcost: 5.20
  }
])

// 库存余量列定义
const inventoryBalanceColumns = [
  { key: 'balanceid', label: '序号', width: '80px', dataAlign: 'center' },
  { key: 'cabinetnum', label: '箱柜号', width: '150px', dataAlign: 'left' },
  { key: 'actualqty', label: '实际库存余量', width: '150px', dataAlign: 'right' },
  { key: 'batchnum', label: '批次号', width: '150px', dataAlign: 'left' },
  { key: 'unitcost', label: '单价(CNY)', width: '120px', dataAlign: 'right' }
]

// 当前选中的标签页
const activeTab = ref('inventoryInfo')

// 入库记录数据
const matRecTrans = ref([
  {
    transid: 1,
    transdate: '2026-04-15',
    transtype: '采购入库',
    quantity: 100,
    unitcost: 5.71,
    totalcost: 571.00,
    vendor: 'XX供应商',
    ponum: 'PO-2026-001',
    projectnum: 'PROJ-2026-001',
    plancategory: '年度计划',
    remark: '首批采购'
  },
  {
    transid: 2,
    transdate: '2026-04-20',
    transtype: '采购入库',
    quantity: 200,
    unitcost: 5.50,
    totalcost: 1100.00,
    vendor: 'XX供应商',
    ponum: 'PO-2026-002',
    projectnum: 'PROJ-2026-002',
    plancategory: '临时计划',
    remark: '补货'
  }
])

// 出库记录数据
const matUseTrans = ref([
  {
    transid: 1,
    transdate: '2026-04-18',
    transtype: '生产领料',
    quantity: 50,
    unitcost: 5.71,
    totalcost: 285.50,
    customer: 'XX客户A',
    destination: '北京市朝阳区',
    department: '生产部',
    remark: '生产线A领料'
  },
  {
    transid: 2,
    transdate: '2026-04-22',
    transtype: '销售出库',
    quantity: 30,
    unitcost: 5.71,
    totalcost: 171.30,
    sonum: 'SO-2026-001',
    customer: 'XX客户B',
    destination: '上海市浦东新区',
    department: '销售部',
    remark: '客户订单发货'
  }
])

// 入库记录列定义
const matRecTransColumns = [
  { key: 'vendor', label: '供应商', width: '150px', dataAlign: 'left' },
  { key: 'ponum', label: '送货单号', width: '150px', dataAlign: 'left' },
  { key: 'projectnum', label: '项目编号', width: '150px', dataAlign: 'left' },
  { key: 'plancategory', label: '计划分类', width: '120px', dataAlign: 'left' },
  { key: 'transdate', label: '交易日期', width: '120px', dataAlign: 'center' },
  { key: 'transtype', label: '交易类型', width: '120px', dataAlign: 'left' },
  { key: 'quantity', label: '数量', width: '100px', dataAlign: 'right' },
  { key: 'unitcost', label: '单价', width: '100px', dataAlign: 'right' },
  { key: 'totalcost', label: '总金额', width: '120px', dataAlign: 'right' },
  { key: 'remark', label: '备注', width: '200px', dataAlign: 'left' }
]

// 出库记录列定义
const matUseTransColumns = [
  { key: 'transdate', label: '交易日期', width: '120px', dataAlign: 'center' },
  { key: 'transtype', label: '交易类型', width: '120px', dataAlign: 'left' },
  { key: 'quantity', label: '数量', width: '100px', dataAlign: 'right' },
  { key: 'unitcost', label: '单价', width: '100px', dataAlign: 'right' },
  { key: 'totalcost', label: '总金额', width: '120px', dataAlign: 'right' },
  { key: 'customer', label: '客户', width: '150px', dataAlign: 'left' },
  { key: 'destination', label: '客户目的地', width: '200px', dataAlign: 'left' },
  { key: 'sonum', label: '销售单号', width: '150px', dataAlign: 'left' },
  // { key: 'department', label: '部门', width: '120px', dataAlign: 'left' },
  { key: 'remark', label: '备注', width: '200px', dataAlign: 'left' }
]
</script>

<template>
  <div class="inventory-detail">
    <MaximoTabs v-model="activeTab">
      <!-- 标签页按钮 -->
      <MaximoTab name="inventoryInfo" label="库存信息" />
      <MaximoTab name="inventoryMatRecTrans" label="入库记录" />
      <MaximoTab name="inventoryMatUseTrans" label="出库记录" />
      <!-- 标签页内容 -->
      <template #content>
        <div v-show="activeTab === 'inventoryInfo'">
          <!-- 库存信息 -->
          <MaximoSection title="库存">
            <table class="tdtblw">
              <!-- 紧凑型三列布局：同一列内垂直堆叠多个字段 -->
              <MaximoSectionRow>
                <!-- 第一列：零件信息（左上角） -->
                <MaximoSectionCol>
                  <MaximoTextbox v-model="formData.storeroom" label="库房" :readonly="true" width="200px" />
                  <MaximoTextbox v-model="formData.itemnum" label="零件编号" :readonly="true" width="200px" />
                  <MaximoTextbox v-model="formData.description" label="零件名称" :readonly="true" width="200px" />
                  <MaximoTextbox v-model="formData.descriptionEn" label="英文名称" :readonly="true" width="200px" />
                </MaximoSectionCol>
                
                <!-- 第二列：状态类信息（右上角） -->
                <MaximoSectionCol>
                  <MaximoTextbox v-model="formData.invstatus" label="库存状态" :readonly="true" width="200px" />
                  <MaximoTextbox v-model="formData.status" label="状态" :readonly="true" width="200px" />
                  <!-- <MaximoTextbox v-model="formData.batchnum" label="批号" :readonly="true" width="200px" /> -->
                  <MaximoTextbox v-model="formData.unit" label="单位" :readonly="true" width="200px" />
                </MaximoSectionCol>
                
                <!-- 第三列：数量信息 -->
                <MaximoSectionCol>
                  <MaximoTextbox v-model="formData.safetyqty" label="安全库存" width="200px" />
                  <MaximoTextbox v-model="formData.totalpurchase" label="累计采购数" :readonly="true" width="200px" />
                </MaximoSectionCol>
              </MaximoSectionRow>
              <MaximoSectionRow>
                <MaximoSectionCol>
                  <MaximoTextbox v-model="formData.inventory" label="当前余量" :readonly="true" width="200px" />
                </MaximoSectionCol>
                <MaximoSectionCol>
                  <MaximoTextbox v-model="formData.availableqty" label="已装运总数" :readonly="true" width="200px" />
                </MaximoSectionCol>
                <MaximoSectionCol>
                  <!-- <MaximoTextbox v-model="formData.reservedqty" label="预留数量" :readonly="true" width="200px" /> -->
                </MaximoSectionCol>
              </MaximoSectionRow>
            </table>
          </MaximoSection>

          <!-- 库存余量 -->
          <MaximoSection>
            <MaximoTable
          title="库存余量"
              :columns="inventoryBalanceColumns"
              :data="inventoryBalance"
              :show-toolbar="true"
              :show-footer="false"
              :selectable="true"
              :show-action-column="false"
            />
          </MaximoSection>
        </div>
        <div v-show="activeTab === 'inventoryMatRecTrans'">
          <!-- 入库记录 -->
          <MaximoSection title="入库记录">
            <MaximoSectionRow>
              <MaximoSectionCol>
                <MaximoTextbox v-model="formData.itemnum" label="零件编号" :readonly="true" width="200px" />
              </MaximoSectionCol>
              <MaximoSectionCol>
                <MaximoTextbox v-model="formData.description" label="零件名称" :readonly="true" width="200px" />
              </MaximoSectionCol>
              <MaximoSectionCol>
                <MaximoTextbox v-model="formData.descriptionEn" label="英文名称" :readonly="true" width="200px" />
              </MaximoSectionCol>
            </MaximoSectionRow>
              <MaximoSectionRow>
                <MaximoSectionCol colspan="3">
                <MaximoTable
                  :columns="matRecTransColumns"
                  :data="matRecTrans"
                  :show-toolbar="true"
                  :show-footer="false"
                  :selectable="true"
                  :show-action-column="false"
                />
                </MaximoSectionCol>
              </MaximoSectionRow>
          </MaximoSection>
        </div>
        <!-- 出库记录 -->
        <div v-show="activeTab === 'inventoryMatUseTrans'">
          <MaximoSection title="出库记录">
            <MaximoSectionRow>
              <MaximoSectionCol>
                <MaximoTextbox v-model="formData.itemnum" label="零件编号" :readonly="true" width="200px" />
              </MaximoSectionCol>
              <MaximoSectionCol>
                <MaximoTextbox v-model="formData.description" label="零件名称" :readonly="true" width="200px" />
              </MaximoSectionCol>
              <MaximoSectionCol>
                <MaximoTextbox v-model="formData.descriptionEn" label="英文名称" :readonly="true" width="200px" />
              </MaximoSectionCol>
            </MaximoSectionRow>
              <MaximoSectionRow>
                <MaximoSectionCol colspan="3">
            <MaximoTable
              :columns="matUseTransColumns"
              :data="matUseTrans"
              :show-toolbar="true"
              :show-footer="false"
              :selectable="true"
              :show-action-column="false"
            />
                </MaximoSectionCol>
              </MaximoSectionRow>
          </MaximoSection>
        </div>
      </template>
    </MaximoTabs>
  </div>
</template>

<style scoped>
.inventory-detail {
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
