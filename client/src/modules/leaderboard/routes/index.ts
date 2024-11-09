import type { RouteRecordRaw } from 'vue-router'

export const leaderboardRoutes: RouteRecordRaw[] = [
  {
    path: '/leaderboard',
    name: 'leaderboard',
    component: () => import('../pages/LeaderboardPage.vue'),
    meta: { title: 'Лидерборд' }
  }
]