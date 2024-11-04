<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { profileService } from '@/modules/profile/services/profileService'
import { telegramService } from '@/shared/services/telegram/telegramService'
import { 
  SunIcon, 
  MoonIcon,
  StarIcon,
  ChevronRightIcon,
  GiftIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

interface ICachedAvatar {
  url: string
  timestamp: number
}

interface IGiftFrom {
  name: string
  avatar: string
}

interface IProfileGift {
  id: string
  from: IGiftFrom
  count: string
  name: string
}

const CACHE_DURATION = 24 * 60 * 60 * 1000
const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-purple-500'
]

const isDarkTheme = ref(false)
const isEnglish = ref(true)
const avatarUrl = ref('')
const avatarLoading = ref(false)
const avatarError = ref(false)

const user = ref({
  id: 0,
  name: '',
  giftsReceived: 128,
  isPremium: false
})

const gifts = ref<IProfileGift[]>([
  {
    id: '1',
    from: {
      name: 'Alice',
      avatar: 'https://i.pravatar.cc/40?u=1'
    },
    count: '1 of 10K',
    name: 'Green Star'
  },
  {
    id: '2',
    from: {
      name: 'Bob',
      avatar: 'https://i.pravatar.cc/40?u=2'
    },
    count: '2 of 10K',
    name: 'Red Star'
  },
  {
    id: '3',
    from: {
      name: 'Charlie',
      avatar: 'https://i.pravatar.cc/40?u=3'
    },
    count: '3 of 10K',
    name: 'Blue Star'
  }
])

const getInitials = (_name: string): string => {
  return _name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
}

const getRandomColor = (_name: string): string => {
  const index = _name
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return AVATAR_COLORS[index % AVATAR_COLORS.length]
}

const getCachedAvatarAsync = (_userId: number): string | null => {
  const cached = localStorage.getItem(`avatar_${_userId}`)
  if (!cached) return null

  const { url, timestamp } = JSON.parse(cached) as ICachedAvatar
  return Date.now() - timestamp < CACHE_DURATION ? url : null
}

const cacheAvatarAsync = (_userId: number, _url: string): void => {
  const cacheData: ICachedAvatar = {
    url: _url,
    timestamp: Date.now()
  }
  localStorage.setItem(`avatar_${_userId}`, JSON.stringify(cacheData))
}

