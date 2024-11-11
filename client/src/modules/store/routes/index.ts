import type { RouteRecordRaw } from 'vue-router'
import StorePage from '../pages/StorePage.vue'
import StoreGiftPage from '../pages/StoreGiftPage.vue'

export const storeRoutes: RouteRecordRaw[] = [
  {
    path: '/store',
    name: 'store',
    component: StorePage,
    meta: { title: 'Store' }
  },
  {
    path: '/store/gift/:id',
    name: 'gift-details',
    component: StoreGiftPage,
    meta: { 
      title: 'Gift Details',
      hideNavigation: true
    }
  }
]
