import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { storeRoutes } from '@/modules/store/routes'
import { giftRoutes } from '@/modules/gifts/routes'
import { leaderboardRoutes } from '@/modules/leaderboard/routes'
import { profileRoutes } from '@/modules/profile/routes'

// Объединяем все маршруты
const routes: RouteRecordRaw[] = [
  ...storeRoutes,
  ...giftRoutes,
  ...leaderboardRoutes,
  ...profileRoutes
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

// Глобальные хуки для управления заголовком страницы
router.afterEach((to) => {
  document.title = `${to.meta.title || 'Gift Shop'}`
})
