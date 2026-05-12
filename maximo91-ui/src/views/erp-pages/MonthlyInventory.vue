<script setup>
import { ref } from 'vue'
import MaximoTextbox from '../components/MaximoTextbox.vue'
import MaximoTable from '../components/MaximoTable.vue'
import MaximoSection from '../components/MaximoSection.vue'
import MaximoSectionRow from '../components/MaximoSectionRow.vue'
import MaximoSectionCol from '../components/MaximoSectionCol.vue'
import MaximoButtonGroup from '../components/MaximoButtonGroup.vue'
import MaximoButton from '../components/MaximoButton.vue'

// 查询参数
const queryParams = ref({
  queryYear: '2026',
  queryMonth: '3'
})

// 表格列定义
const columns = [
  { key: 'itemnum', label: '零件编码', width: '120px', dataAlign: 'left' },
  { key: 'description', label: '零件名称', width: '120px', dataAlign: 'left' },
  { key: 'descriptionEn', label: '英文名称', width: '150px', dataAlign: 'left' },
  { key: 'batchnum', label: '批号', width: '100px', dataAlign: 'center' },
  { key: 'unit', label: '单位', width: '80px', dataAlign: 'center' },
  { key: 'inventory', label: '库存数量', width: '100px', dataAlign: 'right' },
  { key: 'beginqty', label: '月初数量', width: '100px', dataAlign: 'right' },
  { key: 'inqty', label: '入库数量', width: '100px', dataAlign: 'right' },
  { key: 'outqty', label: '出库数量', width: '100px', dataAlign: 'right' },
  
]

// 模拟数据
const tableData = ref([
  {
    itemnum: '7552269030',
    description: 'TORRO CLAMP Φ140-160 マーキング有',
    descriptionEn: 'TORRO CLAMP Φ140-160 with marking',
    batchnum: '7/8/2025',
    unit: '件',
    inventory: 0,
    beginqty: 850,
    inqty: 0,
    outqty: 850,
    day_2026_3_1_in: 0,
    day_2026_3_1_out: 850,
    day_2026_3_18_in: 0,
    day_2026_3_18_out: 0
  },
  {
    itemnum: '8981333470',
    description: 'TORRO CLAMP Φ40-55',
    descriptionEn: 'TORRO CLAMP Φ40-55',
    batchnum: '9/18/2025',
    unit: '件',
    inventory: 0,
    beginqty: 17000,
    inqty: 0,
    outqty: 17000,
    day_2026_3_1_in: 0,
    day_2026_3_1_out: 0,
    day_2026_3_18_in: 0,
    day_2026_3_18_out: 17000
  },
  {
    itemnum: '8981333490',
    description: 'TORRO CLAMP Φ55-75',
    descriptionEn: 'TORRO CLAMP Φ55-75',
    batchnum: '9/18/2025',
    unit: '件',
    inventory: 17500,
    beginqty: 38000,
    inqty: 0,
    outqty: 20500,
    day_2026_3_1_in: 0,
    day_2026_3_1_out: 0,
    day_2026_3_18_in: 0,
    day_2026_3_18_out: 20500
  },
  {
    itemnum: '8981333590',
    description: 'TORRO CLAMP Φ110-130',
    descriptionEn: 'TORRO CLAMP Φ110-130',
    batchnum: '9/18/2025',
    unit: '件',
    inventory: 950,
    beginqty: 1650,
    inqty: 0,
    outqty: 700,
    day_2026_3_1_in: 0,
    day_2026_3_1_out: 0,
    day_2026_3_18_in: 0,
    day_2026_3_18_out: 700
  },
  {
    itemnum: '8981333600',
    description: 'TORRO CLAMP Φ130-150',
    descriptionEn: 'TORRO CLAMP Φ130-150',
    batchnum: '9/18/2025',
    unit: '件',
    inventory: 0,
    beginqty: 1600,
    inqty: 0,
    outqty: 1600,
    day_2026_3_1_in: 0,
    day_2026_3_1_out: 0,
    day_2026_3_18_in: 0,
    day_2026_3_18_out: 1600
  }
])

// 工具栏按钮配置（在默认按钮之前）
const toolbarActions = [
//   {
//     title: '报表打印',
//     icon: '/images/tablebtn_download.gif'
//   }
]

// 查询方法
const handleQuery = () => {
  console.log('查询月度库存:', queryParams.value.queryYear, '年', queryParams.value.queryMonth, '月')
  // TODO: 调用API查询数据
}

// 处理工具栏操作
const handleToolbarAction = ({ action }) => {
  if (action.title === '报表打印') {
    console.log('打印报表')
    // TODO: 实现报表打印功能
  }
}
</script>

<template>
  <div class="monthly-inventory">
    <h1 class="page-title">月度库存分析</h1>

    <!-- 查询条件 -->
    <MaximoSection>

      <table class="tdtblw">
        <MaximoSectionRow>
          <MaximoSectionCol>
          <MaximoTextbox
            v-model="queryParams.queryYear"
            label="请输入查询月份：年"
            width="80px"
            placeholder="2026"
          />
      </MaximoSectionCol>
          <MaximoSectionCol>
          <MaximoTextbox
            v-model="queryParams.queryMonth"
            label="月"
            width="80px"
            placeholder="3"
          />
      </MaximoSectionCol>
          <MaximoSectionCol>
        <MaximoButtonGroup>
          <MaximoButton label="查询" :default="true"  />
        </MaximoButtonGroup>
      </MaximoSectionCol>
    </MaximoSectionRow>
</table>

    </MaximoSection>

    <!-- 库存列表 -->
    <MaximoSection>
      <MaximoTable
        title="月度库存明细"
        :columns="columns"
        :data="tableData"
        :show-toolbar="true"
        :show-footer="true"
        :selectable="true"
        :total-records="tableData.length"
        :page-size="15"
        :current-page="1"
        :toolbar-actions-before="toolbarActions"
        @toolbar-action="handleToolbarAction"
      />
    </MaximoSection>
  </div>
</template>

<style scoped>
.monthly-inventory {
  padding: 20px;
}

.page-title {
  color: #161616;
  font-size: 28px;
  margin-bottom: 30px;
  border-bottom: 2px solid #0F62FE;
  padding-bottom: 10px;
}

.query-section {
  padding: 15px;
}

.query-label {
  font-size: 14px;
  color: #161616;
  margin-right: 10px;
}

.query-inputs {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.query-btn {
  padding: 5px 20px;
  background: linear-gradient(to bottom, #ffffff 0%, #e5e5e5 100%);
  border: 1px solid #8e8e8e;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
  color: #161616;
  margin-left: 10px;
}

.query-btn:hover {
  background: linear-gradient(to bottom, #ffffff 0%, #d0d0d0 100%);
}

.query-btn:active {
  background: linear-gradient(to bottom, #d0d0d0 0%, #ffffff 100%);
}
</style>
