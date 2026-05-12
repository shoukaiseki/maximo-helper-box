<template>
  <div class="maximo-multiline-wrapper" :style="{ width: wrapperWidth }">
    <div class="multiline-row">
      <!-- 标签列 -->
      <MaximoLabel :text="label" :required="required" :multiline="true" />

      <!-- 文本域列 -->
      <div class="multiline-input-wrapper">
        <textarea
          v-model="inputValue"
          :readonly="readonly"
          :class="textareaClass"
          :style="{ width: textareaWidth, height: height }"
          :placeholder="placeholder"
          @input="handleInput"
          @change="handleChange"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import MaximoLabel from './MaximoLabel.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
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
  placeholder: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '80px'
  }
})

const emit = defineEmits(['update:modelValue', 'input', 'change'])

const inputValue = ref(props.modelValue)

// 计算外层容器宽度
const wrapperWidth = computed(() => {
  // 如果宽度是百分比或包含 calc，直接应用
  if (props.width.includes('%') || props.width.includes('calc')) {
    return props.width
  }
  // 如果是固定像素值，返回 auto 让内容自适应
  return 'auto'
})

// 计算文本域宽度
const textareaWidth = computed(() => {
  // 如果设置了具体宽度，使用设置的值
  if (props.width !== '100%') {
    return props.width
  }
  // 否则让文本域填满可用空间
  return '100%'
})

// 监听外部值变化
watch(() => props.modelValue, (newVal) => {
  inputValue.value = newVal
})

// 计算文本域类名
const textareaClass = computed(() => {
  const classes = ['fld', 'text', 'multilinetextbox', 'ta']
  if (props.required) classes.push('fld_req')
  if (props.readonly) classes.push('fld_ro')
  return classes.join(' ')
})

// 处理输入事件
const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
  emit('input', event.target.value)
}

// 处理变更事件
const handleChange = (event) => {
  emit('change', event.target.value)
}
</script>

<style scoped>
.maximo-multiline-wrapper {
  width: 100%;
}

.multiline-row {
  display: flex;
  align-items: flex-start;
  min-height: 80px;
}

.multiline-input-wrapper {
  display: flex;
  align-items: center;
  vertical-align: middle;
  flex: 1;
  min-width: 0;
}

.fld {
  padding: 8px;
  border: 1px solid #c6c6c6;
  font-size: 13px;
  font-family: MaximoBase, Arial, sans-serif;
  outline: none;
  transition: border-color 0.2s;
  resize: vertical;
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
  resize: none;
}

.fld_req {
  /*border-left: 3px solid #da1e28;*/
}

.ta {
  line-height: 1.5;
}
</style>
