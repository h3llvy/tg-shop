<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import type { IUserGift } from '@/modules/gifts/types/userGift'
import { getGiftIcon } from '@/shared/utils/giftIcons'
import { telegramService } from '@/shared/services/telegram/telegramService'
import { useRouter } from 'vue-router'
import { loadUserAvatarAsync, getUserAvatar } from '@/shared/composables/useUserAvatars'

const props = defineProps<{
  userGift: IUserGift
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const router = useRouter()
const tg = window.Telegram?.WebApp

// Форматируем дату в нужный формат
const formattedDate = computed(() => {
  if (!props.userGift.purchaseDate) return ''
  const date = new Date(props.userGift.purchaseDate)
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(',', ' at')
})

// Определяем, является ли текущий пользователь отправителем
const isCurrentUser = computed(() => {
  return props.userGift.userId === telegramService.user?.id
})

// Обработчик клика по аватару
const handleAvatarClick = () => {
  if (isCurrentUser.value) {
    router.push({ name: 'profile' })
    emit('close')
  }
  // Здесь можно добавить логику для перехода на профиль другого пользователя
}

onMounted(() => {
  if (tg) {
    // Скрываем нижнюю навигацию
    tg.MainButton.setText('Close')
    tg.MainButton.show()
    tg.MainButton.onClick(() => emit('close'))
  }
})

onUnmounted(() => {
  if (tg) {
    tg.MainButton.hide()
    tg.MainButton.offClick()
  }
})
</script>

<template>
  <div 
    class="fixed inset-0 bg-black/50 z-40"
    @click="emit('close')"
  />
  <div class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl p-4 z-50">
    <!-- Подарок -->
    <div class="flex items-center gap-4 mb-4">
      <img 
        :src="getGiftIcon(userGift.gift.name)"
        :alt="userGift.gift.name"
        class="w-16 h-16"
      />
      <div>
        <h3 class="font-medium">{{ userGift.gift.name }}</h3>
      </div>
    </div>

    <!-- Информация -->
    <div class="space-y-4">
      <!-- От кого -->
      <div class="flex items-center gap-3">
        <div 
          class="w-10 h-10 rounded-full bg-gray-200 cursor-pointer"
          @click="handleAvatarClick"
        >
          <img 
            v-if="userGift.fromUserAvatar"
            :src="userGift.fromUserAvatar"
            :alt="userGift.fromUserName"
            class="w-full h-full rounded-full object-cover"
          />
          <div 
            v-else
            class="w-full h-full rounded-full flex items-center justify-center bg-gray-200 text-gray-600"
          >
            {{ userGift.fromUserName?.[0] }}
          </div>
        </div>
        <div>
          <div class="text-sm text-gray-500">From</div>
          <div class="font-medium">{{ userGift.fromUserName }}</div>
        </div>
      </div>

      <!-- Дата -->
      <div>
        <div class="text-sm text-gray-500">Date</div>
        <div>{{ formattedDate }}</div>
      </div>

      <!-- Цена -->
      <div>
        <div class="text-sm text-gray-500">Price</div>
        <div class="flex items-center gap-2">
          <span>{{ userGift.purchasePrice }}</span>
          <span>{{ userGift.purchaseAsset }}</span>
        </div>
      </div>

      <!-- Доступность -->
      <div>
        <div class="text-sm text-gray-500">Availability</div>
        <div>{{ userGift.serialNumber }} of {{ userGift.totalAvailable }}</div>
      </div>
    </div>
  </div>
</template> 