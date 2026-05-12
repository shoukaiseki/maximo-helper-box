import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ComponentsDemo from '../views/ComponentsDemo.vue'
import ButtonDemo from '../views/ButtonDemo.vue'
// 公开ERP示例页面
import PurchaseOrderList from '../views/erp/PurchaseOrderList.vue'
import PurchaseOrderDetail from '../views/erp/PurchaseOrderDetail.vue'
import SupplierList from '../views/erp/SupplierList.vue'
import SupplierDetail from '../views/erp/SupplierDetail.vue'
import EmployeeList from '../views/erp/EmployeeList.vue'
import EmployeeDetail from '../views/erp/EmployeeDetail.vue'
import WorkOrderList from '../views/erp/WorkOrderList.vue'
import WorkOrderDetail from '../views/erp/WorkOrderDetail.vue'
import AssetList from '../views/erp/AssetList.vue'
import AssetDetail from '../views/erp/AssetDetail.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '首页', icon: '', menu: true }
  },
  {
    path: '/components-demo',
    name: 'ComponentsDemo',
    component: ComponentsDemo,
    meta: { title: '组件演示', icon: '', menu: true }
  },
  {
    path: '/button-demo',
    name: 'ButtonDemo',
    component: ButtonDemo,
    meta: { title: '按钮演示', icon: '', menu: true }
  },
  // 公开ERP示例页面路由
  {
    path: '/purchase-order-list',
    name: 'PurchaseOrderList',
    component: PurchaseOrderList,
    meta: { title: '采购订单列表', icon: '', menu: true }
  },
  {
    path: '/purchase-order-detail',
    name: 'PurchaseOrderDetail',
    component: PurchaseOrderDetail,
    meta: { title: '采购订单详情', icon: '', menu: true }
  },
  {
    path: '/supplier-list',
    name: 'SupplierList',
    component: SupplierList,
    meta: { title: '供应商管理列表', icon: '', menu: true }
  },
  {
    path: '/supplier-detail',
    name: 'SupplierDetail',
    component: SupplierDetail,
    meta: { title: '供应商详情', icon: '', menu: true }
  },
  {
    path: '/employee-list',
    name: 'EmployeeList',
    component: EmployeeList,
    meta: { title: '员工管理列表', icon: '', menu: true }
  },
  {
    path: '/employee-detail',
    name: 'EmployeeDetail',
    component: EmployeeDetail,
    meta: { title: '员工详情', icon: '', menu: true }
  },
  {
    path: '/work-order-list',
    name: 'WorkOrderList',
    component: WorkOrderList,
    meta: { title: '设备维护工单列表', icon: '', menu: true }
  },
  {
    path: '/work-order-detail',
    name: 'WorkOrderDetail',
    component: WorkOrderDetail,
    meta: { title: '设备维护工单详情', icon: '', menu: true }
  },
  {
    path: '/asset-list',
    name: 'AssetList',
    component: AssetList,
    meta: { title: '资产管理列表', icon: '', menu: true }
  },
  {
    path: '/asset-detail',
    name: 'AssetDetail',
    component: AssetDetail,
    meta: { title: '资产详情', icon: '', menu: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export { routes }
export default router
