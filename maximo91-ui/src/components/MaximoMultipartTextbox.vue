<template>
  <div class="maximo-multipart-wrapper">
    <div class="multipart-row">
      <!-- 标签列 -->
      <MaximoLabel :text="label" :required="required" />

      <!-- 输入框列 -->
      <div class="multipart-inputs-wrapper">
        <input
          v-model="firstValue"
          :readonly="readonly"
          :class="inputClass"
          :style="{ width: partWidth }"
          :placeholder="firstPlaceholder"
          @input="handleInput"
        >

        <!-- 分隔符 -->
        <img
          v-for="(separator, index) in separators"
          :key="'sep-' + index"
          :src="separator.src || '/images/blank.gif'"
          :style="{ width: separator.width || '4px', height: separator.height || '40px', margin: separator.margin || '0px' }"
          class="separator"
        >

        <input
          v-model="secondValue"
          :readonly="readonly"
          :class="inputClass"
          :style="{ width: partWidth }"
          :placeholder="secondPlaceholder"
          @input="handleInput"
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import MaximoLabel from './MaximoLabel.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ first: '', second: '' })
  },
  label: {
    type: String,
    required: true
  },
  required: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  firstPlaceholder: {
    type: String,
    default: ''
  },
  secondPlaceholder: {
    type: String,
    default: ''
  },
  partWidth: {
    type: String,
    default: '16.1ch'
  },
  // 分隔符配置
  separators: {
    type: Array,
    default: () => [
      { src: '/images/blank.gif', width: '4px', height: '40px', margin: '0px' },
      { src: '/images/blank.gif', width: '4px', height: '40px', margin: '0px' }
    ]
  }
})

const emit = defineEmits(['update:modelValue', 'input', 'change'])

const firstValue = ref(props.modelValue.first || '')
const secondValue = ref(props.modelValue.second || '')

// 监听外部值变化
watch(() => props.modelValue, (newVal) => {
  firstValue.value = newVal.first || ''
  secondValue.value = newVal.second || ''
}, { deep: true })

// 计算输入框类名
const inputClass = computed(() => {
  const classes = ['fld', 'text']
  if (props.required) classes.push('fld_req')
  if (props.readonly) classes.push('fld_ro')
  return classes.join(' ')
})

// 处理输入事件
const handleInput = () => {
  const newValue = {
    first: firstValue.value,
    second: secondValue.value
  }
  emit('update:modelValue', newValue)
  emit('input', newValue)
}
</script>

<style scoped>
.maximo-multipart-wrapper {
  width: 100%;
}

.multipart-row {
  display: flex;
  align-items: center;
  min-height: 40px;
}

.multipart-inputs-wrapper {
  display: flex;
  align-items: center;
  vertical-align: middle;
  flex: 1;
  gap: 0;
}

.fld {
  height: 40px;
  padding: 0 8px;
  border: 1px solid #c6c6c6;
  font-size: 13px;
  font-family: MaximoBase, Arial, sans-serif;
  outline: none;
  transition: border-color 0.2s;
  background-color: #ffffff;
  color: #161616;
}

.fld:focus {
  border-color: #0f62fe;
  outline: 2px solid #0f62fe;
  outline-offset: -2px;
}

.fld_ro {
  background-color: #f5f5f5;
  color: #525252;
  cursor: not-allowed;
}

.fld_req {
  /*border-left: 3px solid #da1e28;*/
}

.separator {
  display: inline;
  vertical-align: middle;
}
</style>
