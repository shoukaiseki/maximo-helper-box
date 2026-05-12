<template>
  <div class="home-page">
    <h1>Maximo Vue Components</h1>
    <p class="subtitle">基于 Maximo 设计规范的 Vue 3 组件库</p>
    
    <div class="nav-links">
      <router-link to="/components-demo" class="nav-card">
        <h3>📦 组件演示</h3>
        <p>查看所有 Maximo 组件的使用示例</p>
      </router-link>
      
      <router-link to="/button-demo" class="nav-card">
        <h3>🔘 按钮组件</h3>
        <p>MaximoButton 和 MaximoButtonGroup 组件演示</p>
      </router-link>
      
      <router-link to="/parts-application-list" class="nav-card">
        <h3>📋 零件登记申请列表</h3>
        <p>零件登记申请管理页面</p>
      </router-link>
      
      <router-link to="/parts-application-detail" class="nav-card">
        <h3>📝 零件登记申请详情</h3>
        <p>零件登记申请详情表单页面</p>
      </router-link>
      
      <router-link to="/inquiry-detail" class="nav-card">
        <h3>💰 询价单详情</h3>
        <p>询价单详细信息页面</p>
      </router-link>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home-page {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.home-page h1 {
  color: #161616;
  font-size: 36px;
  margin-bottom: 10px;
  text-align: center;
}

.subtitle {
  color: #525252;
  font-size: 16px;
  text-align: center;
  margin-bottom: 40px;
}

.nav-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.nav-card {
  display: block;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
}

.nav-card:hover {
  border-color: #0F62FE;
  box-shadow: 0 2px 8px rgba(15, 98, 254, 0.1);
  transform: translateY(-2px);
}

.nav-card h3 {
  color: #161616;
  font-size: 18px;
  margin: 0 0 8px 0;
}

.nav-card p {
  color: #525252;
  font-size: 14px;
  margin: 0;
  line-height: 1.5;
}
</style>
