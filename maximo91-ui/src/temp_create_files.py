# 创建 DetailPanel.vue
detail_content = """<script setup>
const props = defineProps({
  row: { type: Object, default: null }
})
</script>

<template>
  <div class="maximo-detail-panel">
    <div class="maximo-toolbar">
      <span class="maximo-toolbar-title">Detail</span>
    </div>
    <div class="maximo-detail-content" v-if="row">
      <div class="maximo-field-row">
        <label class="maximo-label">Group:</label>
        <span class="maximo-field-value">{{ row.id }}</span>
      </div>
      <div class="maximo-field-row">
        <label class="maximo-label">Description:</label>
        <span class="maximo-field-value">{{ row.description }}</span>
      </div>
      <div class="maximo-field-row">
        <label class="maximo-label">Default Application:</label>
        <span class="maximo-field-value">{{ row.defaultApp }}</span>
      </div>
      <div class="maximo-field-row">
        <label class="maximo-label">Independent:</label>
        <span class="maximo-field-value">{{ row.independent ? 'Yes' : 'No' }}</span>
      </div>
    </div>
    <div class="maximo-detail-empty" v-else>
      <p>Select a row to view details</p>
    </div>
  </div>
</template>

<style scoped>
.maximo-detail-panel {
  border: 1px solid #7f9db9;
  background: #fff;
  height: 100%;
}
.maximo-detail-content {
  padding: 12px;
}
.maximo-field-row {
  margin-bottom: 10px;
  display: flex;
  align-items: flex-start;
}
.maximo-label {
  width: 140px;
  font-weight: bold;
  color: #333;
  flex-shrink: 0;
}
.maximo-field-value {
  color: #000;
  word-break: break-all;
}
.maximo-detail-empty {
  padding: 40px 20px;
  text-align: center;
  color: #999;
}
</style>"""

with open('src/components/DetailPanel.vue', 'w', encoding='utf-8') as f:
    f.write(detail_content)
print('DetailPanel.vue created')
