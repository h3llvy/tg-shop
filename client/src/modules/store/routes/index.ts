import type { RouteRecordRaw } from 'vue-router'

export const storeRoutes: RouteRecordRaw[] = [
  {
    path: '/store',
    name: 'store',
    component: () => import('../pages/StorePage.vue'),
    meta: { title: 'Store' }
  },
  {
    path: '/store/gift/:id',
    name: 'gift-details',
    component: () => import('../pages/GiftDetailsPage.vue'),
    meta: { 
      title: 'Gift Details',
      hideNavigation: true
    }
  }
]
