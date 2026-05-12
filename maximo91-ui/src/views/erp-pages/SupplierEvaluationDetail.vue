<script setup>
import { ref, computed } from 'vue'
import MaximoTextbox from '../components/MaximoTextbox.vue'
import MaximoTable from '../components/MaximoTable.vue'
import MaximoSection from '../components/MaximoSection.vue'
import MaximoSectionRow from '../components/MaximoSectionRow.vue'
import MaximoSectionCol from '../components/MaximoSectionCol.vue'
import MaximoButton from '../components/MaximoButton.vue'
import MaximoAttachments from '../components/MaximoAttachments.vue'

// 主表数据
const formData = ref({
  evalCode: 'EVA-001',           // 评价单号 (-)
  templateCode: 'SQA-001',       // 模板编号 (*)
  supplier: 'XX零件供应商',      // 供应商 (*)
  evalDate: '2026-04-15',        // 评价日期 (*)
  evaluator: '李',               // 评价人员 (*)
  status: '分项打分中',          // 状态 (-)
  totalScore: '系统自动汇总',    // 总分 (-)
  result: '',         // 结果 (-)
  reviewer: '张',                // 审核人员 (-)
  scoringMethod: 'A版'           // 打分方式 (*)
})

// A版评价项目明细（主子表结构）
const evaluationItemsA = ref([
  {
    id: 1,
    category: '品質保証組織',
    subCategory: 'Organization, Responsibility and Authority（組織・責任・権限）',
    categorySeq: 1,
    parent: null,
    children: [
      {
        itemCode: 'SQA-I-001',
        itemName: '品質保証の組織は役割と責任が明確になっている。',
        minScore: 1,
        maxScore: 5,
        minPassScore: 2,
        isRequired: '是',
        actualScore: 3,
        categorySeq: 1,
        itemSeq: 1,
        totalSeq: 1,
        parent: 1,
        remark: ''
      },
      {
        itemCode: 'SQA-I-002',
        itemName: '品質保証最高責任者は責務を遂行している。',
        minScore: 1,
        maxScore: 5,
        minPassScore: 4,
        isRequired: '是',
        actualScore: 2,
        categorySeq: 1,
        itemSeq: 2,
        totalSeq: 2,
        parent: 1,
        remark: ''
      }
    ]
  },
  {
    id: 2,
    category: '体系図',
    subCategory: '開発～サービス段階の各ステップでの実施項目',
    categorySeq: 2,
    parent: null,
    children: [
      {
        itemCode: 'SQA-I-003',
        itemName: '必要な標準類が揃っている。',
        minScore: 1,
        maxScore: 5,
        minPassScore: 2,
        isRequired: '否',
        actualScore: 4,
        categorySeq: 2,
        itemSeq: 1,
        totalSeq: 3,
        parent: 2,
        remark: ''
      },
      {
        itemCode: 'SQA-I-004',
        itemName: '文書管理が適切に行われている。',
        minScore: 1,
        maxScore: 2.5,
        minPassScore: 0,
        isRequired: '是',
        actualScore: 1,
        categorySeq: 2,
        itemSeq: 2,
        totalSeq: 4,
        parent: 2,
        remark: ''
      }
    ]
  }
])

// B版评价项目明细（主子表结构）
const evaluationItemsB = ref([
  {
    id: 1,
    category: '品質保証組織',
    subCategory: 'Organization, Responsibility and Authority（組織・責任・権限）',
    categorySeq: 1,
    maxScore: 10,
    parent: null,
    children: [
      {
        itemCode: 'SQA-I-001',
        itemName: '品質保証の組織は役割と責任が明確になっている。',
        maxScore: 5,
        isRequired: '是',
        actualScore: 3,
        categorySeq: 1,
        itemSeq: 1,
        totalSeq: 1,
        parent: 1,
        remark: ''
      },
      {
        itemCode: 'SQA-I-002',
        itemName: '品質保証最高責任者は責務を遂行している。',
        maxScore: 5,
        isRequired: '是',
        actualScore: 2,
        categorySeq: 1,
        itemSeq: 2,
        totalSeq: 2,
        parent: 1,
        remark: ''
      }
    ]
  },
  {
    id: 2,
    category: '体系図',
    subCategory: '開発～サービス段階の各ステップでの実施項目',
    categorySeq: 2,
    maxScore: 7.5,
    parent: null,
    children: [
      {
        itemCode: 'SQA-I-003',
        itemName: '必要な標準類が揃っている。',
        maxScore: 5,
        isRequired: '否',
        actualScore: 4,
        categorySeq: 2,
        itemSeq: 1,
        totalSeq: 3,
        parent: 2,
        remark: ''
      },
      {
        itemCode: 'SQA-I-004',
        itemName: '文書管理が適切に行われている。',
        maxScore: 2.5,
        isRequired: '是',
        actualScore: 1,
        categorySeq: 2,
        itemSeq: 2,
        totalSeq: 4,
        parent: 2,
        remark: ''
      }
    ]
  }
])

