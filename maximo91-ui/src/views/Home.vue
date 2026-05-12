<template>
  <div class="home-page">
    <h1>Maximo Vue Components</h1>
    <p class="subtitle">基于 Maximo 设计规范的 Vue 3 组件库</p>
    
    <div class="nav-links">
      <router-link to="/purchase-order-list" class="nav-card">
        <h3>📋 采购订单列表</h3>
        <p>采购订单管理列表页面</p>
      </router-link>
      
      <router-link to="/purchase-order-detail" class="nav-card">
        <h3>📄 采购订单详情</h3>
        <p>包含3个子表和多标签页的详情页面</p>
      </router-link>
      
      <router-link to="/supplier-list" class="nav-card">
        <h3>🏭 供应商管理列表</h3>
        <p>供应商信息管理列表</p>
      </router-link>
      
      <router-link to="/supplier-detail" class="nav-card">
        <h3>🏭 供应商详情</h3>
        <p>包含3个子表、附件和复选框的详情页面</p>
      </router-link>
      
      <router-link to="/employee-list" class="nav-card">
        <h3>👥 员工管理列表</h3>
        <p>员工信息管理列表</p>
      </router-link>
      
      <router-link to="/employee-detail" class="nav-card">
        <h3> 员工详情 ⭐</h3>
        <p>综合示例：使用所有15个组件的详情页面</p>
      </router-link>
      
      <router-link to="/work-order-list" class="nav-card">
        <h3>🔧 设备维护工单列表</h3>
        <p>设备维护工单管理列表</p>
      </router-link>
      
      <router-link to="/work-order-detail" class="nav-card">
        <h3>🔨 设备维护工单详情</h3>
        <p>包含3个子表、附件和多行文本框的详情页面</p>
      </router-link>
      
      <router-link to="/asset-list" class="nav-card">
        <h3>️ 资产管理列表</h3>
        <p>资产信息管理列表</p>
      </router-link>
      
      <router-link to="/asset-detail" class="nav-card">
        <h3>🏗️ 资产详情</h3>
        <p>包含3个子表、附件和复选框的详情页面</p>
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
