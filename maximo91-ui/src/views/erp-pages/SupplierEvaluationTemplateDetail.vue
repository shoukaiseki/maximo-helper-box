<script setup>
import { ref, computed } from 'vue'
import MaximoTextbox from '../components/MaximoTextbox.vue'
import MaximoTable from '../components/MaximoTable.vue'
import MaximoSection from '../components/MaximoSection.vue'
import MaximoSectionRow from '../components/MaximoSectionRow.vue'
import MaximoSectionCol from '../components/MaximoSectionCol.vue'
import MaximoAttachments from '../components/MaximoAttachments.vue'
import MaximoCheckbox from '../components/MaximoCheckbox.vue'
import MaximoTabs from '../components/MaximoTabs.vue'
import MaximoTab from '../components/MaximoTab.vue'

// 主表数据
const formData = ref({
  templateCode: 'SQA-001',       // 模板编号 (-)
  templateName: '供应商评价模板', // 模板名称 (*)
  supplierType: '零件',          // 供应商类型 (*)
  status: '草稿',                // 状态 (-)
  totalScore: 100,               // 总分 (*)
  passScore: 80,                 // 合格分 (*)
  version: '1',              // 版本号 (-)
  evaluationRule: '细则.pdf',    // 评价细则 (*)
  effectiveDate: '2026-04-01',   // 生效日期 (*)
  scoringMethod: 'A版',     // 打分方式 (*)
  createDate: '2026-03-20',      // 创建日期 (-)
  creator: 'Admin',               // 创建人 (-)
  enableStatus:  true,              // 启用状态 (-)
totalCategoryCache: 'QA ORGANIZATION 品質保証組織'      //虚拟字段
})

// 子表数据：A版主子表结构
const evaluationItemsA = ref([
  {
    id: 1,
    category: 'QA ORGANIZATION 品質保証組織',
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
        categorySeq: 1,
        itemSeq: 1,
        totalSeq: 1,
        parent: 1
      },
      {
        itemCode: 'SQA-I-002',
        itemName: '品質保証最高責任者は責務を遂行している。',
        minScore: 1,
        maxScore: 5,
        minPassScore: 4,
        isRequired: '是',
        categorySeq: 1,
        itemSeq: 2,
        totalSeq: 2,
        parent: 1
      }
    ]
  },
  {
    id: 2,
    category: 'QA ORGANIZATION 品質保証組織',
    subCategory: 'QA meeting（品質会議体）',
    categorySeq: 2,
    parent: null,
    children: [
      {
        itemCode: 'SQA-I-003',
        itemName: '会議体の種類、目的、運営要領が明確である。',
        minScore: 1,
        maxScore: 5,
        minPassScore: 3,
        isRequired: '是',
        categorySeq: 2,
        itemSeq: 1,
        totalSeq: 3,
        parent: 2
      },
      {
        itemCode: 'SQA-I-004',
        itemName: '各会議体は確実に運営され、必要事項のフォローがされている。',
        minScore: 1,
        maxScore: 5,
        minPassScore: 4,
        isRequired: '是',
        categorySeq: 2,
        itemSeq: 2,
        totalSeq: 4,
        parent: 2
      }
    ]
  }
])

// B版数据
const evaluationItemsB = ref([
  {
    id: 1,
    category: 'QA ORGANIZATION 品質保証組織',
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
        categorySeq: 1,
        itemSeq: 1,
        totalSeq: 1,
        parent: 1
      },
      {
        itemCode: 'SQA-I-002',
        itemName: '品質保証最高責任者は責務を遂行している。',
        maxScore: 5,
        isRequired: '是',
        categorySeq: 1,
        itemSeq: 2,
        totalSeq: 2,
        parent: 1
      }
    ]
  },
  {
    id: 2,
    category: 'QA ORGANIZATION 品質保証組織',
    subCategory: 'QA meeting（品質会議体）',
    categorySeq: 2,
    maxScore: 10,
    parent: null,
    children: [
      {
        itemCode: 'SQA-I-003',
        itemName: '会議体の種類、目的、運営要領が明確である。',
        maxScore: 5,
        isRequired: '是',
        categorySeq: 2,
        itemSeq: 1,
        totalSeq: 3,
        parent: 2
      },
      {
        itemCode: 'SQA-I-004',
        itemName: '各会議体は確実に運営され、必要事項のフォローがされている。',
        maxScore: 5,
        isRequired: '是',
        categorySeq: 2,
        itemSeq: 2,
        totalSeq: 4,
        parent: 2
      }
    ]
  }
])

