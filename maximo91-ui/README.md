# Maximo Helper Box UI

这是一个基于 Vue 3 + Vite 的 Maximo ERP 系统前端界面组件库。

## 项目介绍

本项目提供了一系列模仿 IBM Maximo ERP 系统风格的 Vue 组件，可用于构建企业级应用程序的用户界面。这些组件遵循 Maximo 的设计规范，为开发者提供了一致的用户体验。

## 技术栈

- Vue 3 (Composition API with `<script setup>`)
- Vite
- Vue Router

## 组件列表

- **MaximoButton**: Maximo 风格按钮组件
- **MaximoTable**: Maximo 风格表格组件
- **MaximoTextbox**: Maximo 风格文本框组件
- **MaximoLabel**: Maximo 风格标签组件
- **MaximoCheckbox**: Maximo 风格复选框组件
- **MaximoSection**: Maximo 风格区块组件
- **MaximoTabs**: Maximo 风格标签页组件
- **MaximoButtonGroup**: Maximo 风格按钮组组件
- **MaximoMultilineTextbox**: Maximo 风格多行文本框组件
- **MaximoMultipartTextbox**: Maximo 风格多部分文本框组件
- **MaximoAttachments**: Maximo 风格附件组件

## 项目结构

```
src/
├── components/          # 可复用的 Maximo UI 组件
├── views/               # 页面视图
│   ├── Home.vue         # 首页
│   ├── ComponentsDemo.vue  # 组件演示页
│   ├── ButtonDemo.vue   # 按钮演示页
│   └── erp-pages/       # ERP 业务页面（具体业务实现示例）
├── router/              # 路由配置
├── assets/              # 静态资源
├── App.vue              # 根组件
├── main.js              # 入口文件
└── style.css            # 全局样式
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 使用示例

```vue
<template>
  <div>
    <MaximoButton label="保存" type="primary" @click="saveData" />
    <MaximoTextbox v-model="formData.name" label="名称" />
    <MaximoTable :data="tableData" :columns="columns" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MaximoButton from './components/MaximoButton.vue'
import MaximoTextbox from './components/MaximoTextbox.vue'
import MaximoTable from './components/MaximoTable.vue'

const formData = ref({ name: '' })
const tableData = ref([])
const columns = ref([])

const saveData = () => {
  // 保存逻辑
}
</script>
```

## 业务页面示例

`views/erp-pages/` 目录包含了具体的 ERP 业务页面实现示例，展示了如何使用这些组件来构建完整的业务功能界面。这些页面仅作为参考，您可以根据自己的需求进行修改和扩展。

## 开源许可

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！
