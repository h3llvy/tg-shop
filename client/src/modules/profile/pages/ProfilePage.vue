<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { telegramService } from '@/shared/services/telegram/telegramService'
import { profileService } from '../services/profileService'
import type { IUserProfile } from '@/shared/types/user'
import ProfileSkeleton from '../components/ProfileSkeleton.vue'
import GiftsHistory from '../components/GiftsHistory.vue'
import { useTheme } from '@/shared/composables/useTheme'
import { useI18n } from '@/shared/composables/useI18n'
import { useUserAvatars } from '@/shared/composables/useUserAvatars'
import SunIcon from '@/shared/assets/icons/Sun.svg'
import MoonIcon from '@/shared/assets/icons/Moon.svg'
import ClockIcon from '@/shared/assets/icons/clock.svg'
import PremIcon from '@/shared/assets/icons/Prem.svg'
import { useRouter } from 'vue-router'
import ThemeToggle from '@/shared/components/ThemeToggle.vue'
import LangToggle from '@/shared/components/LangToggle.vue'

const user = ref<IUserProfile | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const avatarUrl = ref<string | null>(null)

const { toggleTheme, isDarkTheme } = useTheme()
const { toggleLanguage, currentLanguage } = useI18n()

const router = useRouter()

const { 
  loadUserAvatarAsync, 
  getUserAvatar, 
  getUserInitials,
  getAvatarBackgroundColor 
} = useUserAvatars()

const initProfileAsync = async () => {
  try {
    const telegramUser = telegramService.user
    if (!telegramUser) {
      error.value = 'Не удалось получить данные пользователя'
      return
    }

    // Получаем полный профиль с подарками
    const { profile, gifts } = await profileService.getFullProfileAsync()
    user.value = profile
    
    // Получаем аватар
    avatarUrl.value = await profileService.getUserAvatarAsync(telegramUser.id)
  } catch (err) {
    console.error('Ошибка загрузки профиля:', err)
    error.value = 'Не удалось загрузить профиль'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await initProfileAsync()
  if (user.value?.telegramId) {
    await loadUserAvatarAsync(user.value.telegramId)
  }
})

// Вычисляем позицию в лидерборде
const leaderboardPosition = computed(() => {
  return user.value?.giftsReceived || 0
})

// Форматируем количество подарков
const formatGiftsCount = (count: number) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

const handleRecentActionsClick = () => {
  router.push({ name: 'user-history', params: { id: user.value?.telegramId } })
}

const sortedGifts = computed(() => {
  if (!user.value?.gifts) return []
  
  return user.value.gifts
    .filter(gift => gift && gift.gift && gift._id)
    .sort((a, b) => {
      return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
    })
})
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-bg-primary-dark">
    <div v-if="loading">
      <ProfileSkeleton />
    </div>
    
    <div v-else-if="user" class="flex flex-col items-center">
      <!-- Верхняя панель -->
      <div class="flex justify-between items-center px-4 pt-4">
        <!-- Переключатель темы -->
        <div class="absolute left-4 top-4">
          <ThemeToggle />
        </div>

        <!-- Аватар с позицией -->
        <div class="mx-auto relative pt-4">
          <div class="w-[100px] h-[100px] rounded-full overflow-hidden">
            <img 
              v-if="avatarUrl"
              :src="avatarUrl"
              :alt="user?.firstName"
              class="w-full h-full object-cover"
            />
            <div 
              v-else 
              class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
            >
              <span class="text-2xl font-bold">{{ user?.firstName?.[0] }}</span>
            </div>
          </div>
          <!-- Позиция в лидерборде -->
          <div 
            class="absolute -bottom-3 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-[#8E8E93] rounded-full border-2 border-white dark:border-black backdrop-blur-[25px]"
          >
            <span class="text-white text-xs font-medium">
              #{{ leaderboardPosition }}
            </span>
          </div>
        </div>

        <!-- Переключатель языка -->
        <div class="absolute right-4 top-4">
          <LangToggle />
        </div>
      </div>

      <!-- Информация о пользователе -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center gap-1.5">
          <h1 class="text-2xl font-semibold tracking-[-0.43px]">
            {{ user.firstName }}
          </h1>
          <img 
            v-if="user.isPremium"
            :src="PremIcon"
            alt="Premium"
            class="w-6 h-6"
          />
        </div>
        <p class="text-[17px] text-[#8E8E93] tracking-[-0.442px] mt-1">
          {{ user.giftsReceived }} gifts received
        </p>
      </div>

      <!-- Кнопка Recent Actions -->
      <button 
        class="flex items-center gap-2 mb-6 text-[#007AFF]"
        @click="handleRecentActionsClick"
      >
        <img :src="ClockIcon" alt="Recent" class="w-5 h-5" />
        <span class="text-[17px] font-medium">Recent Actions ›</span>
      </button>

      <!-- Сетка подарков -->
      <div class="grid grid-cols-3 gap-4">
        <div 
          v-for="gift in sortedGifts"
          :key="gift._id"
          class="w-[115px] h-[160px] rounded-xl bg-[#EFEFF3] dark:bg-[#1C1C1E] relative p-2"
        >
          <!-- Аватар отправителя -->
          <div class="absolute top-2 left-2 w-4 h-4 rounded-full overflow-hidden">
            <img 
              v-if="getUserAvatar(gift.userId)"
              :src="getUserAvatar(gift.userId)"
              :alt="gift.fromUserName"
              class="w-full h-full object-cover"
            />
            <div 
              v-else
              class="w-full h-full flex items-center justify-center text-[8px] text-white"
              :style="{ backgroundColor: getAvatarBackgroundColor(gift.userId) }"
            >
              {{ getUserInitials(gift.fromUserName || '') }}
            </div>
          </div>

          <!-- Номер подарка -->
          <div class="absolute top-2 right-2 text-[10px] text-[#8E8E93]">
            {{ gift.serialNumber }} of {{ formatGiftsCount(gift.totalAvailable) }}
          </div>

          <!-- Иконка подарка -->
          <div class="flex justify-center items-center h-20 mt-6">
            <img 
              :src="getGiftIcon(gift.gift.name)"
              :alt="gift.gift.name"
              class="w-20 h-20 object-contain"
            />
          </div>

          <!-- Название подарка -->
          <div class="text-center mt-5">
            <h3 class="text-sm font-medium tracking-[-0.442px]">
              {{ gift.gift.name }}
            </h3>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="text-center text-red-500">
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
@font-face {
  font-family: 'SF Pro Text';
  src: url('@/shared/assets/fonts/SF-Pro-Text-Medium.otf') format('opentype');
  font-weight: 500;
  font-style: normal;
}
</style>
