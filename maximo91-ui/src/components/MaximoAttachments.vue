<template>
    <div class="maximo-attachments-wrapper">
        <div class="attachments-row">
            <!-- 标签列 -->
            <MaximoLabel :text="label" :required="required" />

            <!-- 按钮列 -->
            <div class="attachments-button-wrapper">
                <button
                    class="attachments-btn"
                    :disabled="disabled"
                    @click="handleViewClick"
                >
                    {{ buttonText }}
                </button>
                <button
                    class="attachments-dropdown"
                    :disabled="disabled"
                    @click="handleDropdownClick"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M4 6l4 4 4-4z"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import MaximoLabel from './MaximoLabel.vue'

const props = defineProps({
    label: {
        type: String,
        required: true
    },
    required: {
        type: Boolean,
        default: false
    },
    buttonText: {
        type: String,
        default: '查看附件'
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['view-click', 'dropdown-click'])

// 处理查看附件按钮点击
const handleViewClick = () => {
    if (!props.disabled) {
        emit('view-click')
    }
}

// 处理下拉按钮点击
const handleDropdownClick = () => {
    if (!props.disabled) {
        emit('dropdown-click')
    }
}
</script>

<style scoped>
.maximo-attachments-wrapper {
    width: 100%;
}

.attachments-row {
    display: flex;
    align-items: center;
    min-height: 40px;
}

.attachments-button-wrapper {
    display: flex;
    align-items: center;
    vertical-align: middle;
    flex: 1;
}

.attachments-btn {
    height: 40px;
    padding: 0 16px;
    background-color: #ffffff;
    border: 1px solid #0f62fe;
    border-right: none;
    color: #0f62fe;
    font-size: 14px;
    font-family: MaximoBase, Arial, sans-serif;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
}

.attachments-btn:hover:not([disabled]) {
    background-color: #0f62fe;
    color: #ffffff;
}

.attachments-btn:focus {
    outline: 2px solid #0f62fe;
    outline-offset: -2px;
}

.attachments-btn[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
}

.attachments-dropdown {
    height: 40px;
    width: 40px;
    background-color: #ffffff;
    border: 1px solid #0f62fe;
    color: #0f62fe;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.attachments-dropdown:hover:not([disabled]) {
    background-color: #0f62fe;
    color: #ffffff;
}

.attachments-dropdown:focus {
    outline: 2px solid #0f62fe;
    outline-offset: -2px;
}

.attachments-dropdown[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
}

.attachments-dropdown svg {
    width: 16px;
    height: 16px;
}
</style>
