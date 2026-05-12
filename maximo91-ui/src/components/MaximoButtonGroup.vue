<template>
  <div class="maximo-button-group" :class="groupClass">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 对齐方式：left、center、right
  align: {
    type: String,
    default: 'right',
    validator: (value) => ['left', 'center', 'right'].includes(value)
  },
  // 是否为底部按钮组（对话框底部）
  bottom: {
    type: Boolean,
    default: false
  },
  // 是否隐藏按钮组容器样式
  invisible: {
    type: Boolean,
    default: false
  },
  // 自定义类名
  customClass: {
    type: String,
    default: ''
  }
})

// 计算按钮组类名
const groupClass = computed(() => {
  const classes = []
  
  if (props.bottom) {
    classes.push('dbottom')
  }
  
  if (props.invisible) {
    classes.push('invisbuttongroup')
  }
  
  if (props.align === 'left') {
    classes.push('align-left')
  } else if (props.align === 'center') {
    classes.push('align-center')
  } else if (props.align === 'right') {
    classes.push('align-right')
  }
  
  if (props.customClass) {
    classes.push(props.customClass)
  }
  
  return classes.join(' ')
})
</script>

<style scoped>
.maximo-button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 0;
}

/* 右对齐（默认） */
.maximo-button-group.align-right {
  justify-content: flex-end;
}

/* 左对齐 */
.maximo-button-group.align-left {
  justify-content: flex-start;
}

/* 居中对齐 */
.maximo-button-group.align-center {
  justify-content: center;
}

/* 底部按钮组样式 */
.maximo-button-group.dbottom {
  margin-bottom: 0px;
  padding: 16px;
  background: #ffffff;
  border-top: 1px solid #e0e0e0;
}

/* 隐藏按钮组容器 */
.maximo-button-group.invisbuttongroup {
  padding: 0;
  background: transparent;
  border: none;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .maximo-button-group {
    flex-direction: column;
  }
  
  .maximo-button-group > :deep(.text.pb) {
    width: 100%;
    margin: 4px 0;
  }
}
</style>
