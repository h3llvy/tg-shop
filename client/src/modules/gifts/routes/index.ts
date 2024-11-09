import type { RouteRecordRaw } from 'vue-router'

export const giftRoutes: RouteRecordRaw[] = [
  {
    path: '/gifts',
    name: 'gifts',
    component: () => import('../pages/GiftsPage.vue'),
    meta: { title: 'My Gifts' }
  }
]