// 标签页切换
const activeTab = ref('a-edit')

// A版预览列定义（扁平化显示所有检查项）
const previewColumnsA = [
  { key: 'totalSeq', label: '序号', width: '80px', dataAlign: 'center' },
  { key: 'category', label: '总类别', width: '200px', dataAlign: 'left' },
  { key: 'subCategory', label: '子类别', width: '200px', dataAlign: 'left' },
  { key: 'itemName', label: '检查项', width: '300px', dataAlign: 'left' },
  { key: 'minScore', label: '最低分', width: '80px', dataAlign: 'right' },
  { key: 'maxScore', label: '最高分', width: '80px', dataAlign: 'right' },
  { key: 'minPassScore', label: '最低合格分', width: '100px', dataAlign: 'right' },
  { key: 'isRequired', label: '是否必评', width: '100px', dataAlign: 'center' }
]

// B版预览列定义
const previewColumnsB = [
  { key: 'totalSeq', label: '序号', width: '80px', dataAlign: 'center' },
  { key: 'category', label: '总类别', width: '200px', dataAlign: 'left' },
  { key: 'subCategory', label: '子类别', width: '200px', dataAlign: 'left' },
  { key: 'itemName', label: '检查项', width: '300px', dataAlign: 'left' },
  { key: 'maxScore', label: '最高分', width: '80px', dataAlign: 'right' },
  { key: 'isRequired', label: '是否必评', width: '100px', dataAlign: 'center' }
]

// A版填写列定义（主子表）
const editColumnsA = [
  { key: 'categorySeq', label: '类别序号', width: '100px', dataAlign: 'center' },
  { key: 'category', label: '总类别', width: '200px', dataAlign: 'left' },
  { key: 'subCategory', label: '子类别', width: '200px', dataAlign: 'left' },
]

// A版子表列定义
const childColumnsA = [
  { key: 'itemSeq', label: '检查项序号', width: '120px', dataAlign: 'center' },
  { key: 'itemCode', label: '项目编号', width: '120px', dataAlign: 'left' },
  { key: 'itemName', label: '检查项', width: '300px', dataAlign: 'left' },
  { key: 'minScore', label: '最低分', width: '80px', dataAlign: 'right' },
  { key: 'maxScore', label: '最高分', width: '80px', dataAlign: 'right' },
  { key: 'minPassScore', label: '最低合格分', width: '100px', dataAlign: 'right' },
  { key: 'isRequired', label: '是否必评', width: '100px', dataAlign: 'center' }
]

// B版填写列定义
const editColumnsB = [
  { key: 'categorySeq', label: '类别序号', width: '100px', dataAlign: 'center' },
  { key: 'category', label: '总类别', width: '200px', dataAlign: 'left' },
  { key: 'subCategory', label: '子类别', width: '200px', dataAlign: 'left' },
  { key: 'maxScore', label: '最高分', width: '80px', dataAlign: 'right' },
//   { key: 'actions', label: '操作', width: '100px', dataAlign: 'center' }
]

// B版子表列定义
const childColumnsB = [
  { key: 'itemSeq', label: '检查项序号', width: '120px', dataAlign: 'center' },
  { key: 'itemCode', label: '项目编号', width: '120px', dataAlign: 'left' },
  { key: 'itemName', label: '检查项', width: '300px', dataAlign: 'left' },
  { key: 'maxScore', label: '最高分', width: '80px', dataAlign: 'right' },
  { key: 'isRequired', label: '是否必评', width: '100px', dataAlign: 'center' }
]

// 工具栏按钮配置
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
    console.log('新增操作')
  }
}

