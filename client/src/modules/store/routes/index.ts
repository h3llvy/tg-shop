import { defineAsyncComponent } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import StoreSkeleton from '../components/StoreSkeleton.vue'

const StorePage = defineAsyncComponent({
  loader: () => import('../pages/StorePage.vue'),
  loadingComponent: StoreSkeleton,
  delay: 0,
  timeout: 10000,
  suspensible: false,
  onError(error, retry, fail) {
    console.error('Ошибка загрузки компонента:', error)
    fail()
  }
})

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
    component: () => import('../pages/StoreGiftPage.vue'),
    meta: { 
      title: 'Gift Details',
      hideNavigation: true
    }
  }
]
