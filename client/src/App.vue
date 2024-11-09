<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { telegramService } from '@/shared/services/telegram/telegramService'
import { authService } from '@/shared/services/auth/authService'
import BottomNavigation from './shared/components/BottomNavigation.vue'

const route = useRoute()

const isDarkTheme = computed(() => {
  return telegramService.colorScheme === 'dark'
})

const p_hideNavigation = computed(() => {
  return route.meta.hideNavigation === true
})

onMounted(async () => {
  try {
    // Инициализируем Telegram WebApp
    telegramService.init()
    console.log('Telegram WebApp инициализирован')
    
    // Авторизуемся
    await authService.loginAsync()
  } catch (error) {
    console.error('Ошибка инициализации:', error)
  }
})
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
