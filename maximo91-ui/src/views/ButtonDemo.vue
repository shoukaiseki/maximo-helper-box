<script setup>
import { ref } from 'vue'
import MaximoButton from '../components/MaximoButton.vue'
import MaximoButtonGroup from '../components/MaximoButtonGroup.vue'

// 按钮点击处理
const handlePrimaryClick = () => {
  console.log('主要按钮被点击')
  alert('主要按钮被点击！')
}

const handleSecondaryClick = () => {
  console.log('次要按钮被点击')
  alert('次要按钮被点击！')
}

const handleDisabledClick = () => {
  console.log('这个不应该被触发')
}

const handleSave = () => {
  console.log('保存操作')
  alert('保存成功！')
}

const handleCancel = () => {
  console.log('取消操作')
  alert('已取消')
}

const handleClose = () => {
  console.log('关闭操作')
  alert('已关闭')
}
</script>

<template>
  <div class="button-demo">
    <h1 class="page-title">Maximo 按钮组件演示</h1>

    <!-- 单个按钮示例 -->
    <section class="demo-section">
      <h2>1. 单个按钮</h2>
      
      <div class="demo-row">
        <h3>普通按钮（蓝色边框）</h3>
        <MaximoButton label="普通按钮" @click="handleSecondaryClick" />
      </div>

      <div class="demo-row">
        <h3>主要按钮（蓝色背景）</h3>
        <MaximoButton label="主要按钮" :default="true" @click="handlePrimaryClick" />
      </div>

      <div class="demo-row">
        <h3>禁用按钮</h3>
        <MaximoButton label="禁用按钮" :disabled="true" @click="handleDisabledClick" />
      </div>

      <div class="demo-row">
        <h3>带标题的按钮（Tooltip）</h3>
        <MaximoButton label="悬停查看提示" title="这是一个按钮提示" @click="handleSecondaryClick" />
      </div>

      <div class="demo-row">
        <h3>使用 Slot 自定义内容</h3>
        <MaximoButton @click="handleSecondaryClick">
          <span style="font-weight: bold;">自定义内容</span>
        </MaximoButton>
      </div>
    </section>

    <!-- 按钮组示例 -->
    <section class="demo-section">
      <h2>2. 按钮组</h2>

      <div class="demo-row">
        <h3>右对齐按钮组（默认）</h3>
        <MaximoButtonGroup>
          <MaximoButton label="保存" :default="true" @click="handleSave" />
          <MaximoButton label="取消" @click="handleCancel" />
          <MaximoButton label="关闭" @click="handleClose" />
        </MaximoButtonGroup>
      </div>

      <div class="demo-row">
        <h3>左对齐按钮组</h3>
        <MaximoButtonGroup align="left">
          <MaximoButton label="上一步" @click="handleSecondaryClick" />
          <MaximoButton label="下一步" :default="true" @click="handlePrimaryClick" />
        </MaximoButtonGroup>
      </div>

      <div class="demo-row">
        <h3>居中对齐按钮组</h3>
        <MaximoButtonGroup align="center">
          <MaximoButton label="确认" :default="true" @click="handlePrimaryClick" />
          <MaximoButton label="取消" @click="handleCancel" />
        </MaximoButtonGroup>
      </div>

      <div class="demo-row">
        <h3>底部按钮组（对话框样式）</h3>
        <MaximoButtonGroup bottom>
          <MaximoButton label="确定" :default="true" @click="handlePrimaryClick" />
          <MaximoButton label="取消" @click="handleCancel" />
        </MaximoButtonGroup>
      </div>

      <div class="demo-row">
        <h3>隐藏样式的按钮组</h3>
        <MaximoButtonGroup invisible>
          <MaximoButton label="按钮1" @click="handleSecondaryClick" />
          <MaximoButton label="按钮2" @click="handleSecondaryClick" />
          <MaximoButton label="按钮3" @click="handleSecondaryClick" />
        </MaximoButtonGroup>
      </div>
    </section>

    <!-- 实际应用场景 -->
    <section class="demo-section">
      <h2>3. 实际应用场景</h2>

      <div class="demo-row">
        <h3>表单操作按钮</h3>
        <MaximoButtonGroup align="right">
          <MaximoButton label="提交" :default="true" @click="handleSave" />
          <MaximoButton label="重置" @click="handleCancel" />
          <MaximoButton label="返回" @click="handleClose" />
        </MaximoButtonGroup>
      </div>

      <div class="demo-row">
        <h3>对话框按钮（三个按钮）</h3>
        <MaximoButtonGroup bottom>
          <MaximoButton label="是" :default="true" @click="handlePrimaryClick" />
          <MaximoButton label="否" @click="handleCancel" />
          <MaximoButton label="取消" @click="handleClose" />
        </MaximoButtonGroup>
      </div>

      <div class="demo-row">
        <h3>工具栏按钮</h3>
        <MaximoButtonGroup invisible align="left">
          <MaximoButton label="新建" :default="true" @click="handlePrimaryClick" />
          <MaximoButton label="编辑" @click="handleSecondaryClick" />
          <MaximoButton label="删除" @click="handleSecondaryClick" />
          <MaximoButton label="刷新" @click="handleSecondaryClick" />
        </MaximoButtonGroup>
      </div>
    </section>

    <!-- 代码示例 -->
    <section class="demo-section">
      <h2>4. 使用示例代码</h2>
      
      <div class="code-example">
        <h3>基本用法</h3>
        <pre><code>&lt;!-- 普通按钮 --&gt;
