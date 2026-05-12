<script setup>
import { ref } from 'vue'
import MaximoTextbox from '../components/MaximoTextbox.vue'
import MaximoTable from '../components/MaximoTable.vue'
import MaximoSection from '../components/MaximoSection.vue'
import MaximoSectionRow from '../components/MaximoSectionRow.vue'
import MaximoSectionCol from '../components/MaximoSectionCol.vue'
import MaximoTableDetail from '../components/MaximoTableDetail.vue'
import MaximoTabs from '../components/MaximoTabs.vue'
import MaximoTab from '../components/MaximoTab.vue'

// 父表数据 (ITEMRM) - 零件变更申请
const headerData = ref({
  itemrmnum: 'ITEMRM-2026001', // 登记申请单号 (-)
  changeType: '',              // 变更类型 (*)
  supplier: '',                // 供应商 (*)
  manufacturer: '',            // 生産メーカ
  productionArea: '',          // 生産地域
  applicant: '张三',           // 申请人 (*)
  applyDate: '2026-05-09',     // 申请日期 (*)
  status: '草稿',              // 状态 (-)
  createPerson: '李四',        // 创建人 (-)
  createDate: '2026-05-09',    // 创建日期 (-)
  description: '',             // 描述
  remark: '',                  // 备注
  project: '',                 // プロジェクト (*)
  accountingClass: '',         // 計上分類 (*)
  type2: '',                   // 直送/试做/库存 (*)
  type3: ''                    // 量産/補給 (*)
})

// 子表数据 (ITEMRR - 零件明细)
const partsList = ref([
  {
    itemrrnum: 'ITEMRR-001',
    masternum: 'P-1001',       // 零件编号 (*)
    description: '高强度螺栓',   // 零件名称 (*)
    descriptionEn: 'High Strength Bolt', // 英文名称 (*)
    supplier: '供应商A',       // サプライヤー (*)
    project: 'PJ-001',         // プロジェクト (*)
    accountingClass: 'AC-01',  // 計上分類 (*)
    type2: '库存',             // 直送/试做/库存 (*)
    type3: '量産',             // 量産/補給 (*)
    opStatus: 'SOP',            // SOP/EOP (*)
    pallet: '',                // パレ
    packageType: '纸箱',       // 紙箱/木箱/鉄箱
    customer: '',              // 客户
    customerDestination: '',   // 客户目的地
    hsCode: '7318.15',         // HS Code
    unit1: '个',               // 申告単位1
    unit2: '千克',             // 申告単位2
    declarationElement: '',    // 申告要素
    usage: '汽车组装',         // 用途
    principle: '',             // 原理
    applicableModel: 'Model X',// 適用車型
    customerCode: '',          // 取引先コード
    moldCostAllocation: '',    // 模具费均摊方式
    purchaseRemark: '',        // 采购备注
    salesRemark: '',           // 销售备注
    tieredPrices: [            // 嵌套的阶梯价格
      { sn: 1, minquantity: 1, maxquantity: 100, unitcost: 5.71, currency: 'USD', foreignUnitCost: 0.80, description: '首批优惠' },
      { sn: 2, minquantity: 101, maxquantity: 500, unitcost: 5.50, currency: 'USD', foreignUnitCost: 0.77, description: '批量优惠' }
    ],
    salesPrices: [
      { sn: 1, minquantity: 1, maxquantity: 50, unitcost: 8.00, currency: 'EUR', foreignUnitCost: 0.73, description: '零售单价' },
      { sn: 2, minquantity: 51, maxquantity: 200, unitcost: 7.50, currency: 'EUR', foreignUnitCost: 0.68, description: '批发单价' }
    ],
    logisticsPrices: [
      { sn: 1, minquantity: 1, maxquantity: 100, unitcost: 1.20, currency: 'JPY', foreignUnitCost: 17.50, description: '标准物流费' },
      { sn: 2, minquantity: 101, maxquantity: 1000, unitcost: 1.00, currency: 'JPY', foreignUnitCost: 14.60, description: '大宗物流费' }
    ]
  }
])

// 当前选中的零件索引
const selectedPartIndex = ref(0)

// 当前选中的标签页
const activeTab = ref('purchase')

