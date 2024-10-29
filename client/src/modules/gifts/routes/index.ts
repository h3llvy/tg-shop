import type { RouteRecordRaw } from 'vue-router'
import { defineAsyncComponent } from 'vue'
import GiftsSkeleton from '../components/GiftsSkeleton.vue'

export const giftRoutes: RouteRecordRaw[] = [
  {
    path: '/gifts',
    name: 'gifts',
    component: defineAsyncComponent({
      loader: () => import('../pages/GiftsPage.vue'),
      loadingComponent: GiftsSkeleton
    }),
    meta: { title: 'My Gifts' }
  }
]
