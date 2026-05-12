<script setup>
import MaximoLabel from './MaximoLabel.vue'

const props = defineProps({
  // 是否为标签列（右侧对齐）
  label: {
    type: Boolean,
    default: false
  },
  // 是否必填
  required: {
    type: Boolean,
    default: false
  },
  // 垂直对齐方式
  valign: {
    type: String,
    default: 'top',
    validator: (value) => ['top', 'middle', 'bottom'].includes(value)
  },
  // 水平对齐方式
  align: {
    type: String,
    default: '',
    validator: (value) => ['', 'left', 'center', 'right'].includes(value)
  },
  // 自定义宽度
  width: {
    type: String,
    default: ''
  },
  colspan:{
    type: Number,
    default: 1
  }
})
</script>

<template>
  <td
    class="section-col"
    :class="{
      'label-cell': label,
      'required': required && label,
      'align-left': align === 'left',
      'align-center': align === 'center',
      'align-right': align === 'right'
    }"
    :colspan="colspan"
    :style="{
      verticalAlign: valign,
      textAlign: align ? align : (label ? 'left' : 'left'),
      padding: label ? '12px 12px 12px 2px' : '0',
      width: width
    }"
  >
    <!-- 如果是标签列，使用 MaximoLabel 组件 -->
    <MaximoLabel
      v-if="label"
      :text="''"
      :required="required"
    >
      <slot></slot>
    </MaximoLabel>
    <!-- 否则直接显示内容 -->
    <slot v-else></slot>
  </td>
</template>

<style scoped>
.section-col {
  vertical-align: middle;
}

.label-cell {
  text-align: left;
  padding: 0;
}

.required.label-cell {
  font-weight: 500;
}

.align-left {
  text-align: left !important;
}

.align-center {
  text-align: center !important;
}

.align-right {
  text-align: right !important;
}
</style>
