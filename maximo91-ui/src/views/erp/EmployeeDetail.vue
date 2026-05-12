<script setup>
import { ref } from 'vue'
import MaximoTextbox from '../../components/MaximoTextbox.vue'
import MaximoMultilineTextbox from '../../components/MaximoMultilineTextbox.vue'
import MaximoMultipartTextbox from '../../components/MaximoMultipartTextbox.vue'
import MaximoTable from '../../components/MaximoTable.vue'
import MaximoTableDetail from '../../components/MaximoTableDetail.vue'
import MaximoSection from '../../components/MaximoSection.vue'
import MaximoSectionRow from '../../components/MaximoSectionRow.vue'
import MaximoSectionCol from '../../components/MaximoSectionCol.vue'
import MaximoTabs from '../../components/MaximoTabs.vue'
import MaximoTab from '../../components/MaximoTab.vue'
import MaximoButton from '../../components/MaximoButton.vue'
import MaximoButtonGroup from '../../components/MaximoButtonGroup.vue'
import MaximoLabel from '../../components/MaximoLabel.vue'
import MaximoCheckbox from '../../components/MaximoCheckbox.vue'
import MaximoAttachments from '../../components/MaximoAttachments.vue'

// 主表数据
const formData = ref({
  employeeId: 'EMP001',
  name: '张三',
  department: '采购部',
  position: '采购经理',
  phone: '13800138001',
  email: 'zhangsan@company.com',
  hireDate: '2020-03-15',
  status: '在职',
  gender: '男',
  idCard: '110101199001011234',
  address: '北京市朝阳区建国路100号',
  emergencyContact: '李四',
  emergencyPhone: '13900139001',
  education: '本科',
  major: '工商管理',
  bankName: '中国工商银行',
  bankAccount: '6222021234567890123',
  socialSecurity: '已缴纳',
  housingFund: '已缴纳',
  remark: '优秀员工，多次获得表彰'
})

//  multipart 数据（用于多部分文本框）
const addressParts = ref({
  province: '北京市',
  city: '朝阳区',
  street: '建国路100号',
  zipCode: '100020'
})

// 子表1：培训记录
const trainingColumns = [
  { key: 'trainingDate', label: '培训日期', width: '120px', align: 'center', dataAlign: 'center' },
  { key: 'trainingName', label: '培训课程', width: '250px', align: 'center', dataAlign: 'left' },
  { key: 'trainer', label: '培训机构', width: '200px', align: 'center', dataAlign: 'left' },
  { key: 'duration', label: '时长(小时)', width: '100px', align: 'center', dataAlign: 'right' },
  { key: 'score', label: '成绩', width: '80px', align: 'center', dataAlign: 'right' },
  { key: 'certificate', label: '证书', width: '100px', align: 'center', dataAlign: 'center' }
]

const trainingData = ref([
  { trainingDate: '2024-05-10', trainingName: '供应链管理高级课程', trainer: '清华大学继续教育学院', duration: 40, score: 95, certificate: '已获得' },
  { trainingDate: '2024-08-15', trainingName: '采购谈判技巧', trainer: '北京大学商学院', duration: 24, score: 92, certificate: '已获得' },
  { trainingDate: '2025-03-20', trainingName: 'ERP系统操作培训', trainer: '公司内部培训', duration: 16, score: 98, certificate: '已获得' }
])

// 子表2：绩效考核
const performanceColumns = [
  { key: 'year', label: '年度', width: '100px', align: 'center', dataAlign: 'center' },
  { key: 'quarter', label: '季度', width: '80px', align: 'center', dataAlign: 'center' },
  { key: 'kpi1', label: '工作质量', width: '100px', align: 'center', dataAlign: 'right' },
  { key: 'kpi2', label: '工作效率', width: '100px', align: 'center', dataAlign: 'right' },
  { key: 'kpi3', label: '团队合作', width: '100px', align: 'center', dataAlign: 'right' },
  { key: 'totalScore', label: '总分', width: '100px', align: 'center', dataAlign: 'right' },
  { key: 'rating', label: '等级', width: '80px', align: 'center', dataAlign: 'center' },
  { key: 'evaluator', label: '评估人', width: '100px', align: 'center', dataAlign: 'left' }
]

