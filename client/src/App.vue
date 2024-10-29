<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { viewport } from '@telegram-apps/sdk-vue'
import { telegramService } from '@/shared/services/telegram/telegramService'
import BottomNavigation from './shared/components/BottomNavigation.vue'

// Получаем текущий маршрут
const route = useRoute()

// Сигнал для темной темы через SDK
const isDarkTheme = computed(() => {
  return telegramService.webApp.colorScheme === 'dark'
})

// Скрываем навигацию на определенных страницах
const p_hideNavigation = computed(() => {
  return ['gift-details', 'payment'].includes(route.name as string)
})

// Монтируем и расширяем viewport
viewport.mount()
viewport.expand()
</script>

<template>
  <div 
    class="app" 
    :class="[
      { 'dark': isDarkTheme }, 
      { 'pb-[49px]': !p_hideNavigation }
    ]"
  >
    <router-view />
    <BottomNavigation v-if="!p_hideNavigation" />
  </div>
</template>

<style>
.app {
  min-height: 100vh;
  background-color: var(--tg-theme-bg-color, #fff);
  color: var(--tg-theme-text-color, #000);
}

.dark {
  background-color: var(--tg-theme-secondary-bg-color, #000);
  color: var(--tg-theme-text-color, #fff);
}
</style>
