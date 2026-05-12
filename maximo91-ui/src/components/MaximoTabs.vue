<template>
  <div class="maximo-tabs-wrapper">
    <div class="tabsWrapper">
      <ul class="tabgroup" role="tablist">
        <slot></slot>
      </ul>
    </div>
    <div class="tab-content-container">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup>
import { provide, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const activeTab = ref(props.modelValue)

const setActiveTab = (name) => {
  activeTab.value = name
  emit('update:modelValue', name)
  emit('change', name)
}

provide('activeTab', activeTab)
provide('setActiveTab', setActiveTab)
</script>

<style scoped>
.maximo-tabs-wrapper {
  width: 100%;
}

.tabsWrapper {
  margin: 0 auto;
  overflow: hidden;
  height: 2.6rem;
  z-index: 0;
  background: #f4f4f4;
}

.tabgroup {
  padding: 0px;
  margin: 0px;
  list-style: none;
  overflow: visible;
  white-space: nowrap;
  display: flex;
}

.tab-content-container {
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-top: none;
  background: #ffffff;
}
</style>
