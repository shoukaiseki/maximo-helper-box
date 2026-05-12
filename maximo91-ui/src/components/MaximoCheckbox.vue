<template>
  <div class="maximo-checkbox-wrapper">
    <div class="checkbox-row">
      <!-- 标签列 -->
      <MaximoLabel :text="label" :required="required" />

      <!-- 勾选框列 -->
      <div class="checkbox-control-wrapper">
        <div class="checkbox-control" @click="handleToggle">
          <img 
            :id="checkboxId"
            :src="checkboxImage"
            :alt="`${label}：${modelValue ? 'checked' : 'unchecked'}`"
            :class="['checkbox', { readonly: readonly }]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import MaximoLabel from './MaximoLabel.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
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
  checkboxId: {
    type: String,
    default: () => `cb_${Math.random().toString(36).substr(2, 9)}`
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const checkboxImage = computed(() => {
  if (props.readonly) {
    return props.modelValue ? '/images/cb_checkedreadonly.gif' : '/images/cb_uncheckedreadonly.gif'
  }
  return props.modelValue ? '/images/cb_checked.gif' : '/images/cb_unchecked.gif'
})

const handleToggle = () => {
  if (props.readonly) return
  
  const newValue = !props.modelValue
  emit('update:modelValue', newValue)
  emit('change', newValue)
}
</script>

<style scoped>
.maximo-checkbox-wrapper {
  width: 100%;
}

.checkbox-row {
  display: flex;
  align-items: center;
  min-height: 40px;
}

.checkbox-control-wrapper {
  display: flex;
  align-items: center;
  vertical-align: middle;
  flex: 1;
}

.checkbox-control {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.checkbox {
  cursor: pointer;
  vertical-align: middle;
}

.checkbox.readonly {
  cursor: not-allowed;
}
</style>
