import type { RouteRecordRaw } from 'vue-router/dist/vue-router'
import { defineAsyncComponent } from 'vue'
import LeaderboardSkeleton from '../components/LeaderboardSkeleton.vue'

export const leaderboardRoutes: RouteRecordRaw[] = [
  {
    path: '/leaderboard',
    name: 'leaderboard',
    component: defineAsyncComponent({
      loader: () => import('../pages/LeaderboardPage.vue'),
      loadingComponent: LeaderboardSkeleton
    }),
    meta: { title: 'Лидерборд' }
  }
]