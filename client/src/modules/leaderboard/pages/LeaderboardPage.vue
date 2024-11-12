<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useLeaderboardStore } from '../stores/leaderboardStore'
import { MagnifyingGlassIcon, GiftIcon } from '@heroicons/vue/24/outline'
import { profileService } from '@/modules/profile/services/profileService'

const searchQuery = ref('')
const store = useLeaderboardStore()
const { users } = storeToRefs(store)
const avatarCache = ref<Map<number, string>>(new Map())

// Константы для цветов аватаров (запасной вариант)
const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-purple-500'
]

// Вспомогательные функции
const getRandomColor = (_name: string): string => {
  const index = _name
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return AVATAR_COLORS[index % AVATAR_COLORS.length]
}

const getInitials = (_name: string): string => {
  return _name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
}

const getMedal = (_position: number): string | null => {
  const MEDALS = ['🥇', '🥈', '🥉']
  return _position <= 3 ? MEDALS[_position - 1] : null
}

// Загрузка аватара пользователя
const loadUserAvatar = async (userId: number) => {
  try {
    if (!avatarCache.value.has(userId)) {
      const avatarUrl = await profileService.getUserAvatarAsync(userId)
      if (avatarUrl) {
        avatarCache.value.set(userId, avatarUrl)
      }
    }
    return avatarCache.value.get(userId)
  } catch (error) {
    console.error('Ошибка загрузки аватара:', error)
    return null
  }
}

// Фильтрация пользователей по поиску
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user => 
    user.name.toLowerCase().includes(query)
  )
})

onMounted(async () => {
  await store.fetchLeaderboardAsync()
  // Загружаем аватары для первых 20 пользователей
  for (const user of users.value.slice(0, 20)) {
    await loadUserAvatar(user.id)
  }
})
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <!-- Поиск -->
    <div class="sticky top-0 z-10 bg-white dark:bg-gray-900 px-4 py-2">
      <div class="relative">
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="Поиск"
          class="w-full h-[36px] bg-[#F2F2F7] dark:bg-gray-800 rounded-[12px] pl-[32px] pr-4 text-[17px] placeholder-[#8E8E93]"
        >
        <MagnifyingGlassIcon class="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8E8E93]" />
      </div>
    </div>

    <!-- Список пользователей -->
    <div class="pb-[105px]">
      <div 
        v-for="user in filteredUsers" 
        :key="user.id"
        class="h-[72px] px-4 py-3 flex items-center justify-between border-b border-[rgba(60,60,67,0.1)] dark:border-gray-800"
      >
        <div class="flex items-center">
          <div class="w-12 h-12 rounded-full overflow-hidden mr-3">
            <img 
              v-if="avatarCache.get(user.id)" 
              :src="avatarCache.get(user.id)" 
              :alt="user.name"
              class="w-full h-full object-cover"
              @error="avatarCache.delete(user.id)"
            >
            <div 
              v-else 
              :class="[
                'w-full h-full flex items-center justify-center',
                getRandomColor(user.name)
              ]"
            >
              <span class="text-lg font-bold text-white">
                {{ getInitials(user.name) }}
              </span>
            </div>
          </div>
          <div>
            <div class="text-[17px] tracking-[-0.4px] font-medium text-gray-900 dark:text-white mb-1">
              {{ user.name }}
            </div>
            <div class="flex items-center gap-1">
              <GiftIcon class="w-4 h-4 text-[#0066FF]" />
              <span class="text-[15px] font-medium text-[#0066FF]">{{ user.giftsCount }}</span>
            </div>
          </div>
        </div>
        <div v-if="user.position && getMedal(user.position)" class="text-2xl w-6 text-center">
          {{ getMedal(user.position) }}
        </div>
        <span v-else class="text-[15px] font-medium text-[#8E8E93]">#{{ user.position }}</span>
      </div>
    </div>
  </div>
</template>