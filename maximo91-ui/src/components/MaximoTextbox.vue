<template>
    <div class="maximo-textbox-wrapper">
        <div class="textbox-row">
            <!-- 标签列 -->
            <MaximoLabel :text="label" :required="required" />

            <!-- 输入框列 -->
            <div class="textbox-input-wrapper">
                <input
                    v-model="inputValue"
                    :type="inputType"
                    :readonly="readonly"
                    :class="inputClass"
                    :style="{ width: width }"
                    @input="handleInput"
                    @change="handleChange"
                >

                <!-- 右侧图标按钮 -->
                <div
                    v-if="showIcon"
                    class="icon-button"
                    :class="{ 'disabled': readonly }"
                    @click="handleIconClick"
                >
                    <img :src="iconSrc" :alt="iconAlt">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import MaximoLabel from './MaximoLabel.vue'

const props = defineProps({
    modelValue: {
        type: [String, Number],
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
        default: '16.1ch'
    },
    inputType: {
        type: String,
        default: 'text',
        validator: (value) => ['text', 'password', 'date', 'time'].includes(value)
    },
    // 图标配置
    showIcon: {
        type: Boolean,
        default: false
    },
    iconSrc: {
        type: String,
        default: ''
    },
    iconAlt: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update:modelValue', 'input', 'change', 'icon-click'])

const inputValue = ref(props.modelValue)

// 监听外部值变化
watch(() => props.modelValue, (newVal) => {
    inputValue.value = newVal
})

// 计算输入框类名
const inputClass = computed(() => {
    const classes = ['fld', 'text']
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

// 处理图标点击
const handleIconClick = () => {
    if (!props.readonly) {
        emit('icon-click')
    }
}
</script>

<style scoped>
.maximo-textbox-wrapper {
    width: 100%;
}

.textbox-row {
    display: flex;
    align-items: center;
    min-height: 40px;
}

.textbox-input-wrapper {
    display: flex;
    align-items: center;
    vertical-align: middle;
    flex: 1;
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

.icon-button {
    display: inline-flex;
    width: 40px;
    height: 40px;
    background: #FFFFFF;
    border: 1px solid #c6c6c6;
    margin-left: 4px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s;
}

.icon-button:hover:not(.disabled) {
    background-color: #e5e5e5;
}

.icon-button.disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.icon-button img {
    width: 40px;
    height: 40px;
    margin: 0;
    display: block;
}
</style>
