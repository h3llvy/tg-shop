import { createRouter, createWebHistory } from 'vue-router'
import { storeRoutes } from '@/modules/store/routes'
import { giftRoutes } from '@/modules/gifts/routes'
import { leaderboardRoutes } from '@/modules/leaderboard/routes'
import  GiftPurchasedPage  from '@/modules/store/pages/GiftPurchasedPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/store'
    },
    ...storeRoutes,
    ...giftRoutes,
    ...leaderboardRoutes,
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/modules/profile/pages/ProfilePage.vue')
    },
    {
      path: '/gift-purchased',
      name: 'gift-purchased',
      component: () => import('@/modules/store/pages/GiftPurchasedPage.vue')
    },
    {
      path: '/gifts/:id/purchased',
      name: 'GiftPurchased',
      component: GiftPurchasedPage,
      props: true,
      meta: {
        hideNavigation: true
      }
    }
  ]
})

export { router }
