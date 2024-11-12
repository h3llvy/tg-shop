import type { RouteRecordRaw } from 'vue-router'

export const giftRoutes: RouteRecordRaw[] = [
  {
    path: '/gifts',
    name: 'gifts',
    component: () => import('../pages/PurchasedGiftsPage.vue'),
    meta: { title: 'Мои подарки' }
  }
]
