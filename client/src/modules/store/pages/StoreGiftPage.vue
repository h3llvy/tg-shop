<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { giftService } from '@/modules/gifts/services/giftService'
import { giftHistoryService } from '@/modules/gifts/services/giftHistoryService'
import { paymentService } from '@/modules/payment/services/paymentService'
import { webSocketService } from '@/shared/services/websocket/websocketService'
import { getGiftIcon } from '@/shared/utils/giftIcons'
import type { IGift } from '@/modules/gifts/types/gift'
import type { IGiftHistory } from '@/modules/gifts/types/giftHistory'

const route = useRoute()
const router = useRouter()
const tg = window.Telegram?.WebApp

const gift = ref<IGift | null>(null)
const history = ref<IGiftHistory[]>([])
const isLoading = ref(true)
const isProcessing = ref(false)
const error = ref<string | null>(null)

const assetMap = {
  'Delicious Cake': 'USDT',
  'Red Star': 'TON',
  'Green Star': 'BTC',
  'Blue Star': 'ETH'
} as const

const getAvailabilityText = (availableQuantity: number, soldCount: number) => {
  const total = availableQuantity + soldCount
  const remaining = availableQuantity
  if (remaining <= 0) {
    return `0 of ${total} (Sold out)`
  }
  if (remaining <= 10) {
    return `${remaining} of ${total} (Only ${remaining} left!)`
  }
  return `${remaining} of ${total} available`
}

const setupMainButton = () => {
  if (tg) {
    tg.MainButton.text = 'Buy Gift'
    tg.MainButton.show()
    tg.MainButton.onClick(handlePurchase)
  }
}

const handlePurchase = async () => {
  if (!gift.value || isProcessing.value) return
  
  isProcessing.value = true
  
  try {
    const response = await paymentService.createPaymentAsync({
      amount: gift.value.prices[assetMap[gift.value.name]],
      asset: assetMap[gift.value.name],
      giftId: gift.value._id,
      giftName: gift.value.name
    })

    if (!response.success) {
      throw new Error(response.error || 'Payment creation failed')
    }

    if (tg) {
      tg.MainButton.showProgress()
    }

  } catch (error) {
    console.error('Payment error:', error)
    if (tg) {
      tg.showAlert(`Payment error: ${error.message}`)
    }
  } finally {
    isProcessing.value = false
  }
}

const handleBackClick = () => {
  router.back()
}

// Обработчик успешной оплаты через WebSocket
const handlePaymentSuccess = (data: PaymentSuccessData) => {
  console.log('Получено уведомление об успешной оплате через Socket.IO:', data)
  
  if (tg) {
    tg.MainButton.hideProgress()
  }
  
  // Обновляем историю покупок
  if (gift.value && data.giftId === gift.value._id) {
    giftHistoryService.getGiftHistoryAsync(data.giftId)
      .then(newHistory => {
        history.value = newHistory
      })
      .catch(error => {
        console.error('Ошибка обновления истории:', error)
      })
  }
  
  router.push({
    name: 'GiftPurchased',
    query: {
      giftId: data.giftId,
      paymentAmount: data.paymentAmount,
      paymentAsset: data.paymentAsset
    }
  })
}

onMounted(async () => {
  try {
    const giftId = route.params.id as string
    if (!giftId) {
      error.value = 'Gift ID is required'
      return
    }

    // Загружаем данные подарка и историю
    const [giftData, historyData] = await Promise.all([
      giftService.getGiftByIdAsync(giftId),
      giftHistoryService.getGiftHistoryAsync(giftId)
    ])

    if (!giftData) {
      error.value = 'Gift not found'
      return
    }

    gift.value = giftData
    history.value = historyData

    // Настраиваем Telegram WebApp
    if (tg) {
      tg.BackButton.show()
      tg.BackButton.onClick(handleBackClick)
      setupMainButton()
    }

    // Подписываемся на события Socket.IO
    webSocketService.onPaymentSuccess(handlePaymentSuccess)

  } catch (error) {
    console.error('Error:', error)
    error.value = 'Failed to load gift details'
  } finally {
    isLoading.value = false
  }
})

onUnmounted(() => {
  // Отключаем обработчики Telegram WebApp
  if (tg) {
    tg.MainButton.offClick(handlePurchase)
    tg.BackButton.offClick(handleBackClick)
    tg.MainButton.hide()
    tg.BackButton.hide()
  }
  
  // Отписываемся от событий Socket.IO
  webSocketService.offPaymentSuccess(handlePaymentSuccess)
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

    <div v-else-if="error" class="p-4 text-center text-red-500">
      {{ error }}
    </div>

    <div v-else-if="gift" class="relative">
      <div 
        class="h-64 flex items-center justify-center"
        :class="gift.bgColor"
      >
        <img 
          :src="getGiftIcon(gift.name)"
          :alt="gift.name"
          class="w-24 h-24"
        />
      </div>

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
          <div 
            class="text-sm"
            :class="[
              gift.availableQuantity > 0 
                ? 'text-gray-500 dark:text-gray-400' 
                : 'text-red-500'
            ]"
          >
            {{ getAvailabilityText(gift.availableQuantity, gift.soldCount) }}
          </div>
          <div class="text-sm font-medium text-blue-500">
            {{ gift.rarity }}
          </div>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-800 pt-4">
          <h2 class="text-lg font-semibold mb-4">
            Recently Actions
          </h2>
          <div v-if="history.length === 0" class="text-center text-gray-500">
            No actions yet
          </div>
          <div 
            v-else
            v-for="(item, index) in history" 
            :key="index"
            class="flex items-center py-2"
          >
            <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
              {{ item.user.firstName[0] }}
            </div>
            <div>
              <span class="font-medium">{{ item.user.firstName }}</span>
              <span class="text-gray-500">
                {{ item.action === 'purchase' ? ' bought this gift' : 
                   item.action === 'send' ? ` sent to ${item.recipient.firstName}` :
                   ' received this gift' }}
              </span>
              <div class="text-xs text-gray-400">
                {{ new Date(item.timestamp).toLocaleString() }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>