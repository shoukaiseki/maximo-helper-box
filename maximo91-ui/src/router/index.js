import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ComponentsDemo from '../views/ComponentsDemo.vue'
import PartsApplicationList from '../views/erp-pages/PartsApplicationList.vue'
import PartsApplicationDetail from '../views/erp-pages/PartsApplicationDetail.vue'
import InquiryDetail from '../views/erp-pages/InquiryDetail.vue'
import QuotationDetail from '../views/erp-pages/QuotationDetail.vue'
import ButtonDemo from '../views/ButtonDemo.vue'
import StoreroomList from '../views/erp-pages/StoreroomList.vue'
import StoreroomDetail from '../views/erp-pages/StoreroomDetail.vue'
import ItemMasterList from '../views/erp-pages/ItemMasterList.vue'
import ItemMasterDetail from '../views/erp-pages/ItemMasterDetail.vue'
import InventoryList from '../views/erp-pages/InventoryList.vue'
import InventoryDetail from '../views/erp-pages/InventoryDetail.vue'
import InventoryCountList from '../views/erp-pages/InventoryCountList.vue'
import InventoryCountDetail from '../views/erp-pages/InventoryCountDetail.vue'
import MonthlyInventory from '../views/erp-pages/MonthlyInventory.vue'
import PartsApplicationDetailChange from '../views/erp-pages/PartsApplicationDetailChange.vue'
import PartsApplicationListChange from '../views/erp-pages/PartsApplicationListChange.vue'
import SupplierEvaluationTemplateList from '../views/erp-pages/SupplierEvaluationTemplateList.vue'
import SupplierEvaluationTemplateDetail from '../views/erp-pages/SupplierEvaluationTemplateDetail.vue'
import SupplierEvaluationList from '../views/erp-pages/SupplierEvaluationList.vue'
import SupplierEvaluationDetail from '../views/erp-pages/SupplierEvaluationDetail.vue'
import PackingListDetail from '../views/erp-pages/PackingListDetail.vue'
import DocumentCreationDetail from '../views/erp-pages/DocumentCreationDetail.vue'
import PackingListPage from '../views/erp-pages/PackingListPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '首页', icon: '', menu: true }
  },
  {
    path: '/components',
    name: 'ComponentsDemo',
    component: ComponentsDemo,
    meta: { title: '组件演示', icon: '', menu: false }
  },
  {
    path: '/components-demo',
    name: 'ComponentsDemoNew',
    component: ComponentsDemo,
    meta: { title: '组件演示', icon: '', menu: true }
  },
  {
    path: '/parts-application-list',
    name: 'PartsApplicationList',
    component: PartsApplicationList,
    meta: { title: '零件登记申请列表', icon: '', menu: true }
  },
  {
    path: '/parts-application-detail',
    name: 'PartsApplicationDetail',
    component: PartsApplicationDetail,
    meta: { title: '零件登记申请详情', icon: '', menu: true }
  },
  {
    path: '/parts-application-change-list',
    name: 'PartsApplicationListChange',
    component: PartsApplicationListChange,
    meta: { title: '零件变更申请列表', icon: '', menu: true }
  },
  {
    path: '/parts-application-change-detail',
    name: 'PartsApplicationDetailChange',
    component: PartsApplicationDetailChange,
    meta: { title: '零件变更申请详情', icon: '', menu: true }
  },
  {
    path: '/inquiry-detail',
    name: 'InquiryDetail',
    component: InquiryDetail,
    meta: { title: '询价单详情', icon: '', menu: true }
  },
  {
    path: '/quotation-detail',
    name: 'QuotationDetail',
    component: QuotationDetail,
    meta: { title: '报价单详情', icon: '', menu: true }
  },
  {
    path: '/button-demo',
    name: 'ButtonDemo',
    component: ButtonDemo,
    meta: { title: '按钮演示', icon: '', menu: true }
  },
  {
    path: '/storeroom-list',
    name: 'StoreroomList',
    component: StoreroomList,
    meta: { title: '库房列表', icon: '', menu: true }
  },
  {
    path: '/storeroom-detail',
    name: 'StoreroomDetail',
    component: StoreroomDetail,
    meta: { title: '库房详情', icon: '', menu: true }
  },
  {
    path: '/item-master-list',
    name: 'ItemMasterList',
    component: ItemMasterList,
    meta: { title: '零件Master列表', icon: '', menu: true }
  },
  {
    path: '/item-master-detail',
    name: 'ItemMasterDetail',
    component: ItemMasterDetail,
    meta: { title: '零件Master详情', icon: '', menu: true }
  },
  {
    path: '/inventory-list',
    name: 'InventoryList',
    component: InventoryList,
    meta: { title: '库存列表', icon: '', menu: true }
  },
  {
    path: '/inventory-detail',
    name: 'InventoryDetail',
    component: InventoryDetail,
    meta: { title: '库存详情', icon: '', menu: true }
  },
  {
    path: '/inventory-count-list',
    name: 'InventoryCountList',
    component: InventoryCountList,
    meta: { title: '盘点主列表', icon: '', menu: true }
  },
  {
    path: '/inventory-count-detail',
    name: 'InventoryCountDetail',
    component: InventoryCountDetail,
    meta: { title: '盘点详情', icon: '', menu: true }
  },
  {
    path: '/monthly-inventory',
    name: 'MonthlyInventory',
    component: MonthlyInventory,
    meta: { title: '月度库存分析', icon: '', menu: true }
  },
  {
    path: '/supplier-evaluation-template-list',
    name: 'SupplierEvaluationTemplateList',
    component: SupplierEvaluationTemplateList,
    meta: { title: '供应商评价模板列表', icon: '', menu: true }
  },
  {
    path: '/supplier-evaluation-template-detail',
    name: 'SupplierEvaluationTemplateDetail',
    component: SupplierEvaluationTemplateDetail,
    meta: { title: '供应商评价模板详情', icon: '', menu: true }
  },
  {
    path: '/supplier-evaluation-list',
    name: 'SupplierEvaluationList',
    component: SupplierEvaluationList,
    meta: { title: '供应商评价单列表', icon: '', menu: true }
  },
  {
    path: '/supplier-evaluation-detail',
    name: 'SupplierEvaluationDetail',
    component: SupplierEvaluationDetail,
    meta: { title: '供应商评价单详情', icon: '', menu: true }
  },
  {
    path: '/packing-list-detail',
    name: 'PackingListDetail',
    component: PackingListDetail,
    meta: { title: '装箱单详情', icon: '', menu: true }
  },
  {
    path: '/document-creation-detail',
    name: 'DocumentCreationDetail',
    component: DocumentCreationDetail,
    meta: { title: '文件做成', icon: '', menu: true }
  },
  {
    path: '/packing-list-page',
    name: 'PackingListPage',
    component: PackingListPage,
    meta: { title: 'Packing List', icon: '', menu: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export { routes }
export default router
