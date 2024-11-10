<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Импортируем SVG иконки
import StoreIcon from '@/shared/assets/Store.svg'
import GiftIcon from '@/shared/assets/Gift.svg'
import LeaderboardIcon from '@/shared/assets/Leaderbord.svg'
import ProfileIcon from '@/shared/assets/Profile.svg'

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
  { name: 'store', icon: StoreIcon, label: 'Store' },
  { name: 'gifts', icon: GiftIcon, label: 'Gifts' },
  { name: 'leaderboard', icon: LeaderboardIcon, label: 'Leaderboard' },
  { name: 'profile', icon: ProfileIcon, label: 'Profile' }
]
</script>

<template>
  <nav 
    class="fixed bottom-0 left-0 right-0 z-50 flex justify-center items-start self-stretch bg-white dark:bg-black border-t border-[#3C3C4326] dark:border-[#545458A6]"
  >
    <div class="flex justify-around w-full">
      <button
        v-for="item in menuItems"
        :key="item.name"
        class="flex flex-col items-center pt-[7px] min-w-[70px] transition-colors duration-200"
        :class="{
          'text-[#007AFF]': currentRoute === item.name,
          'text-[#545458A6]': currentRoute !== item.name
        }"
        @click="navigate(item.name)"
      >
        <!-- Иконка -->
        <img 
          :src="item.icon" 
          class="w-[26px] h-[26px]"
          :class="{
            'opacity-100 [&>*]:fill-[#007AFF]': currentRoute === item.name,
            'opacity-65': currentRoute !== item.name
          }"
        />
        
        <!-- Текст -->
        <span 
          class="text-[10px] font-['SF_Pro_Text'] font-medium tracking-[0.1px]"
        >
          {{ item.label }}
        </span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
/* Добавляем SF Pro Text если нужно */
@font-face {
  font-family: 'SF Pro Text';
  src: url('@/shared/assets/fonts/SF-Pro-Text-Medium.otf') format('opentype');
  font-weight: 500;
  font-style: normal;
}
</style>
