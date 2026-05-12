<script setup>
import { ref } from 'vue'
import MaximoTable from '../components/MaximoTable.vue'
import MaximoTextbox from '../components/MaximoTextbox.vue'
import MaximoMultilineTextbox from '../components/MaximoMultilineTextbox.vue'
import MaximoMultipartTextbox from '../components/MaximoMultipartTextbox.vue'
import MaximoSection from '../components/MaximoSection.vue'
import MaximoSectionRow from '../components/MaximoSectionRow.vue'
import MaximoSectionCol from '../components/MaximoSectionCol.vue'
import MaximoAttachments from '../components/MaximoAttachments.vue'

// 定义表格列配置
const tableColumns = [
  { key: 'select', label: '', width: '50px' },
  { key: 'name', label: 'Name', width: '180px' },
  { key: 'description', label: 'Description', width: '300px' },
  { key: 'defaultApp', label: 'Default Application' },
  { key: 'independent', label: 'Independent of Other Groups?', width: '200px' },
  { key: 'actions', label: '', width: '50px' }
]

// 定义测试数据
const tableData = ref([
  {
    select: '',
    name: 'MAXADMIN',
    description: 'Maximo Administrators (Super Users)',
    defaultApp: 'Maximo Administrators (Super Users)',
    independent: true,
    actions: ''
  },
  {
    select: '',
    name: 'MAXEVERYONE',
    description: 'All Maximo Users',
    defaultApp: 'All Maximo Users',
    independent: false,
    actions: ''
  },
  {
    select: '',
    name: 'MXINTADMIN',
    description: 'Integration Administrators',
    defaultApp: 'Integration Administrators',
    independent: true,
    actions: ''
  },
  {
    select: '',
    name: 'DESKTOP',
    description: 'Desktop Users',
    defaultApp: 'Desktop Users',
    independent: false,
    actions: ''
  },
  {
    select: '',
    name: 'SECURITY',
    description: 'Security Group',
    defaultApp: 'Security Group',
    independent: false,
    actions: ''
  }
])

// 当前选中的行索引，默认为0（第一行）
const selectedRowIndex = ref(0)

// 工具栏按钮配置
const toolbarActions = ref([
  {
    title: 'New Row',
    icon: '/images/nav_icon_insertkey.gif',
    action: 'new-row'
  },
  {
    title: 'Clear Filter',
    icon: '/images/qf_clear_disabled.gif',
    disabled: true,
    action: 'clear-filter'
  },
  {
    title: 'Open Filter CTRL+Z',
    icon: '/images/tablebtn_filter_off.gif',
    action: 'open-filter'
  },
  {
    title: 'Download',
    icon: '/images/tablebtn_download.gif',
    action: 'download'
  },
  {
    title: 'Hide Table',
    icon: '/images/minimize.gif',
    action: 'hide-table'
  }
])

// 主要操作按钮
const primaryAction = ref({
  label: 'Select Groups',
  action: 'select-groups'
})

// 处理行点击事件
const handleRowClick = ({ rowIndex, row }) => {
  console.log('点击了行:', rowIndex, row)
}

// 处理工具栏按钮点击
const handleToolbarAction = ({ action, index }) => {
  console.log('工具栏按钮点击:', action, index)
}

// 处理主要操作按钮点击
const handlePrimaryAction = () => {
  console.log('主要操作按钮点击')
}

// 处理分页变化
const handlePageChange = (page) => {
  console.log('分页变化:', page)
}

// 表单数据
const textboxValue = ref('TYPE 1')
const readonlyTextboxValue = ref('MAXADMIN')
const multilineValue = ref('')
const readonlyMultilineValue = ref('MAXADMIN')
const multipartValue = ref({ first: 'TYPE 1', second: '' })
const readonlyMultipartValue = ref({ first: 'MAXADMIN', second: 'MAXADMIN' })

// 附件组件事件处理
const handleAttachmentsView = () => {
  console.log('查看附件按钮点击')
}

