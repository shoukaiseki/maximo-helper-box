<script setup>
import { ref } from 'vue'
import MaximoTextbox from '../components/MaximoTextbox.vue'
import MaximoTable from '../components/MaximoTable.vue'
import MaximoSection from '../components/MaximoSection.vue'
import MaximoSectionRow from '../components/MaximoSectionRow.vue'
import MaximoSectionCol from '../components/MaximoSectionCol.vue'
import MaximoButtonGroup from '../components/MaximoButtonGroup.vue'
import MaximoButton from '../components/MaximoButton.vue'

// 主表数据
const formData = ref({
  recordnum: 'PD-001',       // 盘点记录
  storeroom: 'CK-001',       // 盘点仓库
  countdate: '2026-04-30',   // 盘点日期
  counter: '赵',             // 盘点人员
  status: '执行中',          // 状态
  counttype: '年度盘点',     // 盘点类型
  adjustresult: '完成',      // 调整结果
  reviewer: '王'             // 审核人员
})

// 子表数据：盘点明细
const countDetails = ref([
  {
    itemnum: 'ITEM001',
    description: '螺栓M10',
    boxnum: 'A-01',
    lastcountdate: '2026-03-15',
    iscounted: '是',
    bookqty: 1000,
    actualqty: 950,
    diffqty: -50,
    remark: '部分损耗'
  },
  {
    itemnum: 'ITEM002',
    description: '螺母M10',
    boxnum: 'A-02',
    lastcountdate: '2026-03-15',
    iscounted: '是',
    bookqty: 2000,
    actualqty: 2000,
    diffqty: 0,
    remark: ''
  },
  {
    itemnum: 'ITEM003',
    description: '垫片M10',
    boxnum: 'B-01',
    lastcountdate: '2026-03-15',
    iscounted: '否',
    bookqty: 5000,
    actualqty: 5100,
    diffqty: 100,
    remark: '多入库未登记'
  }
])

// 子表列定义
const detailColumns = [
  { key: 'itemnum', label: '零件编号', width: '120px', dataAlign: 'left' },
  { key: 'description', label: '零件名称', width: '150px', dataAlign: 'left' },
  { key: 'boxnum', label: '箱柜号', width: '100px', dataAlign: 'center' },
  { key: 'lastcountdate', label: '上次盘点日期', width: '120px', dataAlign: 'center' },
  { key: 'iscounted', label: '已盘', width: '100px', dataAlign: 'center' },
  { key: 'bookqty', label: '账面数量', width: '100px', dataAlign: 'right' },
  { key: 'actualqty', label: '实盘数量', width: '100px', dataAlign: 'right' },
  { key: 'diffqty', label: '差异数量', width: '100px', dataAlign: 'right' },
  { key: 'remark', label: '原因说明', width: '200px', dataAlign: 'left' }
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
    countDetails.value.push({
      itemnum: '',
      description: '',
      boxnum: '',
      lastcountdate: '',
      iscounted: '否',
      bookqty: 0,
      actualqty: 0,
      diffqty: 0,
      remark: ''
    })
  }
}

// 处理自定义按钮点击
const handlePrint = () => {
  console.log('打印盘点清单')
  // TODO: 实现打印功能
}

const handleAdjust = () => {
  console.log('调整库存')
  // TODO: 实现库存调整功能
}

// 处理行内操作
const handleRowAction = ({ action, rowIndex }) => {
  if (action.title === '删除') {
    countDetails.value.splice(rowIndex, 1)
  }
}
</script>

<template>
  <div class="inventory-count-detail">
    <h1 class="page-title">盘点详情</h1>

    <!-- 盘点信息 -->
    <MaximoSection title="盘点信息">
      <table class="tdtblw">
        <!-- 行 1: 盘点记录 | 状态 -->
        <MaximoSectionRow>
          <MaximoSectionCol>
            <MaximoTextbox
              v-model="formData.recordnum"
              label="盘点记录"
              :readonly="true"
              width="200px"
            />
          </MaximoSectionCol>
          <MaximoSectionCol>
            <MaximoTextbox
              v-model="formData.status"
              label="状态"
              :readonly="true"
              width="200px"
            />
          </MaximoSectionCol>
        </MaximoSectionRow>

        <!-- 行 2: 盘点仓库 | 盘点日期 -->
        <MaximoSectionRow>
          <MaximoSectionCol>
            <MaximoTextbox
              v-model="formData.storeroom"
              label="盘点仓库"
              width="200px"
              :required="true"
            />
          </MaximoSectionCol>
          <MaximoSectionCol>
            <MaximoTextbox
              v-model="formData.counter"
              label="盘点人员"
              :readonly="true"
              width="200px"
            />
          </MaximoSectionCol>
        </MaximoSectionRow>

        <!-- 行 3: 盘点人员 | 审核人员 -->
        <MaximoSectionRow>
          <MaximoSectionCol>
            <MaximoTextbox
              v-model="formData.countdate"
              label="盘点日期"
              width="200px"
              :required="true"
            />
          </MaximoSectionCol>
          <MaximoSectionCol>
            <MaximoTextbox
              v-model="formData.reviewer"
              label="审核人员"
              :readonly="true"
              width="200px"
            />
          </MaximoSectionCol>
        </MaximoSectionRow>

        <!-- 行 4: 盘点类型 | 调整结果 -->
        <MaximoSectionRow>
          <MaximoSectionCol>
            <MaximoTextbox
              v-model="formData.counttype"
              label="盘点类型"
              width="200px"
              :required="true"
            />
          </MaximoSectionCol>
          <MaximoSectionCol>
            <MaximoTextbox
              v-model="formData.adjustresult"
              label="调整结果"
              :readonly="true"
              width="200px"
            />
          </MaximoSectionCol>
        </MaximoSectionRow>
      </table>
    </MaximoSection>

    <!-- 盘点明细 -->
    <MaximoSection>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <h2 class="table-title" style="margin: 0;">盘点明细</h2>
        <MaximoButtonGroup align="right">
          <MaximoButton label="打印清单" @click="handlePrint" />
          <MaximoButton label="调整库存" :default="true" @click="handleAdjust" />
        </MaximoButtonGroup>
      </div>
      <MaximoTable
        :columns="detailColumns"
        :data="countDetails"
        :show-toolbar="true"
        :show-footer="false"
        :selectable="true"
        :toolbar-actions-before="toolbarActions"
        :show-action-column="true"
        :row-actions="rowActions"
        @toolbar-action="handleToolbarAction"
        @row-action="handleRowAction"
      />
    </MaximoSection>
  </div>
</template>

<style scoped>
.inventory-count-detail {
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
