import type { RouteRecordRaw } from 'vue-router'

export const giftRoutes: RouteRecordRaw[] = [
  {
    path: '/gifts',
    name: 'gifts',
    component: () => import('../pages/UserGiftsPage.vue'),
    meta: { title: 'My Gifts' }
  }
]