&lt;MaximoButton label="按钮文本" @click="handler" /&gt;

&lt;!-- 主要按钮 --&gt;
&lt;MaximoButton label="主要按钮" :default="true" @click="handler" /&gt;

&lt;!-- 禁用按钮 --&gt;
&lt;MaximoButton label="禁用" :disabled="true" /&gt;</code></pre>
      </div>

      <div class="code-example">
        <h3>按钮组用法</h3>
        <pre><code>&lt;!-- 右对齐按钮组 --&gt;
&lt;MaximoButtonGroup&gt;
  &lt;MaximoButton label="保存" :default="true" @click="save" /&gt;
  &lt;MaximoButton label="取消" @click="cancel" /&gt;
&lt;/MaximoButtonGroup&gt;

&lt;!-- 左对齐按钮组 --&gt;
&lt;MaximoButtonGroup align="left"&gt;
  &lt;MaximoButton label="上一步" @click="prev" /&gt;
  &lt;MaximoButton label="下一步" :default="true" @click="next" /&gt;
&lt;/MaximoButtonGroup&gt;

&lt;!-- 底部按钮组 --&gt;
&lt;MaximoButtonGroup bottom&gt;
  &lt;MaximoButton label="确定" :default="true" @click="confirm" /&gt;
  &lt;MaximoButton label="取消" @click="cancel" /&gt;
&lt;/MaximoButtonGroup&gt;</code></pre>
      </div>
    </section>
  </div>
</template>

<style scoped>
.button-demo {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  color: #161616;
  font-size: 28px;
  margin-bottom: 30px;
  border-bottom: 2px solid #0F62FE;
  padding-bottom: 10px;
}

.demo-section {
  margin-bottom: 40px;
  padding: 20px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.demo-section h2 {
  color: #161616;
  font-size: 20px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.demo-row {
  margin-bottom: 24px;
}

.demo-row h3 {
  color: #525252;
  font-size: 14px;
  margin-bottom: 12px;
  font-weight: 500;
}

.code-example {
  margin-bottom: 20px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 4px;
  border-left: 4px solid #0F62FE;
}

.code-example h3 {
  color: #161616;
  font-size: 14px;
  margin-bottom: 12px;
  font-weight: 600;
}

.code-example pre {
  margin: 0;
  overflow-x: auto;
}

.code-example code {
  font-family: 'Courier New', Courier, monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #161616;
}
</style>