// 子表列定义 (ITEMRR - 简化显示)
const partColumns = [
  { key: 'masternum', label: '零件编号', width: '120px', dataAlign: 'left' },
  { key: 'description', label: '零件名称', width: '150px', dataAlign: 'left' },
  { key: 'supplier', label: '供应商', width: '120px', dataAlign: 'left' },
  { key: 'type2', label: '直送/试做/库存', width: '120px', dataAlign: 'center' },
  { key: 'type3', label: '量産/補給', width: '100px', dataAlign: 'center' },
  { key: 'project', label: 'プロジェクト', width: '100px', dataAlign: 'center' }
]

// 阶梯价格列定义 (ITEMRRTIEREDCOST)
const tieredPriceColumns = [
  { key: 'sn', label: '序号', width: '80px', dataAlign: 'center' },
  { key: 'minquantity', label: '最小数量', width: '120px', dataAlign: 'right' },
  { key: 'maxquantity', label: '最大数量', width: '120px', dataAlign: 'right' },
  { key: 'unitcost', label: '单价(CNY)', width: '120px', dataAlign: 'right' },
  { key: 'currency', label: '外币种类', width: '100px', dataAlign: 'center' },
  { key: 'foreignUnitCost', label: '外币单价', width: '120px', dataAlign: 'right' },
  { key: 'description', label: '描述', width: '200px', dataAlign: 'left' }
]

const othenPriceColumns = [
  { key: 'sn', label: '序号', width: '80px', dataAlign: 'center' },
  { key: 'minquantity', label: '最小数量', width: '120px', dataAlign: 'right' },
  { key: 'maxquantity', label: '最大数量', width: '120px', dataAlign: 'right' },
  { key: 'unitcost', label: '单价(CNY)', width: '120px', dataAlign: 'right' },
  { key: 'currency', label: '外币种类', width: '100px', dataAlign: 'center' },
  { key: 'foreignUnitCost', label: '外币单价', width: '120px', dataAlign: 'right' },
  { key: 'description', label: '备注', width: '200px', dataAlign: 'left' }
]
const othenPriceDatas=[

]


// 工具栏按钮配置（在默认按钮之前）
const toolbarActions = [
  {
    title: '新增',
    icon: '/images/nav_icon_insert.gif'
  }
]

// 行内操作按钮配置
const rowActions = [
  {
    title: '删除',
    icon: '/images/btn_garbage.gif'
  }
]

// 处理工具栏操作
const handleToolbarAction = ({ action }) => {
  if (action.title === '新增') {
    partsList.value.push({
      itemrrnum: '',
      masternum: '',
      description: '',
      descriptionEn: '',
      supplier: headerData.value.supplier, // 默认继承父表供应商
      project: '',
      accountingClass: '',
      type2: '',
      type3: '',
      tieredPrices: []
    })
  }
}

// 处理行内操作
const handleRowAction = ({ action, rowIndex }) => {
  if (action.title === '删除') {
    partsList.value.splice(rowIndex, 1)
  }
}
</script>

