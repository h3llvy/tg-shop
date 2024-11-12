import type { RouteRecordRaw } from 'vue-router'
import { defineAsyncComponent } from 'vue'
import ProfileSkeleton from '../components/ProfileSkeleton.vue'

export const profileRoutes: RouteRecordRaw[] = [
  {
    path: '/profile',
    name: 'profile',
    component: defineAsyncComponent({
      loader: () => import('../pages/ProfilePage.vue'),
      loadingComponent: ProfileSkeleton
    }),
    meta: { title: 'Профиль' }
  },
  {
    path: '/profile/user/:id',
    name: 'user-profile',
    component: defineAsyncComponent({
      loader: () => import('../pages/ProfilePage.vue'),
      loadingComponent: ProfileSkeleton
    }),
    props: true,
    meta: { title: 'Профиль пользователя' }
  }
]