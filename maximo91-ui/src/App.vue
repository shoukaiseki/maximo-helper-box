<script setup>
import { ref, computed } from 'vue'
import { routes } from './router'

const isCollapsed = ref(false)

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const menuItems = computed(() =>
  routes
    .filter(route => route.meta?.menu)
    .map(route => ({
      name: route.meta.title,
      icon: route.meta.icon,
      path: route.path
    }))
)
</script>

<template>
  <div class="app-layout">
    <!-- 左侧菜单栏 -->
    <aside class="sidebar" :class="{ 'collapsed': isCollapsed }">
      <div class="sidebar-header">
        <button class="toggle-btn" @click="toggleSidebar">
          <span v-if="isCollapsed">☰</span>
          <span v-else>✕</span>
        </button>
        <h2 v-show="!isCollapsed">Maximo Components</h2>
      </div>
      <nav class="sidebar-nav">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="menu-item"
          active-class="menu-item-active"
        >
          <span class="menu-icon">{{ item.icon }}</span>
          <span v-show="!isCollapsed" class="menu-text">{{ item.name }}</span>
        </router-link>
      </nav>
    </aside>

    <!-- 主内容区 -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background: #ffffff;
}

.sidebar {
  width: 240px;
  background: #161616;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 60px;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #393939;
  display: flex;
  align-items: center;
  gap: 10px;
}

.toggle-btn {
  background: none;
  border: none;
  color: #ffffff;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
}

.toggle-btn:hover {
  background: #262626;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
}

.sidebar-nav {
  padding: 10px 0;
  flex: 1;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #c6c6c6;
  text-decoration: none;
  transition: all 0.3s;
  cursor: pointer;
  white-space: nowrap;
}

.menu-item:hover {
  background: #262626;
  color: #ffffff;
}

.menu-item-active {
  background: #0f62fe;
  color: #ffffff;
  font-weight: 500;
}

.menu-icon {
  font-size: 18px;
  margin-right: 12px;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}

.menu-text {
  font-size: 14px;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  background: #ffffff;
  padding: 0;
}
</style>