<template>
  <div class="parts-application-detail">
    <h1 class="page-title">零件变更申请详情</h1>

    <!-- 父表：申请单头信息 (ITEMRM) -->
    <MaximoSection title="零件变更申请">
      <table class="tdtblw">
        <MaximoSectionRow>
          <!-- 第一列：变更信息 -->
          <MaximoSectionCol>
            <MaximoTextbox v-model="headerData.itemrmnum" label="登记申请单号" :readonly="true" width="200px" />
            <MaximoTextbox v-model="headerData.changeType" label="变更类型" :required="true" width="200px" />
            <MaximoTextbox v-model="headerData.project" label="プロジェクト" :required="true" width="200px" />
            <MaximoTextbox v-model="headerData.supplier" label="供应商" :required="true" width="200px" />
            <MaximoTextbox v-model="headerData.manufacturer" label="生産メーカ" width="200px" />
          </MaximoSectionCol>

          <!-- 第二列：状态与人员信息 -->
          <MaximoSectionCol>
            <MaximoTextbox v-model="headerData.type2" label="直送/试做/库存" :required="true" width="200px" />
            <MaximoTextbox v-model="headerData.type3" label="量産/補給" :required="true" width="200px" />
            <MaximoTextbox v-model="headerData.accountingClass" label="計上分類" :required="true" width="200px" />
            <MaximoTextbox v-model="headerData.productionArea" label="生産地域" width="200px" />
          </MaximoSectionCol>

          <!-- 第三列：项目与分类信息 -->
          <MaximoSectionCol>
            <MaximoTextbox v-model="headerData.createPerson" label="创建人" :readonly="true" width="200px" />
            <MaximoTextbox v-model="headerData.status" label="状态" :readonly="true" width="200px" />
            <MaximoTextbox v-model="headerData.applicant" label="申请人" :required="true" width="200px" />
            <MaximoTextbox v-model="headerData.applyDate" label="申请日期" :required="true" width="200px" />
          </MaximoSectionCol>
        </MaximoSectionRow>

        <MaximoSectionRow>
          <MaximoSectionCol colspan="3">
            <MaximoTextbox v-model="headerData.remark" label="备注" width="500px" />
          </MaximoSectionCol>
        </MaximoSectionRow>
      </table>
    </MaximoSection>

    <!-- 子表：零件明细 (ITEMRR) -->
    <MaximoSection>
      <MaximoTable title="零件明细" :columns="partColumns" :data="partsList" :show-toolbar="true" :show-footer="false"
        :selectable="true" v-model="selectedPartIndex"
        :toolbar-actions-before="[{ title: '新增', icon: '/images/nav_icon_insert.gif' }]" :show-action-column="true"
        :row-actions="[{ title: '删除', icon: '/images/btn_garbage.gif' }]" @toolbar-action="handleToolbarAction"
        @row-action="handleRowAction" />

      <!-- 零件详细信息展示 (MaximoTableDetail) -->
      <MaximoTableDetail v-if="partsList[selectedPartIndex]" title="零件详细信息">
        <table class="tdtblw">
          <MaximoSectionRow>
            <MaximoSectionCol>
              <MaximoSection title="基础信息">
                <MaximoSectionRow>
                  <MaximoSectionCol>
                    <MaximoTextbox v-model="partsList[selectedPartIndex].masternum" label="零件编号" :required="true"
                      width="200px" />
                    <MaximoTextbox v-model="partsList[selectedPartIndex].description" label="零件名称" :required="true"
                      width="200px" />
                    <MaximoTextbox v-model="partsList[selectedPartIndex].descriptionEn" label="英文名称" :required="true"
                      width="200px" />
                  </MaximoSectionCol>
                  <MaximoSectionCol>
                    <MaximoTextbox v-model="partsList[selectedPartIndex].project" label="プロジェクト" :required="true"
                      width="200px" />
                    <MaximoTextbox v-model="partsList[selectedPartIndex].type3" label="量産/補給" :required="true"
                      width="200px" />
                    <MaximoTextbox v-model="partsList[selectedPartIndex].opStatus" label="SOP/EOP" :required="true" 
                      width="200px" />
                  </MaximoSectionCol>
                  <MaximoSectionCol>
                    <MaximoTextbox v-model="partsList[selectedPartIndex].accountingClass" label="計上分類" :required="true"
                      width="200px" />
                    <MaximoTextbox v-model="partsList[selectedPartIndex].pallet" label="パレ" width="200px" />
                      <MaximoTextbox v-model="partsList[selectedPartIndex].packageType" label="紙箱/木箱/鉄箱" width="200px" />
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
                      <MaximoTextbox v-model="partsList[selectedPartIndex].type2" label="直送/试做/库存" :required="true"
                        width="200px" />
                      <MaximoTextbox v-model="partsList[selectedPartIndex].moldCostAllocation" label="模具费均摊方式" width="200px" />
                    </MaximoSectionCol>
                    <MaximoSectionCol>
                      <MaximoTextbox v-model="partsList[selectedPartIndex].supplier" label="サプライヤー" :required="true"
                        width="200px" />
                      <MaximoTextbox v-model="partsList[selectedPartIndex].purchaseRemark" label="采购备注" width="200px" />
                    </MaximoSectionCol>
                    <MaximoSectionCol>
                      <MaximoTextbox v-model="partsList[selectedPartIndex].manufacturer" label="生産メーカ" width="200px" />
                      <MaximoTextbox v-model="partsList[selectedPartIndex].productionArea" label="生産地域" width="200px" />
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
                    <MaximoTextbox v-model="partsList[selectedPartIndex].customer" label="客户" width="200px" />
                  </MaximoSectionCol>
                  <MaximoSectionCol width="33%">
                  <MaximoTextbox v-model="partsList[selectedPartIndex].customerDestination" label="客户目的地"
                    width="200px" />
                  </MaximoSectionCol>
                  <MaximoSectionCol width="34%">
                    <MaximoTextbox v-model="partsList[selectedPartIndex].salesRemark" label="销售备注" width="200px" />
                  </MaximoSectionCol>
                </MaximoSectionRow>
              </MaximoSection>
            </MaximoSectionCol>
          </MaximoSectionRow>

          <MaximoSectionRow>
            <MaximoSectionCol colspan="3">

              <MaximoSection title="报关信息">
                <!-- 第四列：海关与用途 -->
                <MaximoSectionCol>
                  <MaximoTextbox v-model="partsList[selectedPartIndex].hsCode" label="HS Code" width="200px" />
                  <MaximoTextbox v-model="partsList[selectedPartIndex].unit1" label="申告単位1" width="200px" />
                  <MaximoTextbox v-model="partsList[selectedPartIndex].unit2" label="申告単位2" width="200px" />
                </MaximoSectionCol>
                <MaximoSectionCol>
                  <MaximoTextbox v-model="partsList[selectedPartIndex].declarationElement" label="申告要素" width="200px" />
                  <MaximoTextbox v-model="partsList[selectedPartIndex].usage" label="用途" width="200px" />
                  <MaximoTextbox v-model="partsList[selectedPartIndex].principle" label="原理" width="200px" />
                </MaximoSectionCol>
                <MaximoSectionCol>
                  <MaximoTextbox v-model="partsList[selectedPartIndex].applicableModel" label="適用車型" width="200px" />
                  <MaximoTextbox v-model="partsList[selectedPartIndex].customerCode" label="取引先コード" width="200px" />
                </MaximoSectionCol>

              </MaximoSection>
            </MaximoSectionCol>
          </MaximoSectionRow>
        </table>

      </MaximoTableDetail>
    </MaximoSection>

    <!-- 阶梯价格标签页 -->
    <MaximoSection>
      <MaximoTabs v-model="activeTab">
        <MaximoTab name="purchase" label="采购阶梯价格" />
        <MaximoTab name="sales" label="销售阶梯价格" />
        <MaximoTab name="logistics" label="物流阶梯价格" />
        <!-- <MaximoTab name="other" label="其他价格" /> -->

        <template #content>
          <div v-if="activeTab === 'purchase'">
            <MaximoTable title="采购阶梯价格" :columns="tieredPriceColumns"
            :showRecordCount="false"
              :data="partsList[selectedPartIndex].tieredPrices || []" :show-toolbar="true" :show-footer="false"
              :selectable="false" :toolbar-actions-before="[{ title: '新增行', icon: '/images/nav_icon_insert.gif' }]"
              :show-action-column="true" :row-actions="[{ title: '删除', icon: '/images/btn_garbage.gif' }]" />
          </div>
          <div v-else-if="activeTab === 'sales'">
            <MaximoTable title="采购阶梯价格" :columns="tieredPriceColumns"
            :showRecordCount="false"
              :data="partsList[selectedPartIndex].salesPrices || []" :show-toolbar="true" :show-footer="false"
              :selectable="false" :toolbar-actions-before="[{ title: '新增行', icon: '/images/nav_icon_insert.gif' }]"
              :show-action-column="true" :row-actions="[{ title: '删除', icon: '/images/btn_garbage.gif' }]" />
          </div>
          <div v-else-if="activeTab === 'logistics'">
            <MaximoTable title="物流阶梯价格" :columns="tieredPriceColumns"
            :showRecordCount="false"
              :data="partsList[selectedPartIndex].logisticsPrices || []" :show-toolbar="true" :show-footer="false"
              :selectable="false" :toolbar-actions-before="[{ title: '新增行', icon: '/images/nav_icon_insert.gif' }]"
              :show-action-column="true" :row-actions="[{ title: '删除', icon: '/images/btn_garbage.gif' }]" />
          </div>
          <div v-else-if="activeTab === 'other'">
            <MaximoTable title="其他价格" :columns="othenPriceColumns"
            :showRecordCount="false"
              :data="othenPriceDatas || []" :show-toolbar="true" :show-footer="false"
              :selectable="false" :toolbar-actions-before="[{ title: '新增行', icon: '/images/nav_icon_insert.gif' }]"
              :show-action-column="true" :row-actions="[{ title: '删除', icon: '/images/btn_garbage.gif' }]" />
          </div>
        </template>
      </MaximoTabs>
    </MaximoSection>
  </div>
</template>

<style scoped>
.parts-application-detail {
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
