<script setup>
import { ref } from 'vue'
import MaximoTextbox from '../components/MaximoTextbox.vue'
import MaximoTable from '../components/MaximoTable.vue'
import MaximoSection from '../components/MaximoSection.vue'
import MaximoSectionRow from '../components/MaximoSectionRow.vue'
import MaximoSectionCol from '../components/MaximoSectionCol.vue'
import MaximoTabs from '../components/MaximoTabs.vue'
import MaximoTab from '../components/MaximoTab.vue'

// 主表数据 (ITEM - 零件Master)
const formData = ref({
  itemnum: 'ITEM-001',         // 零件编号 (*)
  description: '高强度螺栓',   // 零件名称 (*)
  descriptionEn: 'High Strength Bolt', // 英文名称 (*)
  project: 'PJ-001',           // プロジェクト (*)
  type3: '量産',               // 量産/補給 (*)
  opStatus: 'SOP',            // SOP/EOP (*)
  accountingClass: 'AC-01',    // 計上分類 (*)
  pallet: '',                  // パレ
  packageType: '纸箱',         // 紙箱/木箱/鉄箱
  type2: '库存',               // 直送/试做/库存 (*)
  supplier: '供应商A',         // サプライヤー (*)
  purchaseRemark: '',          // 采购备注
  manufacturer: '制造商A',     // 生産メーカ
  productionArea: '中国',      // 生産地域
  moldCostAllocation: '',      // 模具费均摊方式
  customer: '',                // 客户
  customerDestination: '',     // 客户目的地
  salesRemark: '',             // 销售备注
  hsCode: '7318.15',          // HS Code
  unit1: '个',                 // 申告単位1
  unit2: '千克',               // 申告単位2
  declarationElement: '',      // 申告要素
  usage: '汽车组装',           // 用途
  principle: '',               // 原理
  applicableModel: 'Model X',  // 適用車型
  customerCode: '',            // 取引先コード
  status: '活动'               // 状态 (-)
})

// 当前选中的标签页
const activeTab = ref('purchase')

// 阶梯价格列定义 (ITEMTIEREDCOST)
const tieredPriceColumns = [
  { key: 'sn', label: '序号', width: '80px', dataAlign: 'center' },
  { key: 'minquantity', label: '最小数量', width: '120px', dataAlign: 'right' },
  { key: 'maxquantity', label: '最大数量', width: '120px', dataAlign: 'right' },
  { key: 'unitcost', label: '单价(CNY)', width: '120px', dataAlign: 'right' },
  { key: 'currency', label: '外币种类', width: '100px', dataAlign: 'center' },
  { key: 'foreignUnitCost', label: '外币单价', width: '120px', dataAlign: 'right' },
  { key: 'description', label: '描述', width: '200px', dataAlign: 'left' }
]

// 采购阶梯价格数据
const purchasePrices = ref([
  { sn: 1, minquantity: 1, maxquantity: 100, unitcost: 5.71, currency: 'USD', foreignUnitCost: 0.80, description: '首批优惠' },
  { sn: 2, minquantity: 101, maxquantity: 500, unitcost: 5.50, currency: 'USD', foreignUnitCost: 0.77, description: '批量优惠' }
])

// 销售阶梯价格数据
const salesPrices = ref([
  { sn: 1, minquantity: 1, maxquantity: 50, unitcost: 8.00, currency: 'EUR', foreignUnitCost: 0.73, description: '零售单价' },
  { sn: 2, minquantity: 51, maxquantity: 200, unitcost: 7.50, currency: 'EUR', foreignUnitCost: 0.68, description: '批发单价' }
])

// 物流阶梯价格数据
const logisticsPrices = ref([
  { sn: 1, minquantity: 1, maxquantity: 100, unitcost: 1.20, currency: 'JPY', foreignUnitCost: 17.50, description: '标准物流费' },
  { sn: 2, minquantity: 101, maxquantity: 1000, unitcost: 1.00, currency: 'JPY', foreignUnitCost: 14.60, description: '大宗物流费' }
])


</script>