// A版预览列定义（扁平化显示所有检查项）
const previewColumnsA = [
  { key: 'totalSeq', label: '序号', width: '80px', dataAlign: 'center' },
  { key: 'category', label: '总类别', width: '200px', dataAlign: 'left' },
  { key: 'subCategory', label: '子类别', width: '200px', dataAlign: 'left' },
  { key: 'itemName', label: '检查项', width: '300px', dataAlign: 'left' },
  { key: 'minScore', label: '最低分', width: '80px', dataAlign: 'right' },
  { key: 'maxScore', label: '最高分', width: '80px', dataAlign: 'right' },
  { key: 'minPassScore', label: '最低合格分', width: '100px', dataAlign: 'right' },
  { key: 'actualScore', label: '实际得分', width: '100px', dataAlign: 'right' },
  { key: 'result', label: '结果', width: '100px', dataAlign: 'center' },
  { key: 'categoryTotal', label: '类别总分', width: '100px', dataAlign: 'right' },
  { key: 'isRequired', label: '是否必评', width: '100px', dataAlign: 'center' },
  { key: 'remark', label: '备注', width: '150px', dataAlign: 'left' }
]

// B版预览列定义
const previewColumnsB = [
  { key: 'totalSeq', label: '序号', width: '80px', dataAlign: 'center' },
  { key: 'category', label: '总类别', width: '200px', dataAlign: 'left' },
  { key: 'subCategory', label: '子类别', width: '200px', dataAlign: 'left' },
  { key: 'itemName', label: '检查项', width: '300px', dataAlign: 'left' },
  { key: 'maxScore', label: '最高分', width: '80px', dataAlign: 'right' },
  { key: 'actualScore', label: '实际得分', width: '100px', dataAlign: 'right' },
  { key: 'categoryTotal', label: '类别总分', width: '100px', dataAlign: 'right' },
  { key: 'isRequired', label: '是否必评', width: '100px', dataAlign: 'center' },
  { key: 'remark', label: '备注', width: '150px', dataAlign: 'left' }
]

// 计算属性：A版扁平化数据（用于预览）
const flattenDataA = computed(() => {
  const result = []
  evaluationItemsA.value.forEach(category => {
    if (category.children) {
      // 计算类别总分
      const categoryTotal = category.children.reduce((sum, child) => {
        return sum + (child.actualScore || 0)
      }, 0)
      
      category.children.forEach((child, index) => {
        // 判断是否合格：实际得分 >= 最低合格分
        const isPass = child.actualScore >= child.minPassScore
        const resultText = isPass ? '合格' : '不合格'
        
        result.push({
          totalSeq: child.totalSeq,
          category: category.category,
          subCategory: category.subCategory,
          itemName: child.itemName,
          minScore: child.minScore,
          maxScore: child.maxScore,
          minPassScore: child.minPassScore,
          actualScore: child.actualScore,
          result: resultText,
          categoryTotal: index === 0 ? categoryTotal : '',
          isRequired: child.isRequired,
          remark: child.remark
        })
      })
    }
  })
  return result
})

// 计算属性：B版扁平化数据（用于预览）
const flattenDataB = computed(() => {
  const result = []
  evaluationItemsB.value.forEach(category => {
    if (category.children) {
      // 计算类别总分
      const categoryTotal = category.children.reduce((sum, child) => {
        return sum + (child.actualScore || 0)
      }, 0)
      
      category.children.forEach((child, index) => {
        result.push({
          totalSeq: child.totalSeq,
          category: category.category,
          subCategory: category.subCategory,
          itemName: child.itemName,
          maxScore: child.maxScore,
          actualScore: child.actualScore,
          categoryTotal: index === 0 ? categoryTotal : '',
          isRequired: child.isRequired,
          remark: child.remark
        })
      })
    }
  })
  return result
})

