<script setup>
import { ref } from 'vue'
import MaximoTextbox from '../components/MaximoTextbox.vue'
import MaximoCheckbox from '../components/MaximoCheckbox.vue'
import MaximoSection from '../components/MaximoSection.vue'
import MaximoSectionRow from '../components/MaximoSectionRow.vue'
import MaximoSectionCol from '../components/MaximoSectionCol.vue'

// 表单数据
const formData = ref({
  storeroomnum: 'WH-001',      // 库房编号 (*)
  description: '主仓库',       // 库房名称 (*)
  address: '北京市朝阳区工业园路88号',           // 收货地址
  status: '有效',        // 状态
  isdirectship: false,   // 是否直发库 (*)
  site: '北京总部',              // 地点
  parentstoreroom: '',   // 父库房
  reorderstoreroom: 'WH-MAIN',  // 再订购库房
  reordersite: '北京总部',       // 再订购地点
  
  // 财务科目
  glaccount: 'GL-1001',             // GL 控制科目 (*)
  costadjustaccount: 'GL-2001',     // 成本调整科目 (*)
  receiptvaraccount: 'GL-3001',     // 收据差异科目 (*)
  purchasevaraccount: 'GL-4001',    // 采购差价科目 (*)
  scrapaccount: 'GL-5001',          // 损耗科目 (*)
  invoicevaraccount: 'GL-6001',     // 发票差异科目 (*)
  currencyvaraccount: 'GL-7001'     // 货币差异科目 (*)
})

// 保存操作
const handleSave = () => {
  console.log('保存库房信息:', formData.value)
  // TODO: 实现保存逻辑
}
</script>

<template>
  <div class="storeroom-detail">
    <h1 class="page-title">库房详情</h1>

    <!-- 库房基本信息 -->
    <MaximoSection title="库房信息">
      <table class="tdtblw">
        <!-- 紧凑型三列布局 -->
        <MaximoSectionRow>
          <!-- 第一列：基本信息（左上角） -->
          <MaximoSectionCol>
            <MaximoTextbox v-model="formData.storeroomnum" label="库房编号" :required="true" width="200px" />
            <MaximoTextbox v-model="formData.description" label="库房名称" :required="true" width="200px" />
            <MaximoTextbox v-model="formData.address" label="收货地址" width="200px" />
          </MaximoSectionCol>
          
          <!-- 第二列：状态类信息（右上角） -->
          <MaximoSectionCol>
            <!-- <MaximoTextbox v-model="formData.parentstoreroom" label="父库房" width="200px" /> -->
            <MaximoTextbox v-model="formData.reorderstoreroom" label="再订购库房" width="200px" />
            <MaximoTextbox v-model="formData.reordersite" label="再订购地点" width="200px" />
          </MaximoSectionCol>
          
          <!-- 第三列：关联信息 -->
          <MaximoSectionCol>
            <div style="padding-left: 69px;">
              <MaximoCheckbox v-model="formData.isdirectship" label="是否直发库" />
            </div>
            <MaximoTextbox v-model="formData.status" label="状态" :readonly="true" width="200px" />
            <MaximoTextbox v-model="formData.site" label="地点" width="200px" />
          </MaximoSectionCol>
        </MaximoSectionRow>
      </table>
    </MaximoSection>

    <!-- 财务与关联信息 -->
    <MaximoSection title="财务与关联信息">
      <table class="tdtblw">
        <!-- 行 1: 位置 | 地点 -->

        <!-- 行 2: 父库房 | 再订购库房 -->

        <!-- 行 3: GL 控制科目(*) | 再订购地点 -->
        <MaximoSectionRow>
          <MaximoSectionCol>
            <MaximoTextbox v-model="formData.glaccount" label="GL 控制科目" :required="true" width="200px" />
          </MaximoSectionCol>
          <MaximoSectionCol>
          </MaximoSectionCol>
        </MaximoSectionRow>

        <!-- 行 4: 成本调整科目(*) | 损耗科目(*) -->
        <MaximoSectionRow>
          <MaximoSectionCol>
            <MaximoTextbox v-model="formData.costadjustaccount" label="成本调整科目" :required="true" width="200px" />
          </MaximoSectionCol>
          <MaximoSectionCol>
            <MaximoTextbox v-model="formData.scrapaccount" label="损耗科目" :required="true" width="200px" />
          </MaximoSectionCol>
        </MaximoSectionRow>

        <!-- 行 5: 收据差异科目(*) | 发票差异科目(*) -->
        <MaximoSectionRow>
          <MaximoSectionCol>
            <MaximoTextbox v-model="formData.receiptvaraccount" label="收据差异科目" :required="true" width="200px" />
          </MaximoSectionCol>
          <MaximoSectionCol>
            <MaximoTextbox v-model="formData.invoicevaraccount" label="发票差异科目" :required="true" width="200px" />
          </MaximoSectionCol>
        </MaximoSectionRow>

        <!-- 行 6: 采购差价科目(*) | 货币差异科目(*) -->
        <MaximoSectionRow>
          <MaximoSectionCol>
            <MaximoTextbox v-model="formData.purchasevaraccount" label="采购差价科目" :required="true" width="200px" />
          </MaximoSectionCol>
          <MaximoSectionCol>
            <MaximoTextbox v-model="formData.currencyvaraccount" label="货币差异科目" :required="true" width="200px" />
          </MaximoSectionCol>
        </MaximoSectionRow>
      </table>
    </MaximoSection>

  </div>
</template>

<style scoped>
.storeroom-detail {
  padding: 20px;
}

.page-title {
  color: #161616;
  font-size: 28px;
  margin-bottom: 30px;
  border-bottom: 2px solid #0F62FE;
  padding-bottom: 10px;
}

.action-buttons {
  margin-top: 20px;
  display: flex;
  gap: 12px;
}

.primary-action-btn {
  background: #0f62fe;
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.primary-action-btn:hover {
  background: #0353e9;
}
</style>