<template>
  <div class="item-master-detail">
    <h1 class="page-title">零件Master详情</h1>

    <!-- 零件详细信息 -->
    <MaximoSection>
      <table class="tdtblw">
        <MaximoSectionRow>
          <MaximoSectionCol>
            <MaximoSection title="基础信息">
              <MaximoSectionRow>
                <MaximoSectionCol>
                  <MaximoTextbox v-model="formData.itemnum" label="零件编号" :required="true" width="200px" />
                  <MaximoTextbox v-model="formData.description" label="零件名称" :required="true" width="200px" />
                  <MaximoTextbox v-model="formData.descriptionEn" label="英文名称" :required="true" width="200px" />
                </MaximoSectionCol>
                <MaximoSectionCol>
                  <MaximoTextbox v-model="formData.project" label="プロジェクト" :required="true" width="200px" />
                  <MaximoTextbox v-model="formData.type3" label="量産/補給" :required="true" width="200px" />
                  <MaximoTextbox v-model="formData.opStatus" label="SOP/EOP" :required="true" width="200px" />
                </MaximoSectionCol>
                <MaximoSectionCol>
                  <MaximoTextbox v-model="formData.accountingClass" label="計上分類" :required="true" width="200px" />
                  <MaximoTextbox v-model="formData.pallet" label="パレ" width="200px" />
                  <MaximoTextbox v-model="formData.packageType" label="紙箱/木箱/鉄箱" width="200px" />
                </MaximoSectionCol>
              </MaximoSectionRow>
            </MaximoSection>
          </MaximoSectionCol>
        </MaximoSectionRow>

        <MaximoSectionRow>
          <MaximoSectionCol>
            <MaximoSection title="采购相关">
              <MaximoSectionRow>
                <MaximoSectionCol>
                  <MaximoTextbox v-model="formData.type2" label="直送/试做/库存" :required="true" width="200px" />
                  <MaximoTextbox v-model="formData.moldCostAllocation" label="模具费均摊方式" width="200px" />
                </MaximoSectionCol>
                <MaximoSectionCol>
                  <MaximoTextbox v-model="formData.supplier" label="サプライヤー" :required="true" width="200px" />
                  <MaximoTextbox v-model="formData.purchaseRemark" label="采购备注" width="200px" />
                </MaximoSectionCol>
                <MaximoSectionCol>
                  <MaximoTextbox v-model="formData.manufacturer" label="生産メーカ" width="200px" />
                  <MaximoTextbox v-model="formData.productionArea" label="生産地域" width="200px" />
                </MaximoSectionCol>
              </MaximoSectionRow>
            </MaximoSection>
          </MaximoSectionCol>
        </MaximoSectionRow>

        <MaximoSectionRow>
          <MaximoSectionCol>
            <MaximoSection title="销售相关">
              <MaximoSectionRow>
                <MaximoSectionCol width="33%">
                  <MaximoTextbox v-model="formData.customer" label="客户" width="200px" />
                </MaximoSectionCol>
                <MaximoSectionCol width="33%">
                  <MaximoTextbox v-model="formData.customerDestination" label="客户目的地" width="200px" />
                </MaximoSectionCol>
                <MaximoSectionCol width="34%">
                  <MaximoTextbox v-model="formData.salesRemark" label="销售备注" width="200px" />
                </MaximoSectionCol>
              </MaximoSectionRow>
            </MaximoSection>
          </MaximoSectionCol>
        </MaximoSectionRow>

        <MaximoSectionRow>
          <MaximoSectionCol colspan="3">
            <MaximoSection title="报关信息">
              <MaximoSectionCol>
                <MaximoTextbox v-model="formData.hsCode" label="HS Code" width="200px" />
                <MaximoTextbox v-model="formData.unit1" label="申告単位1" width="200px" />
                <MaximoTextbox v-model="formData.unit2" label="申告単位2" width="200px" />
              </MaximoSectionCol>
              <MaximoSectionCol>
                <MaximoTextbox v-model="formData.declarationElement" label="申告要素" width="200px" />
                <MaximoTextbox v-model="formData.usage" label="用途" width="200px" />
                <MaximoTextbox v-model="formData.principle" label="原理" width="200px" />
              </MaximoSectionCol>
              <MaximoSectionCol>
                <MaximoTextbox v-model="formData.applicableModel" label="適用車型" width="200px" />
                <MaximoTextbox v-model="formData.customerCode" label="取引先コード" width="200px" />
              </MaximoSectionCol>
            </MaximoSection>
          </MaximoSectionCol>
        </MaximoSectionRow>
      </table>
    </MaximoSection>

    <!-- 阶梯价格标签页 -->
    <MaximoSection>
      <MaximoTabs v-model="activeTab">
        <MaximoTab name="purchase" label="采购阶梯价格" />
        <MaximoTab name="sales" label="销售阶梯价格" />
        <MaximoTab name="logistics" label="物流阶梯价格" />

        <template #content>
          <div v-if="activeTab === 'purchase'">
            <MaximoTable title="采购阶梯价格" :columns="tieredPriceColumns"
              :data="purchasePrices" :show-toolbar="true" :show-footer="false"
              :selectable="false" :showRecordCount="false"
              :toolbar-actions-before="[{ title: '新增行', icon: '/images/nav_icon_insert.gif' }]"
              :show-action-column="true" :row-actions="[{ title: '删除', icon: '/images/btn_garbage.gif' }]" />
          </div>
          <div v-else-if="activeTab === 'sales'">
            <MaximoTable title="销售阶梯价格" :columns="tieredPriceColumns"
              :data="salesPrices" :show-toolbar="true" :show-footer="false"
              :selectable="false" :showRecordCount="false"
              :toolbar-actions-before="[{ title: '新增行', icon: '/images/nav_icon_insert.gif' }]"
              :show-action-column="true" :row-actions="[{ title: '删除', icon: '/images/btn_garbage.gif' }]" />
          </div>
          <div v-else-if="activeTab === 'logistics'">
            <MaximoTable title="物流阶梯价格" :columns="tieredPriceColumns"
              :data="logisticsPrices" :show-toolbar="true" :show-footer="false"
              :selectable="false" :showRecordCount="false"
              :toolbar-actions-before="[{ title: '新增行', icon: '/images/nav_icon_insert.gif' }]"
              :show-action-column="true" :row-actions="[{ title: '删除', icon: '/images/btn_garbage.gif' }]" />
          </div>
        </template>
      </MaximoTabs>
    </MaximoSection>
  </div>
</template>

<style scoped>
.item-master-detail {
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