const initUserProfileAsync = async (): Promise<void> => {
  const telegramUser = telegramService.user
  if (!telegramUser) {
    console.error('Не удалось получить данные пользователя Telegram')
    return
  }

  user.value = {
    id: telegramUser.id,
    name: `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim(),
    giftsReceived: 128,
    isPremium: false
  }

  const cachedUrl = getCachedAvatarAsync(user.value.id)
  if (cachedUrl) {
    avatarUrl.value = cachedUrl
    return
  }

  try {
    avatarLoading.value = true
    console.log('Запрашиваем аватар для пользователя:', user.value.id)
    const url = await profileService.getUserAvatarAsync(user.value.id)
    console.log('Получен URL аватара:', url)
    
    if (url) {
      avatarUrl.value = url
      cacheAvatarAsync(user.value.id, url)
    }
  } catch (error) {
    console.error('Не удалось загрузить аватар:', error)
    avatarError.value = true
  } finally {
    avatarLoading.value = false
  }
}

const toggleTheme = (): void => {
  isDarkTheme.value = !isDarkTheme.value
}

const toggleLanguage = (): void => {
  isEnglish.value = !isEnglish.value
}

onMounted(async () => {
  isDarkTheme.value = telegramService.webApp.colorScheme === 'dark'
  await initUserProfileAsync()
})
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <div class="px-4 py-3 flex items-center justify-between">
      <div class="bg-bg-primary-light dark:bg-bg-primary-dark rounded-full flex items-center p-0.5">
        <button 
          @click="toggleTheme"
          class="p-2 rounded-full transition-colors"
          :class="!isDarkTheme ? 'bg-bg-secondary-light shadow-sm' : 'text-label-secondary-light dark:text-label-secondary-dark'"
        >
          <SunIcon class="w-5 h-5" />
        </button>
        <button 
          @click="toggleTheme"
          class="p-2 rounded-full transition-colors"
          :class="isDarkTheme ? 'bg-bg-secondary-dark shadow-sm' : 'text-label-secondary-light dark:text-label-secondary-dark'"
        >
          <MoonIcon class="w-5 h-5" />
        </button>
      </div>

      <div class="relative">
        <div class="w-20 h-20 rounded-full overflow-hidden ring-4 ring-bg-secondary-light dark:ring-bg-secondary-dark">
          <img 
            v-if="avatarUrl" 
            :src="avatarUrl" 
            :alt="user.name"
            class="w-full h-full object-cover"
          >
          <div 
            v-else 
            :class="[
              'w-full h-full flex items-center justify-center',
              getRandomColor(user.name)
            ]"
          >
            <span v-if="!avatarLoading" class="text-xl font-bold text-white">
              {{ getInitials(user.name) }}
            </span>
            <span v-else class="text-white">Загрузка...</span>
          </div>
        </div>
        <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-label-secondary-light dark:bg-label-secondary-dark rounded-full px-3 py-0.5 ring-2 ring-bg-secondary-light dark:ring-bg-secondary-dark">
          <span class="text-xs text-white font-medium">#160</span>
        </div>
      </div>

      <div class="bg-bg-primary-light dark:bg-bg-primary-dark rounded-full flex items-center p-0.5">
        <button 
          @click="toggleLanguage"
          class="px-3 py-1 rounded-full transition-colors"
          :class="isEnglish ? 'bg-bg-secondary-light dark:bg-bg-secondary-dark shadow-sm' : 'text-label-secondary-light dark:text-label-secondary-dark'"
        >
          EN
        </button>
        <button 
          @click="toggleLanguage"
          class="px-3 py-1 rounded-full transition-colors"
          :class="!isEnglish ? 'bg-bg-secondary-light dark:bg-bg-secondary-dark shadow-sm' : 'text-label-secondary-light dark:text-label-secondary-dark'"
        >
          RU
        </button>
      </div>
    </div>

    <div class="px-4">
      <div class="text-center mt-2 mb-4">
        <div class="flex items-center justify-center gap-2">
          <h2 class="text-[20px] font-bold text-label-primary-light dark:text-label-primary-dark">
            {{ user.name }}
          </h2>
          <StarIcon 
            v-if="user.isPremium" 
            class="w-5 h-5 text-primary-light dark:text-primary-dark" 
          />
        </div>
        <p class="mt-1 text-[15px] text-label-date-light dark:text-label-date-dark">
          {{ user.giftsReceived }} подарков получено
        </p>
      </div>
      
      <div class="flex justify-center items-center py-3">
        <div class="flex items-center gap-2 text-primary-light dark:text-primary-dark">
          <ClockIcon class="w-5 h-5" />
          <span class="text-[17px] font-medium">Недавние действия</span>
          <ChevronRightIcon class="w-5 h-5 ml-1" />
        </div>
      </div>

      <div class="grid grid-cols-3 gap-2 mt-4">
        <div 
          v-for="gift in gifts" 
          :key="gift.id"
          class="relative bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl p-3 aspect-square"
        >
          <img 
            :src="gift.from.avatar" 
            :alt="gift.from.name"
            class="absolute top-2 left-2 w-6 h-6 rounded-full"
          >
          <p class="text-xs text-label-date-light dark:text-label-date-dark text-right">
            {{ gift.count }}
          </p>
          <div class="flex items-center justify-center h-full">
            <GiftIcon class="w-12 h-12 text-primary-light dark:text-primary-dark" />
          </div>
          <p class="absolute bottom-2 left-0 right-0 text-sm text-center text-label-primary-light dark:text-label-primary-dark truncate px-2">
            {{ gift.name }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
