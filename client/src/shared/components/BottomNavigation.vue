<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ShoppingBagIcon,
  GiftIcon,
  GlobeAltIcon,
  UserIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()

const currentRoute = computed(() => route.name)

const navigate = async (routeName: string) => {
  try {
    if (routeName !== currentRoute.value) {
      await router.push({ name: routeName })
    }
  } catch (error) {
    console.error('Ошибка навигации:', error)
  }
}

const menuItems = [
  { name: 'store', icon: ShoppingBagIcon, label: 'Store' },
  { name: 'gifts', icon: GiftIcon, label: 'My Gifts' },
  { name: 'leaderboard', icon: GlobeAltIcon, label: 'Leaderboard' },
  { name: 'profile', icon: UserIcon, label: 'Profile' }
]
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-bg-secondary-light dark:bg-bg-secondary-dark border-t border-separator-light dark:border-separator-dark">
    <div class="flex justify-around h-[49px]">
      <button
        v-for="item in menuItems"
        :key="item.name"
        class="flex-1 flex flex-col items-center justify-center"
        :class="{
          'text-accent-primary-light dark:text-accent-primary-dark': currentRoute === item.name,
          'text-label-secondary-light dark:text-label-secondary-dark': currentRoute !== item.name
        }"
        @click="navigate(item.name)"
      >
        <component 
          :is="item.icon" 
          class="w-6 h-6"
        />
        <span class="text-[10px] mt-0.5">{{ item.label }}</span>
      </button>
    </div>
  </nav>
</template>
