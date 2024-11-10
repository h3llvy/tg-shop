<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { telegramService } from '@/shared/services/telegram/telegramService'
import { authService } from '@/shared/services/auth/authService'
import { webSocketService } from '@/shared/services/websocket/websocketService'
import BottomNavigation from './shared/components/BottomNavigation.vue'

const route = useRoute()
const tg = window.Telegram?.WebApp

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

    // Подключаем Socket.IO если есть пользователь
    if (tg?.initDataUnsafe?.user?.id) {
      const userId = tg.initDataUnsafe.user.id
      console.log('Подключение Socket.IO для пользователя:', userId)
      
      // Подключаемся к Socket.IO серверу
      webSocketService.connect(userId)
      
      // Слушаем системные события Socket.IO
      webSocketService.onConnect(() => {
        console.log('Socket.IO подключен')
      })
      
      webSocketService.onDisconnect((reason) => {
        console.log('Socket.IO отключен:', reason)
      })
      
      webSocketService.onError((error) => {
        console.error('Ошибка Socket.IO:', error)
      })
    } else {
      console.warn('Нет данных пользователя для Socket.IO подключения')
    }
  } catch (error) {
    console.error('Ошибка инициализации:', error)
  }
})

onUnmounted(() => {
  webSocketService.disconnect()
})
</script>

<template>
  <div 
    class="app overflow-y-auto overflow-x-hidden" 
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
html, body {
  margin: 0;
  padding: 0;
  overflow: hidden; /* Скрываем скролл на body */
  height: 100%;
}

.app {
  height: 100vh;
  background-color: var(--tg-theme-bg-color, #fff);
  color: var(--tg-theme-text-color, #000);
  /* Добавляем стили для скролла */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

/* Скрываем скролл для WebKit браузеров */
.app::-webkit-scrollbar {
  display: none;
}

.dark {
  background-color: var(--tg-theme-secondary-bg-color, #000);
  color: var(--tg-theme-text-color, #fff);
}
</style>