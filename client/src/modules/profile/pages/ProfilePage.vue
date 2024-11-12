<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { telegramService } from '@/shared/services/telegram/telegramService'
import { profileService } from '../services/profileService'
import type { IUserProfile } from '@/shared/types/user'
import ProfileSkeleton from '../components/ProfileSkeleton.vue'

const user = ref<IUserProfile | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const avatarUrl = ref<string | null>(null)

const isDarkTheme = computed(() => {
  return telegramService.webApp?.colorScheme === 'dark' || false
})

const initProfileAsync = async () => {
  try {
    const telegramUser = telegramService.user
    if (!telegramUser) {
      error.value = 'Не удалось получить данные пользователя'
      return
    }

    // Получаем профиль с сервера
    user.value = await profileService.getUserProfileAsync()
    
    // Получаем аватар
    avatarUrl.value = await profileService.getUserAvatarAsync(telegramUser.id)
  } catch (err) {
    console.error('Ошибка загрузки профиля:', err)
    error.value = 'Не удалось загрузить профиль'
  } finally {
    loading.value = false
  }
}

onMounted(initProfileAsync)
</script>

<template>
  <div class="min-h-screen bg-bg-primary-light dark:bg-bg-primary-dark">
    <div v-if="loading">
      <ProfileSkeleton />
    </div>
    
    <div v-else-if="user" class="p-4">
      <!-- Профиль пользователя -->
      <div class="text-center">
        <!-- Аватар -->
        <div class="relative w-24 h-24 mx-auto mb-4">
          <img 
            v-if="avatarUrl"
            :src="avatarUrl"
            :alt="user.firstName"
            class="w-full h-full rounded-full object-cover"
          />
          <div 
            v-else 
            class="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
          >
            <span class="text-2xl font-bold text-gray-500">
              {{ user.firstName[0] }}
            </span>
          </div>
          <div 
            v-if="user.isPremium"
            class="absolute -bottom-1 right-0 bg-yellow-400 rounded-full p-1"
          >
            ⭐️
          </div>
        </div>

        <!-- Имя пользователя -->
        <h1 class="text-2xl font-bold text-label-primary-light dark:text-label-primary-dark">
          {{ user.firstName }} {{ user.lastName }}
        </h1>
        <p v-if="user.username" class="text-label-secondary-light dark:text-label-secondary-dark">
          @{{ user.username }}
        </p>

        <!-- Статистика -->
        <div class="mt-6 grid grid-cols-2 gap-4">
          <div class="bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-xl p-4">
            <p class="text-2xl font-bold text-label-primary-light dark:text-label-primary-dark">
              {{ user.giftsReceived }}
            </p>
            <p class="text-sm text-label-secondary-light dark:text-label-secondary-dark">
              Gifts Received
            </p>
          </div>
          <div class="bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-xl p-4">
            <p class="text-2xl font-bold text-label-primary-light dark:text-label-primary-dark">
              {{ user.giftsSent }}
            </p>
            <p class="text-sm text-label-secondary-light dark:text-label-secondary-dark">
              Gifts Sent
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="p-4 text-center text-red-500">
      {{ error }}
    </div>
  </div>
</template>
