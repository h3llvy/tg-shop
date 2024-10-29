import type { RouteRecordRaw } from 'vue-router'
import { defineAsyncComponent } from 'vue'
import StoreSkeleton from '../components/StoreSkeleton.vue'

export const storeRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'store',
    component: defineAsyncComponent({
      loader: () => import('../pages/StorePage.vue'),
      loadingComponent: StoreSkeleton
    }),
    meta: { title: 'Store' }
  },
  {
    path: '/gift/:id',
    name: 'gift-details',
    component: () => import('../pages/GiftDetailsPage.vue'),
    meta: { title: 'Gift Details' }
  }
]
