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
import { Vue3Lottie } from 'vue3-lottie'
import deliciousCakeAnimation from '@/shared/lottie-animations/gift-delicious-cake.json'
import redStarAnimation from '@/shared/lottie-animations/gift-red-star.json'
import greenStarAnimation from '@/shared/lottie-animations/gift-green-star.json'
import blueStarAnimation from '@/shared/lottie-animations/gift-blue-star.json'
import giftBgPattern from '@/shared/utils/giftbg.png'
import { useUserAvatars } from '@/shared/composables/useUserAvatars'
import { telegramService } from '@/shared/services/telegram/telegramService'
import StoreGiftSkeleton from '../components/StoreGiftSkeleton.vue'

// Импорты иконок
import usdtIcon from '@/shared/assets/USDT.svg'
import tonIcon from '@/shared/assets/TON.svg'
import ethIcon from '@/shared/assets/ETH.svg'
import storeIcon from '@/shared/assets/StoreIcon.svg'
import storeIconSent from '@/shared/assets/StoreIconSent.svg'

const route = useRoute()
const router = useRouter()
const tg = window.Telegram?.WebApp

const gift = ref<IGift | null>(null)
const history = ref<IGiftHistory[]>([])
const isLoading = ref(true)
const isProcessing = ref(false)
const error = ref<string | null>(null)

// Добавляем интерфейс для данных об успешном платеже
interface PaymentSuccessData {
  giftId: string
  paymentAmount: string
  paymentAsset: string
}

// Исправляем типизацию для assetMap
const assetMap = {
  'Delicious Cake': 'USDT',
  'Red Star': 'TON',
  'Green Star': 'BTC',
  'Blue Star': 'ETH'
} as const

type GiftName = keyof typeof assetMap
type AssetType = typeof assetMap[GiftName]

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
    const giftName = gift.value.name as GiftName
    const asset = assetMap[giftName]
    
    const response = await paymentService.createPaymentAsync({
      amount: gift.value.prices[asset],
      asset,
      giftId: gift.value._id,
      giftName: gift.value.name
    })

    if (!response.success) {
      throw new Error(response.error || 'Payment creation failed')
    }

    if (tg) {
      tg.MainButton.setParams({
        text: 'Processing...',
        is_visible: true,
        is_active: false
      })
    }

  } catch (error) {
    console.error('Payment error:', error)
    if (tg && error instanceof Error) {
      tg.MainButton.setParams({
        text: 'Buy Gift',
        is_visible: true,
        is_active: true
      })
    }
  } finally {
    isProcessing.value = false
  }
}

const handleBackClick = () => {
  router.back()
}

// Обработ��ик успешной оплаты через WebSocket
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
  isLoading.value = true
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

// Маппинг иконок криптовалют
const cryptoIcons = {
  'USDT': usdtIcon,
  'TON': tonIcon,
  'ETH': ethIcon,
} as const

// Функция для получения иконки статуса
const getStatusIcon = (action: string) => {
  return action === 'send' ? storeIconSent : storeIcon
}

// Добавляем мапу анимаций
const giftAnimationMap = {
  'Delicious Cake': deliciousCakeAnimation,
  'Red Star': redStarAnimation,
  'Blue Star': blueStarAnimation,
  'Green Star': greenStarAnimation
} as const

const lottieOptions = {
  loop: true,
  autoplay: true,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
    progressiveLoad: true,
  }
}

// Функция проверки наличия анимации
const hasAnimation = (giftName: string): boolean => {
  return giftName in giftAnimationMap
}

// Функция получения анимации
const getGiftAnimation = (giftName: string) => {
  return giftAnimationMap[giftName as keyof typeof giftAnimationMap] || deliciousCakeAnimation
}

