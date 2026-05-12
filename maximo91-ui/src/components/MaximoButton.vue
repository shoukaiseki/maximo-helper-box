<template>
  <button
    :type="type"
    :class="buttonClass"
    :disabled="disabled"
    :title="title"
    @click="handleClick"
  >
    <slot>{{ label }}</slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 按钮文本
  label: {
    type: String,
    default: ''
  },
  // 按钮类型：pushbutton(普通按钮) 或 link(链接按钮)
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value)
  },
  // 是否为默认/主要按钮（蓝色背景）
  default: {
    type: Boolean,
    default: false
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  // 按钮标题（tooltip）
  title: {
    type: String,
    default: ''
  },
  // 自定义类名
  customClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click'])

// 计算按钮类名
const buttonClass = computed(() => {
  const classes = ['text', 'pb']
  
  if (props.default) {
    classes.push('default')
  }
  
  if (props.customClass) {
    classes.push(props.customClass)
  }
  
  return classes.join(' ')
})

// 处理点击事件
const handleClick = (event) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped>
.text.pb {
  background: transparent;
  border: 1px solid #0f62fe;
  border-radius: 0px;
  cursor: pointer;
  padding: calc(0.875rem - 3px) 63px calc(0.875rem - 3px) 15px;
  margin: 2px 16px 2px 0px;
  vertical-align: middle;
  color: #0f62fe;
  text-decoration: none;
  font-size: 14px;
  font-family: MaximoBase, Arial, sans-serif;
  min-width: 70px;
  transition: all 0.2s;
}

.text.pb:hover:not([disabled]) {
  color: #ffffff;
  background-color: #0353e9;
}

.text.pb:focus {
  color: #ffffff;
  background-color: #0f62fe;
  border-color: #0f62fe;
  box-shadow: inset 0 0 0 1px #0f62fe, inset 0 0 0 2px #f4f4f4;
  outline: none;
}

.text.pb[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 默认/主要按钮样式 */
.text.pb.default {
  background: #0f62fe;
  border-radius: 0px;
  cursor: pointer;
  margin: 2px;
  vertical-align: middle;
  color: #ffffff;
  text-decoration: none;
  min-width: 70px;
  border-color: transparent;
}

.text.pb.default:hover {
  color: #ffffff !important;
  background: #0353e9 !important;
}

.text.pb.default:focus {
  border-color: #0f62fe;
  box-shadow: inset 0 0 0 1px #0f62fe, inset 0 0 0 2px #f4f4f4;
  outline: none !important;
}
</style>