// 处理行内操作
const handleRowAction = ({ action, rowIndex }) => {
  if (action.title === '删除') {
    console.log('删除操作', rowIndex)
  }
}

// 计算属性：A版扁平化数据（用于预览）
const flattenDataA = computed(() => {
  const result = []
  evaluationItemsA.value.forEach(category => {
    if (category.children) {
      category.children.forEach(child => {
        result.push({
          totalSeq: child.totalSeq,
          category: category.category,
          subCategory: category.subCategory,
          itemName: child.itemName,
          minScore: child.minScore,
          maxScore: child.maxScore,
          minPassScore: child.minPassScore,
          isRequired: child.isRequired
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
      category.children.forEach(child => {
        result.push({
          totalSeq: child.totalSeq,
          category: category.category,
          subCategory: category.subCategory,
          itemName: child.itemName,
          maxScore: child.maxScore,
          isRequired: child.isRequired
        })
      })
    }
  })
  return result
})
</script>

<template>
  <div class="supplier-evaluation-template-detail">
    <h1 class="page-title">供应商评价模板详情</h1>

    <!-- 模板基本信息 -->
    <MaximoSection title="模板基本信息">
      <table class="tdtblw">
        <!-- 紧凑型三列布局：同一列内垂直堆叠多个字段 -->
        <MaximoSectionRow>
          <!-- 第一列：业务核心信息 -->
          <MaximoSectionCol>
            <MaximoTextbox v-model="formData.templateCode" label="模板编号" :readonly="true" />
            <MaximoTextbox v-model="formData.templateName" label="模板名称" :required="true" />
            <MaximoTextbox v-model="formData.evaluationRule" label="评价细则" :required="true" />
            <MaximoTextbox v-model="formData.totalScore" label="总分" :required="true" />
            <MaximoTextbox v-model="formData.scoringMethod" label="打分方式" :required="true" />
          </MaximoSectionCol>
          
          <!-- 第二列：分类与属性 -->
          <MaximoSectionCol>
            <MaximoCheckbox v-model="formData.enableStatus" label="是否启用" />
            <MaximoTextbox v-model="formData.effectiveDate" label="生效日期" :required="true" />
            <MaximoTextbox v-model="formData.supplierType" label="供应商类型" :required="true" />
            <MaximoTextbox v-model="formData.passScore" label="合格分" :required="true" />
          </MaximoSectionCol>
          
          <!-- 第三列：人员与状态 -->
          <MaximoSectionCol>
            <MaximoTextbox v-model="formData.status" label="状态" :readonly="true" />
            <MaximoTextbox v-model="formData.version" label="版本号" :readonly="true" />
            <MaximoTextbox v-model="formData.createDate" label="创建日期" :readonly="true" />
            <MaximoTextbox v-model="formData.creator" label="创建人" :readonly="true" />
            <MaximoAttachments label="附件" />
          </MaximoSectionCol>
        </MaximoSectionRow>
      </table>
    </MaximoSection>

    <!-- 评价项目明细 -->
    <MaximoSection title="评价项目明细">
      <MaximoTabs v-model="activeTab">
        <!-- 标签页按钮 -->
        <MaximoTab name="a-preview" label="A版预览"  v-if="formData.scoringMethod =='A版'"/>
        <MaximoTab name="a-edit" label="A版填写"  v-if="formData.scoringMethod =='A版'"/>
        <MaximoTab name="b-preview" label="B版预览"  v-if="formData.scoringMethod =='B版'"/>
        <MaximoTab name="b-edit" label="B版填写"  v-if="formData.scoringMethod =='B版'"/>

        <!-- 标签页内容 -->
        <template #content>
          <!-- A版预览 -->
          <div v-show="activeTab === 'a-preview'">
            <MaximoTable
              title="A版预览"
              :columns="previewColumnsA"
              :data="flattenDataA"
              :show-toolbar="false"
              :show-footer="false"
              :selectable="false"
              :show-action-column="false"
            />
          </div>

          <!-- A版填写 -->
          <div v-show="activeTab === 'a-edit'">
            <MaximoSection>
                <MaximoSectionRow>
                    <MaximoSectionCol width="33%">
            <MaximoTextbox label="总类别缓存" v-model="formData.totalCategoryCache" width="250px"/>
                  </MaximoSectionCol>
                    <MaximoSectionCol width="67%" valign="middle">
                        填写后新建类别时,总类别会默认插入该值
                    </MaximoSectionCol>
                </MaximoSectionRow>
            </MaximoSection>
            <div v-for="category in evaluationItemsA" :key="category.id" class="category-group">
              <!-- 主表：类别信息 -->
              <MaximoTable
                title="类别"
                :columns="editColumnsA"
                :data="[category]"
                :show-toolbar="true"
                :show-footer="false"
                :selectable="false"
                :toolbar-actions-before="toolbarActions"
                :show-action-column="true"
                :row-actions="rowActions"
                @toolbar-action="handleToolbarAction"
                @row-action="handleRowAction"
              />
              
              <!-- 子表：检查项明细 -->
                <MaximoTable
                  :title="`检查项明细 (${category.subCategory})`"
                  :columns="childColumnsA"
                  :data="category.children"
                  :show-toolbar="true"
                  :show-footer="false"
                  :selectable="false"
                  :toolbar-actions-before="[{ title: '新增', icon: '/images/nav_icon_insert.gif' }]"
                  :show-action-column="true"
                  :row-actions="[{ title: '删除', icon: '/images/btn_garbage.gif' }]"
                />
            </div>
          </div>

          <!-- B版预览 -->
          <div v-show="activeTab === 'b-preview'">
            <MaximoTable
              title="B版预览"
              :columns="previewColumnsB"
              :data="flattenDataB"
              :show-toolbar="false"
              :show-footer="false"
              :selectable="false"
              :show-action-column="false"
            />
          </div>

          <!-- B版填写 -->
          <div v-show="activeTab === 'b-edit'">
            <MaximoSection>
                <MaximoSectionRow>
                    <MaximoSectionCol width="33%">
            <MaximoTextbox label="总类别缓存" v-model="formData.totalCategoryCache" width="250px"/>
                  </MaximoSectionCol>
                    <MaximoSectionCol width="67%" valign="middle">
                        填写后新建类别时,总类别会默认插入该值
                    </MaximoSectionCol>
                </MaximoSectionRow>
            </MaximoSection>
            <div v-for="category in evaluationItemsB" :key="category.id" class="category-group">
              <!-- 主表：类别信息 -->
              <MaximoTable
                title="类别"
                :columns="editColumnsB"
                :data="[category]"
                :show-toolbar="true"
                :show-footer="false"
                :selectable="false"
                :toolbar-actions-before="toolbarActions"
                :show-action-column="true"
                :row-actions="rowActions"
                @toolbar-action="handleToolbarAction"
                @row-action="handleRowAction"
              />
              
              <!-- 子表：检查项明细 -->
                <MaximoTable
                  :title="`检查项明细 (${category.subCategory})`"
                  :columns="childColumnsB"
                  :data="category.children"
                  :show-toolbar="true"
                  :show-footer="false"
                  :selectable="false"
                  :toolbar-actions-before="[{ title: '新增', icon: '/images/nav_icon_insert.gif' }]"
                  :show-action-column="true"
                  :row-actions="[{ title: '删除', icon: '/images/btn_garbage.gif' }]"
                />
            </div>
          </div>
        </template>
      </MaximoTabs>
    </MaximoSection>
  </div>
</template>

<style scoped>
.supplier-evaluation-template-detail {
  padding: 20px;
}

.page-title {
  color: #161616;
  font-size: 28px;
  margin-bottom: 30px;
  border-bottom: 2px solid #0F62FE;
  padding-bottom: 10px;
}

/* 类别分组样式 */
.category-group {
  margin-bottom: 20px;
}

/* 子表包装器样式 */
.child-table-wrapper {
  margin-left: 20px;
  margin-bottom: 15px;
  padding: 12px;
  background-color: #f9f9f9;
  border-left: 3px solid #0F62FE;
}

/* 标签页内容区域 */
:deep(.tab-content-container) {
  min-height: 400px;
}
</style>