// Стили для фонового изображения
const backgroundStyle = {
  backgroundImage: `url(${giftBgPattern})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  mixBlendMode: 'multiply' as const,
} as const

// Функция получения класса фона
const getBackgroundClass = (giftName: string) => {
  const backgrounds = {
    'Delicious Cake': 'from-[rgba(254,159,65,0.20)] to-[rgba(254,159,65,0.10)]',
    'Green Star': 'from-[rgba(70,209,0,0.20)] to-[rgba(70,209,0,0.06)]',
    'Blue Star': 'from-[rgba(0,122,255,0.20)] to-[rgba(0,122,255,0.05)]',
    'Red Star': 'from-[rgba(255,71,71,0.20)] to-[rgba(255,71,71,0.05)]'
  }
  return backgrounds[giftName as keyof typeof backgrounds] || ''
}

const { 
  loadUserAvatarAsync, 
  getUserAvatar, 
  getUserInitials,
  getAvatarBackgroundColor
} = useUserAvatars()

// Обновляем функцию загрузки истории
const loadHistoryAsync = async () => {
  try {
    const giftId = route.params.id as string
    history.value = await giftHistoryService.getGiftHistoryAsync(giftId)
    
    // Загружаем аватарки для всех пользователей
    const userIds = new Set(history.value
      .filter(item => item.user && item.user.id)
      .map(item => item.user.id))
    
    const recipientIds = new Set(history.value
      .filter(item => item.action === 'send' && item.recipient && item.recipient.id)
      .map(item => item.recipient!.id))
    
    const allUserIds = [...userIds, ...recipientIds]
    
    // Загружаем аватарки и ждем завершения всех запросов
    await Promise.all(allUserIds.map(userId => loadUserAvatarAsync(userId)))
  } catch (error) {
    console.error('Ошибка загрузки истории:', error)
  }
}

// Функция для перехода в профиль пользователя
const handleUserClick = (userId: number) => {
  try {
    if (userId === telegramService.user?.id) {
      router.push({ name: 'profile' })
    } else {
      router.push({ 
        name: 'user-profile',
        params: { id: userId.toString() }
      })
    }
  } catch (error) {
    console.error('Ошибка перехода в профиль:', error)
  }
}

onMounted(() => {
  loadHistoryAsync()
})
</script>

<template>
  <StoreGiftSkeleton v-if="isLoading" />
  
  <div v-else class="min-h-screen bg-white">
    <div v-if="error" class="p-4 text-center text-red-500">
      {{ error }}
    </div>

    <div v-else-if="gift" class="flex flex-col">
      <!-- Карточка подарка -->
      <div class="px-4 mb-4 pt-6">
        <div class="relative w-[361px] h-[361px] mx-auto rounded-xl bg-white overflow-hidden">
          <!-- Фоновое изображение -->
          <div 
            class="absolute inset-0 pointer-events-none bg-contain opacity-5"
            :style="backgroundStyle"
          ></div>

          <!-- Градиент -->
          <div 
            class="absolute inset-0 bg-gradient-to-b"
            :class="getBackgroundClass(gift.name)"
          ></div>

          <!-- Контент -->
          <div class="relative z-10 p-4">
            <!-- Анимация/Изображение подарка -->
            <div class="flex justify-center items-center h-[320px]">
              <Vue3Lottie
                v-if="hasAnimation(gift.name)"
                :animationData="getGiftAnimation(gift.name)"
                :height="280"
                :width="280"
                :options="lottieOptions"
              />
              <img 
                v-else
                :src="getGiftIcon(gift.name)"
                :alt="gift.name"
                class="w-32 h-32 object-contain"
              />
            </div>
          </div>
        </div>

        <!-- Название и количество в одной строке -->
        <div class="mt-3 flex items-center gap-3">
          <h1 class="text-2xl font-semibold text-black leading-8 tracking-[-0.43px]">
            {{ gift.name }}
          </h1>
          <div 
            class="flex items-center justify-center px-2 py-1 rounded-full bg-[#007AFF1F] backdrop-blur-[25px]"
          >
            <span class="text-[14px] font-medium text-[#007AFF] leading-[22px] tracking-[-0.1px]">
              {{ gift.soldCount }} of {{ gift.availableQuantity + gift.soldCount }}
            </span>
          </div>
        </div>
          
        <p class="mt-3 text-[17px] text-[#8E8E93] leading-[22px] tracking-[-0.43px] mb-3">
          Purchase this gift for the opportunity to give it to another user.
        </p>
      </div>

      <!-- Разделитель на всю ширину -->
      <div class="h-3 bg-[#EFEFF3] w-full"></div>

      <!-- История действий -->
      <div class="px-4 mt-6">
        <h2 class="text-[13px] font-normal text-[#6D6D71] leading-[18px] tracking-[-0.08px] uppercase">
          Recently Actions
        </h2>

        <div class="mt-4 space-y-4">
          <div 
            v-for="(item, index) in history" 
            :key="index"
            class="flex items-start gap-3"
          >
            <!-- Аватар пользователя -->
            <div 
              class="relative cursor-pointer"
              @click="handleUserClick(item.user.id)"
            >
              <div class="w-10 h-10 rounded-full overflow-hidden">
                <img 
                  v-if="getUserAvatar(item.user.id)"
                  :src="getUserAvatar(item.user.id)"
                  :alt="item.user.firstName"
                  class="w-full h-full object-cover"
                />
                <div 
                  v-else
                  class="w-full h-full flex items-center justify-center text-white text-sm font-medium"
                  :style="{ backgroundColor: getAvatarBackgroundColor(item.user.id) }"
                >
                  {{ getUserInitials(item.user.firstName, item.user.lastName) }}
                </div>
              </div>
              <img 
                :src="getStatusIcon(item.action)"
                class="absolute -bottom-1 -right-1 w-4 h-4"
                :alt="item.action"
              />
            </div>

            <div class="flex flex-col">
              <span class="text-[13px] text-[#8E8E93] leading-4 tracking-[-0.1px]">
                {{ item.action === 'send' ? 'Send gift' : 'Buy gift' }}
              </span>
              <div class="text-[17px] leading-[22px] tracking-[-0.442px]">
                <!-- Имя отправителя -->
                <span 
                  class="text-blue-500 font-medium cursor-pointer"
                  @click="handleUserClick(item.user.id)"
                >
                  {{ item.user.firstName }}
                </span>
                
                <span class="text-black font-medium">
                  {{ item.action === 'send' ? ' sent gift to ' : ' bought a gift' }}
                </span>

                <!-- Имя получателя -->
                <span 
                  v-if="item.action === 'send' && item.recipient"
                  class="text-blue-500 font-medium cursor-pointer"
                  @click="handleUserClick(item.recipient.id)"
                >
                  {{ item.recipient.firstName }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>