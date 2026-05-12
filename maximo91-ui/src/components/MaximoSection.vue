<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  // 如果为true，则不显示标题栏，只显示背景
  noTitle: {
    type: Boolean,
    default: false
  }
})

const slots = defineSlots()
</script>

<template>
  <div class="maximo-section">
    <!-- 有标题的情况 -->
    <div v-if="!noTitle && title" class="section-with-title">
      <table class="so so-wide">
        <tr>
          <td class="hbouter">
            <h2>
              <label class="text st">{{ title }}</label>
            </h2>
          </td>
        </tr>
        <tr>
          <td class="section sectionb">
            <table class="tdtblw">
              <slot></slot>
            </table>
          </td>
        </tr>
      </table>
    </div>
    
    <!-- 无标题的情况，只显示背景色 -->
    <div v-else class="section-no-title">
      <table class="tdtblw">
        <slot></slot>
      </table>
    </div>
  </div>
</template>

<style scoped>
.maximo-section {
  margin-bottom: 20px;
}

.section-with-title {
  background: white;
}

.section-no-title {
  background: #f1f1f1;
  padding: 0;
}

.so {
  width: 100%;
  border-collapse: collapse;
}

.hbouter {
  padding: 8px 12px;
  background: #ffffff;
  border-bottom: 1px solid #e0e0e0;
}

.hbouter h2 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #161616;
}

.text {
  font-family: "IBM Plex Sans", Arial, sans-serif;
}

.st {
  font-weight: 600;
}

.section {
  padding: 0;
}

.sectionb {
  background: #ffffff;
}

.tdtblw {
  width: 100%;
  border-collapse: collapse;
}

.tdtblw tr {
  border-bottom: 1px solid #f5f5f5;
}

.tdtblw tr:last-child {
  border-bottom: none;
}

/* 覆盖 maximo.css 的全局 td 样式，由 MaximoSectionCol 组件控制 */
.tdtblw :deep(td) {
  padding: 0 !important;
  margin: 0 !important;
}

/* 针对 MaximoTable 内部的 td，恢复正常的内边距 */
.tdtblw :deep(.maximo-table td) {
  padding: 3px 15px 0px 2px !important;
}
</style>
