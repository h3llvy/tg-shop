<script setup lang="ts">
import { computed } from 'vue'
import { telegramService } from '@/shared/services/telegram/telegramService'

const isDarkTheme = computed(() => {
  return telegramService.webApp?.colorScheme === 'dark' || false
})

const user = computed(() => {
  return telegramService.webApp?.initDataUnsafe?.user || null
})
</script>

<template>
  <div class="min-h-screen" :class="{ 'dark': isDarkTheme }">
    <div v-if="user" class="p-4">
      <!-- Профиль пользователя -->
      <div class="text-center">
        <h1 class="text-2xl font-bold">
          {{ user.first_name }} {{ user.last_name }}
        </h1>
        <p v-if="user.username" class="text-gray-600">
          @{{ user.username }}
        </p>
      </div>
    </div>
    <div v-else class="p-4 text-center">
      <p>Загрузка профиля...</p>
    </div>
  </div>
</template>
