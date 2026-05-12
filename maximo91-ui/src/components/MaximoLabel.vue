<script setup>
const props = defineProps({
  // 标签文本
  text: {
    type: String,
    default: ''
  },
  // 是否必填
  required: {
    type: Boolean,
    default: false
  },
  // 是否多行文本框标签（顶部对齐）
  multiline: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="maximo-label text label" style="text-align: right;" :class="{ 'required': required, 'multiline': multiline }">
    <img
      v-if="required"
      class="required-icon"
      src="/images/required_label.gif"
      alt=""
    >
    <span class="label-text">
      <slot>{{ text }}</slot>
    </span>
  </div>
</template>

<style scoped>
.maximo-label {
  text-align: right;
  padding: 12px 12px 12px 2px;
  vertical-align: middle;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  min-width: 150px;
  white-space: nowrap;
  flex-shrink: 0;
}

.maximo-label.multiline {
  padding-top: 20px;
  align-items: flex-start;
}

.maximo-label.required {
  font-weight: 500;
  visibility: visible;
}

.required-icon {
  width: 8px;
  height: 8px;
  align-self: center;
}

.label-text {
      color: rgb(70, 70, 70);
  display: inline-block;
  vertical-align: middle;
    text-align: right;
}
</style>
