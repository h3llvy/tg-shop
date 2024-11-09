import type { RouteRecordRaw } from 'vue-router'
import StorePage from '../pages/StorePage.vue'
import GiftDetailsPage from '../pages/GiftDetailsPage.vue'

export const storeRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'store',
    component: StorePage,
    meta: { title: 'Store' }
  },
  {
    path: '/gift/:id',
    name: 'gift-details',
    component: GiftDetailsPage,
    meta: { 
      title: 'Gift Details',
      hideNavigation: true
    }
  }
]