// 处理下载评价细则
const handleDownloadRule = () => {
  console.log('下载评价细则')
}

// 处理打印报表
const handlePrintReport = () => {
  console.log('打印评价表')
}
</script>

<template>
  <div class="supplier-evaluation-detail">
    <h1 class="page-title">供应商评价单详情</h1>

    <!-- 评价单基本信息 -->
    <MaximoSection title="评价单基本信息">
      <table class="tdtblw">
        <!-- 紧凑型三列布局：同一列内垂直堆叠多个字段 -->
        <MaximoSectionRow>
          <!-- 第一列：业务核心信息 -->
          <MaximoSectionCol>
            <MaximoTextbox v-model="formData.evalCode" label="评价单号" :readonly="true" width="250px" />
            <MaximoTextbox v-model="formData.supplier" label="供应商" :required="true" width="250px" />
            <MaximoTextbox v-model="formData.templateCode" label="模板编号" :required="true" width="250px" />
          </MaximoSectionCol>
          
          <!-- 第二列：分类与属性 -->
          <MaximoSectionCol>
            <MaximoTextbox v-model="formData.evalDate" label="评价日期" :required="true" width="250px" />
            <MaximoTextbox v-model="formData.evaluator" label="评价人员" :required="true" width="250px" />
            <MaximoTextbox v-model="formData.totalScore" label="总分" :readonly="true" width="250px" />
          </MaximoSectionCol>
          
          <!-- 第三列：人员与状态 -->
          <MaximoSectionCol>
            <MaximoTextbox v-model="formData.status" label="状态" :readonly="true" width="250px" />
            <MaximoTextbox v-model="formData.result" label="结果" :readonly="true" width="250px" />
            <MaximoTextbox v-model="formData.reviewer" label="审核人员" :readonly="true" width="250px" />
          </MaximoSectionCol>
        </MaximoSectionRow>
        
        <MaximoSectionRow>
          <MaximoSectionCol>
            <MaximoTextbox v-model="formData.scoringMethod" label="打分方式" :required="true" width="250px" />
          </MaximoSectionCol>
          <MaximoSectionCol>
            <MaximoAttachments label="附件" />
          </MaximoSectionCol>
          <MaximoSectionCol></MaximoSectionCol>
        </MaximoSectionRow>
      </table>

    </MaximoSection>

    <!-- 评价项目明细 -->
    <MaximoSection title="评价项目明细">
      <div style="margin-bottom: 16px; display: flex; gap: 12px;">
        <MaximoButton default @click="handleDownloadRule">查看评价细则文档</MaximoButton>
        <MaximoButton @click="handlePrintReport">报表：评价表打印</MaximoButton>
      </div>

      <!-- A版预览 -->
      <div v-if="formData.scoringMethod === 'A版'">
        <MaximoTable
          title="A版评价项目明细"
          :columns="previewColumnsA"
          :data="flattenDataA"
          :show-toolbar="true"
          :show-clear-filter-button="true"
          :show-filter-button="true"
          :show-download-button="true"
          :show-footer="false"
          :selectable="false"
          :show-action-column="false"
        />
      </div>

      <!-- B版预览 -->
      <div v-else-if="formData.scoringMethod === 'B版'">
        <MaximoTable
          title="B版评价项目明细"
          :columns="previewColumnsB"
          :data="flattenDataB"
          :show-toolbar="true"
          :show-clear-filter-button="true"
          :show-filter-button="true"
          :show-download-button="true"
          :show-footer="false"
          :selectable="false"
          :show-action-column="false"
        />
      </div>
    </MaximoSection>
  </div>
</template>

<style scoped>
.supplier-evaluation-detail {
  padding: 20px;
}

.page-title {
  color: #161616;
  font-size: 28px;
  margin-bottom: 30px;
  border-bottom: 2px solid #0F62FE;
  padding-bottom: 10px;
}

.mx-button:hover {
  opacity: 0.9;
}

.mx-primary:hover {
  background: #0353E9 !important;
  border-color: #0353E9 !important;
}

.mx-secondary:hover {
  background: #0F62FE !important;
  color: white !important;
}
</style>
