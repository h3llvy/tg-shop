<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Импортируем компоненты иконок
import IconStore from './icons/IconStore.vue'
import IconGift from './icons/IconGift.vue'
import IconLeaderboard from './icons/IconLeaderboard.vue'
import IconProfile from './icons/IconProfile.vue'

const route = useRoute()
const router = useRouter()

const currentRoute = computed(() => route.name)

const navigate = async (_routeName: string) => {
  try {
    if (_routeName !== currentRoute.value) {
      await router.push({ name: _routeName })
    }
  } catch (error) {
    console.error('Ошибка навигации:', error)
  }
}

const menuItems = [
  { name: 'store', icon: IconStore, label: 'Store' },
  { name: 'gifts', icon: IconGift, label: 'Gifts' },
  { name: 'leaderboard', icon: IconLeaderboard, label: 'Leaderboard' },
  { name: 'profile', icon: IconProfile, label: 'Profile' }
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
        <!-- Используем компонент иконки -->
        <component 
          :is="item.icon"
          :color="currentRoute === item.name ? '#007AFF' : '#959595'"
          class="w-[26px] h-[26px]"
        />
        
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
