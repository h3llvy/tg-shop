<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStoreStore } from '../stores/storeStore'
import type { IGift } from '../types/store'
import { paymentService } from '@/modules/payment/services/paymentService'

// Добавляем определение assetMap
const assetMap = {
  'Delicious Cake': 'USDT',
  'Red Star': 'TON',
  'Green Star': 'BTC',
  'Blue Star': 'ETH'
} as const

const route = useRoute()
const router = useRouter()
const store = useStoreStore()
const gift = ref<IGift | null>(null)
const isLoading = ref(true)
const isProcessing = ref(false)
const recentActions = ref([
  { 
    user: { name: 'Alicia', avatar: null },
    action: 'bought a gift',
    timestamp: new Date()
  }
])

const getGiftIcon = (category: string) => {
  switch (category) {
    case 'cakes':
      return '🎂'
    case 'stars':
      return '⭐'
    default:
      return '🎁'
  }
}

const getAvailabilityText = (quantity: number, soldCount: number) => {
  const available = quantity - soldCount
  return `${available} of ${quantity}`
}

const handlePurchase = async () => {
  if (!gift.value || isProcessing.value) return
  
  isProcessing.value = true
  try {
    const assetMap = {
      'Delicious Cake': 'USDT',
      'Red Star': 'TON',
      'Green Star': 'BTC',
      'Blue Star': 'ETH'
    } as const

    const asset = assetMap[gift.value.name] || 'USDT'
    
    await paymentService.createPaymentAsync(
      gift.value.prices[asset],
      gift.value._id,
      gift.value.name,
      asset
    )
    // Успешная оплата
    isProcessing.value = false
    // Показываем уведомление об успехе
    window.Telegram.WebApp.showPopup({
      title: 'Успешная покупка',
      message: `Вы успешно приобрели ${gift.value.name}!`,
      buttons: [{
        type: 'ok'
      }]
    })
  } catch (error) {
    console.error('Ошибка покупки:', error)
    isProcessing.value = false
    // Показываем ошибку пользователю
    window.Telegram.WebApp.showPopup({
      title: 'Ошибка',
      message: error.message,
      buttons: [{
        type: 'ok'
      }]
    })
  }
}

// Создаем функцию для обработки нажатия кнопки назад
const handleBackClick = () => {
  router.back()
}

onMounted(async () => {
  try {
    // Получаем WebApp
    const webApp = window.Telegram?.WebApp
    if (!webApp) {
      console.error('Telegram WebApp не доступен')
      return
    }

    // Показываем кнопку назад и добавляем обработчик
    webApp.BackButton.show()
    webApp.BackButton.onClick(handleBackClick)
    console.log('BackButton настроен:', webApp.BackButton.isVisible) // Для отладки

    // Загружаем данные подарка
    const giftId = route.params.id as string
    const cachedGift = store.getGiftById(giftId)
    
    if (cachedGift) {
      gift.value = cachedGift
      isLoading.value = false
    } else {
      gift.value = await store.fetchGiftByIdAsync(giftId)
    }
  } catch (error) {
    console.error('Ошибка загрузки подарка:', error)
  } finally {
    isLoading.value = false
  }
})

onUnmounted(() => {
  // Убираем обработчик и скрываем кнопку при уходе со страницы
  const webApp = window.Telegram?.WebApp
  if (webApp?.BackButton) {
    webApp.BackButton.offClick(handleBackClick) // Важно: удаляем именно тот обработчик, который добавили
    webApp.BackButton.hide()
    console.log('BackButton удален:', !webApp.BackButton.isVisible) // Для отладки
  }
})
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <div v-if="isLoading" class="p-4">
      <div class="animate-pulse">
        <div class="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg mb-4"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
      </div>
    </div>

    <div v-else-if="gift" class="relative">
      <!-- Фон по��арка -->
      <div 
        class="h-64 flex items-center justify-center"
        :class="gift.bgColor"
      >
        <span class="text-8xl">{{ getGiftIcon(gift.category) }}</span>
      </div>

      <!-- Информация о подарке -->
      <div class="p-4">
        <div class="flex justify-between items-center mb-2">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ gift.name }}
          </h1>
          <div class="px-3 py-1 bg-blue-500 text-white rounded-full">
            {{ gift.prices[assetMap[gift.name]] }} {{ assetMap[gift.name] }}
          </div>
        </div>

        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ gift.description }}
        </p>

        <div class="flex justify-between items-center mb-6">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ getAvailabilityText(gift.quantity, gift.soldCount) }}
          </div>
          <div class="text-sm font-medium text-blue-500">
            {{ gift.rarity }}
          </div>
        </div>

        <!-- История действий -->
        <div class="border-t border-gray-200 dark:border-gray-800 pt-4">
          <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Recently Actions
          </h2>
          <div 
            v-for="(action, index) in recentActions" 
            :key="index"
            class="flex items-center py-2"
          >
            <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
              {{ action.user.name[0] }}
            </div>
            <div>
              <span class="font-medium text-gray-900 dark:text-white">{{ action.user.name }}</span>
              <span class="text-gray-500 dark:text-gray-400"> {{ action.action }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Кнопка покупки -->
      <div class="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <button
          class="w-full py-3 bg-blue-500 text-white rounded-lg font-medium"
          @click="handlePurchase"
          :disabled="isProcessing"
        >
          <span v-if="isProcessing" class="flex items-center justify-center">
            <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <!-- SVG loader -->
            </svg>
            Processing...
          </span>
          <span v-else>Buy a Gift</span>
        </button>
      </div>
    </div>

    <div v-else class="p-4 text-center text-gray-500 dark:text-gray-400">
      Gift not found
    </div>
  </div>
</template>