const handleAttachmentsDropdown = () => {
  console.log('附件下拉按钮点击')
}
</script>

<template>
  <div class="components-demo">
      <h1 class="page-title">Maximo Vue Components Demo</h1>

      <!-- Section 1: 单行文本框 -->
    <div class="demo-section">
      <h2>单行文本框 (Textbox)</h2>
      <p class="description">包含必填、常规、只读、日期、时间等类型</p>
        <MaximoSection title="部分(section)标题">

            <div class="form-group">
                <MaximoTextbox
                    v-model="textboxValue"
                    label="单行文本框(textbox)必填"
                    :required="true"
                    :show-icon="true"
                    icon-src="/images/img_lookup.gif"
                    icon-alt="Lookup"
                />

                <MaximoTextbox
                    v-model="textboxValue"
                    label="单行文本框(textbox)常规"
                    :show-icon="true"
                    icon-src="/images/img_lookup.gif"
                    icon-alt="Lookup"
                />

                <MaximoTextbox
                    v-model="readonlyTextboxValue"
                    label="单行文本框(textbox)只读"
                    :readonly="true"
                    :show-icon="true"
                    icon-src="/images/img_menu.gif"
                    icon-alt="Menu"
                />

                <MaximoTextbox
                    v-model="textboxValue"
                    label="单行文本框(textbox)日期"
                    input-type="date"
                    :show-icon="true"
                    icon-src="/images/img_date.gif"
                    icon-alt="Date"
                />

                <MaximoTextbox
                    v-model="textboxValue"
                    label="单行文本框(textbox)时间"
                    input-type="time"
                    :show-icon="true"
                    icon-src="/images/img_date_time.gif"
                    icon-alt="DateTime"
                />
            </div>
        </MaximoSection>
    </div>

    <!-- Section 2: 多部分文本框 -->
    <div class="demo-section">
      <h2>多部分文本框 (Multipart Textbox)</h2>
      <p class="description">支持两个输入框组合</p>

      <div class="form-group">
        <MaximoMultipartTextbox
          v-model="multipartValue"
          label="多部分文本框(multiparttextbox)常规"
          :required="true"
        />

        <MaximoMultipartTextbox
          v-model="readonlyMultipartValue"
          label="多部分文本框(multiparttextbox)只读"
          :readonly="true"
        />

        <MaximoMultipartTextbox
          v-model="multipartValue"
          label="多部分文本框(multiparttextbox)必填"
          :required="true"
        />
      </div>
    </div>

    <!-- Section 3: 多行文本框 -->
    <div class="demo-section">
      <h2>多行文本框 (Multiline Textbox)</h2>
      <p class="description">支持多行文本输入</p>

      <div class="form-group">
        <MaximoMultilineTextbox
          v-model="multilineValue"
          label="多行文本框(multilinetextbox)常规"
        />

        <MaximoMultilineTextbox
          v-model="readonlyMultilineValue"
          label="多行文本框(multilinetextbox)只读"
          :readonly="true"
        />

        <MaximoMultilineTextbox
          v-model="multilineValue"
          label="多行文本框(multilinetextbox)必填"
          :required="true"
        />
      </div>
    </div>

    <!-- Section 3.5: 附件组件 -->
    <div class="demo-section">
      <h2>附件组件 (Attachments)</h2>
      <p class="description">用于查看和管理附件文件</p>

      <div class="form-group">
        <MaximoAttachments
          label="附件"
          @view-click="handleAttachmentsView"
          @dropdown-click="handleAttachmentsDropdown"
        />

        <MaximoAttachments
          label="附件(必填)"
          :required="true"
          @view-click="handleAttachmentsView"
          @dropdown-click="handleAttachmentsDropdown"
        />

        <MaximoAttachments
          label="附件(禁用)"
          :disabled="true"
          @view-click="handleAttachmentsView"
          @dropdown-click="handleAttachmentsDropdown"
        />
      </div>
    </div>

    <!-- Section 4: 部分组件演示（使用 Row 和 Col） -->
    <MaximoSection title="部分(section)标题 - 使用Row和Col">
      <table class="tdtblw">
        <!-- 行 1: 单行文本框必填 -->
        <MaximoSectionRow>
          <MaximoSectionCol :label="true" :required="true">
            单行文本框(textbox)必填
          </MaximoSectionCol>
          <MaximoSectionCol>
            <input class="fld text fld_req" v-model="textboxValue" style="width:16.1ch; height: 40px;">
            <div style="display:inline-block; width: 40px; height: 40px; background: #FFFFFF; border: 1px solid #c6c6c6; margin-left: 4px; vertical-align: middle;">
              <img src="/images/img_lookup.gif" style="width: 40px; height: 40px; margin: 0px; display:block;">
            </div>
          </MaximoSectionCol>
        </MaximoSectionRow>

        <!-- 行 2: 多部分文本框 -->
        <MaximoSectionRow>
          <MaximoSectionCol :label="true" :required="true">
            多部分文本框(multiparttextbox)常规
          </MaximoSectionCol>
          <MaximoSectionCol>
            <input class="fld text fld_req" v-model="multipartValue.first" style="width:16.1ch; height: 40px;">
            <img src="/images/blank.gif" style="width: 4px; height: 40px; margin: 0px; display:inline; vertical-align: middle;">
            <input class="fld text fld_req" v-model="multipartValue.second" style="width:16.1ch; height: 40px;">
            <img src="/images/blank.gif" style="width: 4px; height: 40px; margin: 0px; display:inline; vertical-align: middle;">
          </MaximoSectionCol>
        </MaximoSectionRow>
      </table>
    </MaximoSection>

    <!-- Section 5: 无标题部分 -->
    <MaximoSection :no-title="true">
        这是一个无标题的部分
    </MaximoSection>

    <!-- Section 6: 表格 -->
    <div class="demo-section">
      <h2>TESTUSER 表格演示（带工具栏）</h2>
      <p class="description">
        点击表格行进行选择。选中行会显示蓝色左边框和灰色背景。
        默认第一行被选中，点击其他行后，之前选中的行会恢复普通样式。
      </p>

      <MaximoTable
        v-model="selectedRowIndex"
        :columns="tableColumns"
        :data="tableData"
        title="表格(table)"
        :total-records="5"
        :current-page="1"
        :page-size="5"
        :toolbar-actions="toolbarActions"
        :primary-action="primaryAction"
        @row-click="handleRowClick"
        @toolbar-action="handleToolbarAction"
        @primary-action="handlePrimaryAction"
        @page-change="handlePageChange"
      />

      <div class="selection-info" v-if="selectedRowIndex !== null">
        <strong>当前选中行索引：</strong>{{ selectedRowIndex }}<br>
        <strong>选中数据：</strong>{{ JSON.stringify(tableData[selectedRowIndex], null, 2) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.components-demo {
  padding: 20px;
}

.page-title {
  color: #161616;
  font-size: 28px;
  margin-bottom: 30px;
  border-bottom: 2px solid #0F62FE;
  padding-bottom: 10px;
}

.demo-section {
  background: white;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.demo-section h2 {
  color: #333;
  font-size: 20px;
  margin-bottom: 10px;
  margin-top: 0;
}

.description {
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
  line-height: 1.6;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.form-group :deep(.textbox-label) {
  text-align: right;
  justify-content: flex-end;
}

.form-group :deep(.textbox-input-wrapper) {
  justify-content: flex-start;
}

.selection-info {
  margin-top: 20px;
  padding: 15px;
  background-color: #F5F5F5;
  border-left: 3px solid #0F62FE;
  border-radius: 4px;
  font-size: 13px;
  line-height: 1.8;
}

.selection-info strong {
  color: #161616;
}
</style>