const performanceData = ref([
  { year: 2024, quarter: 'Q1', kpi1: 95, kpi2: 92, kpi3: 90, totalScore: 92.3, rating: 'A', evaluator: '王总监' },
  { year: 2024, quarter: 'Q2', kpi1: 93, kpi2: 94, kpi3: 91, totalScore: 92.7, rating: 'A', evaluator: '王总监' },
  { year: 2024, quarter: 'Q3', kpi1: 96, kpi2: 93, kpi3: 92, totalScore: 93.7, rating: 'A', evaluator: '王总监' },
  { year: 2024, quarter: 'Q4', kpi1: 94, kpi2: 95, kpi3: 93, totalScore: 94.0, rating: 'A', evaluator: '王总监' }
])

// 子表3：奖惩记录
const rewardColumns = [
  { key: 'date', label: '日期', width: '120px', align: 'center', dataAlign: 'center' },
  { key: 'type', label: '类型', width: '80px', align: 'center', dataAlign: 'center' },
  { key: 'title', label: '标题', width: '250px', align: 'center', dataAlign: 'left' },
  { key: 'description', label: '说明', width: '300px', align: 'center', dataAlign: 'left' },
  { key: 'amount', label: '金额(CNY)', width: '120px', align: 'center', dataAlign: 'right' }
]

const rewardData = ref([
  { date: '2024-06-30', type: '奖励', title: '优秀员工奖', description: '上半年表现突出，超额完成采购任务', amount: 5000.00 },
  { date: '2024-12-31', type: '奖励', title: '年度优秀员工', description: '全年绩效优异，为公司节约采购成本50万元', amount: 10000.00 },
  { date: '2025-03-15', type: '奖励', title: '创新提案奖', description: '提出供应商评估优化方案，被公司采纳', amount: 3000.00 }
])

// 附件列表
const attachments = ref([
  { name: '身份证扫描件.pdf', size: '1.5MB', uploadDate: '2020-03-15' },
  { name: '学历证书.pdf', size: '2.3MB', uploadDate: '2020-03-15' },
  { name: '个人简历.pdf', size: '0.8MB', uploadDate: '2020-03-15' },
  { name: '资格证书.pdf', size: '1.2MB', uploadDate: '2024-05-10' }
])

// 当前激活的标签页
const activeTab = ref('basic')

// 工具栏按钮配置
const toolbarActions = [
  { title: '保存', icon: '/images/nav_icon_save.gif' },
  { title: '提交', icon: '/images/btn_submit_editreq.gif' },
  { title: '取消', icon: '/images/btn_cancelchanges.gif' }
]

const handleToolbarAction = ({ action }) => {
  console.log('操作:', action.title)
}

// 按钮组操作
const handleButtonGroupAction = (action) => {
  console.log('按钮组操作:', action)
}

// 按钮组配置
const buttonGroupActions = [
  { label: '打印', type: 'secondary', icon: '🖨️' },
  { label: '导出', type: 'secondary', icon: '📤' },
  { label: '分享', type: 'secondary', icon: '🔗' }
]
</script>

