<template>
  <li role="presentation" class="tab_li" :class="{ 'tab_li_on': isActive, 'tab_li_off': !isActive }">
    <a 
      role="tab" 
      :tabindex="isActive ? 0 : -1" 
      :title="title"
      :class="['text', 'tablabel', { 'on': isActive, 'off': !isActive }]"
      :aria-expanded="isActive"
      @click="handleClick"
      @keydown.space.prevent="handleClick"
    >
      {{ label }}
    </a>
  </li>
</template>

<script setup>
import { inject, computed } from 'vue'

const props = defineProps({
  name: {
    type: [String, Number],
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  }
})

const activeTab = inject('activeTab')
const setActiveTab = inject('setActiveTab')

const isActive = computed(() => activeTab.value === props.name)

const handleClick = () => {
  if (setActiveTab) {
    setActiveTab(props.name)
  }
}
</script>

<style scoped>
.tab_li {
  margin: 0px;
  margin-inline-start: -2px;
  padding: 0px;
  list-style: none;
  display: inline-block;
  background: #f4f4f4;
}

.text.tablabel {
  display: block;
  text-decoration: none;
  white-space: nowrap;
  margin: 0px;
  padding: 13px 16px 12px 16px;
  font-size: 14px;
  transition: border .3s;
  height: 42px;
  font-family: MaximoBase, Arial, sans-serif;
  transition: all .3s;
  cursor: pointer;
  outline: none;
}

.text.tablabel.on {
  color: #161616;
  font-family: "MaximoBase-Bold", Arial, sans-serif;
  background: #f4f4f4;
  box-shadow: inset 0px -2px 0px 0px blue;
}

.text.tablabel.off {
  background: none;
  margin-inline-start: 2px;
  color: #525252;
  box-shadow: inset 0px -2px 0px 0px #e0e0e0;
}

.text.tablabel.off:hover,
.text.tablabel.off:focus {
  background: #f4f4f4;
  box-shadow: inset 0px -2px 0px 0px #8D8D8D;
  color: #161616;
}
</style>