<template>
  <div class="employee-detail">
    <h1 class="page-title">员工详情</h1>

    <!-- 顶部按钮组 -->
    <div style="margin-bottom: 20px;">
      <MaximoButtonGroup :actions="buttonGroupActions" @action="handleButtonGroupAction" />
    </div>

    <!-- 多标签页 -->
    <MaximoTabs v-model="activeTab">
      <MaximoTab name="basic" label="基本信息" />
      <MaximoTab name="training" label="培训记录" />
      <MaximoTab name="performance" label="绩效考核" />
      <MaximoTab name="reward" label="奖惩记录" />
      
      <template #content>
        <!-- 基本信息标签 -->
        <div v-if="activeTab === 'basic'">
          <MaximoSection title="个人信息">
          <MaximoSectionRow>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.employeeId" label="员工编号" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.name" label="姓名" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.gender" label="性别" readonly />
            </MaximoSectionCol>
          </MaximoSectionRow>
          <MaximoSectionRow>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.idCard" label="身份证号" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.hireDate" label="入职日期" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.status" label="状态" readonly />
            </MaximoSectionCol>
          </MaximoSectionRow>
          <MaximoSectionRow>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.department" label="部门" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.position" label="职位" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.phone" label="电话" readonly />
            </MaximoSectionCol>
          </MaximoSectionRow>
          <MaximoSectionRow>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.email" label="邮箱" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.education" label="学历" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="8">
              <MaximoTextbox v-model="formData.major" label="专业" readonly />
            </MaximoSectionCol>
          </MaximoSectionRow>
        </MaximoSection>

        <MaximoSection title="联系信息">
          <MaximoSectionRow>
            <MaximoSectionCol :span="24">
              <MaximoMultipartTextbox 
                v-model="addressParts" 
                label="地址" 
                :parts="[
                  { key: 'province', label: '省/市', width: '20%' },
                  { key: 'city', label: '区/县', width: '20%' },
                  { key: 'street', label: '街道门牌', width: '40%' },
                  { key: 'zipCode', label: '邮编', width: '20%' }
                ]"
                readonly 
              />
            </MaximoSectionCol>
          </MaximoSectionRow>
          <MaximoSectionRow>
            <MaximoSectionCol :span="12">
              <MaximoTextbox v-model="formData.emergencyContact" label="紧急联系人" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="12">
              <MaximoTextbox v-model="formData.emergencyPhone" label="紧急联系电话" readonly />
            </MaximoSectionCol>
          </MaximoSectionRow>
        </MaximoSection>

        <MaximoSection title="财务信息">
          <MaximoSectionRow>
            <MaximoSectionCol :span="12">
              <MaximoTextbox v-model="formData.bankName" label="开户银行" readonly />
            </MaximoSectionCol>
            <MaximoSectionCol :span="12">
              <MaximoTextbox v-model="formData.bankAccount" label="银行账号" readonly />
            </MaximoSectionCol>
          </MaximoSectionRow>
          <MaximoSectionRow>
            <MaximoSectionCol :span="12">
              <MaximoCheckbox v-model="formData.socialSecurity" label="社保" disabled />
            </MaximoSectionCol>
            <MaximoSectionCol :span="12">
              <MaximoCheckbox v-model="formData.housingFund" label="公积金" disabled />
            </MaximoSectionCol>
          </MaximoSectionRow>
        </MaximoSection>

        <MaximoSection title="备注">
          <MaximoSectionRow>
            <MaximoSectionCol :span="24">
              <MaximoMultilineTextbox v-model="formData.remark" label="备注信息" :rows="3" readonly />
            </MaximoSectionCol>
          </MaximoSectionRow>
        </MaximoSection>

          <!-- 附件 -->
          <MaximoSection title="附件">
            <MaximoAttachments :attachments="attachments" />
          </MaximoSection>
        </div>

        <!-- 培训记录标签 -->
        <div v-if="activeTab === 'training'">
          <MaximoSection title="培训记录">
          <MaximoTable
            :columns="trainingColumns"
            :data="trainingData"
            :show-toolbar="true"
            :show-footer="true"
            :toolbar-actions-before="toolbarActions"
            @toolbar-action="handleToolbarAction"
          />
        </MaximoSection>
        </div>

        <!-- 绩效考核标签 -->
        <div v-if="activeTab === 'performance'">
          <MaximoSection title="绩效考核记录">
          <MaximoTable
            :columns="performanceColumns"
            :data="performanceData"
            :show-toolbar="false"
            :show-footer="true"
          />
        </MaximoSection>
        </div>

        <!-- 奖惩记录标签 -->
        <div v-if="activeTab === 'reward'">
          <MaximoSection title="奖惩记录">
          <MaximoTable
            :columns="rewardColumns"
            :data="rewardData"
            :show-toolbar="true"
            :show-footer="true"
            :toolbar-actions-before="toolbarActions"
            @toolbar-action="handleToolbarAction"
          />
        </MaximoSection>
        </div>
      </template>
    </MaximoTabs>
  </div>
</template>

<style scoped>
.employee-detail {
  padding: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}
</style>
