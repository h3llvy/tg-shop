<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import type { IUserGift } from '@/modules/gifts/types/userGift'
import { getGiftIcon } from '@/shared/utils/giftIcons'
import { telegramService } from '@/shared/services/telegram/telegramService'
import USDTIcon from '@/shared/assets/USDT.svg'
import TONIcon from '@/shared/assets/TON.svg'
import ETHIcon from '@/shared/assets/ETH.svg'

const props = defineProps<{
  gift: IUserGift
  mode?: 'send' | 'view'
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const tg = window.Telegram?.WebApp

// Форматируем дату в нужный формат
const formattedDate = computed(() => {
  if (!props.gift.purchaseDate) return ''
  const date = new Date(props.gift.purchaseDate)
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(',', ' at')
})

// Функция для получения иконки криптовалюты
const getCryptoIcon = (asset: string) => {
  switch (asset) {
    case 'USDT':
      return USDTIcon
    case 'TON':
      return TONIcon
    case 'ETH':
      return ETHIcon
    default:
      return USDTIcon
  }
}

// Управление видимостью BottomNavigation через событие
const emitBottomNavigationEvent = (visible: boolean) => {
  window.dispatchEvent(new CustomEvent('bottom-navigation-visibility', {
    detail: { visible }
  }))
}

const handleSendGift = () => {
  if (tg) {
    // Запускаем inline режим для выбора контакта
    tg.switchInlineQuery(props.gift._id)
  }
  closeModal()
}

onMounted(() => {
  if (tg) {
    // Настраиваем главную кнопку Telegram
    tg.MainButton.setParams({
      text: props.mode === 'send' ? 'Send Gift to Contact' : 'Close',
      is_visible: true
    })
    tg.MainButton.onClick(props.mode === 'send' ? handleSendGift : closeModal)
  }
  
  // Скрываем нижнюю навигацию
  emitBottomNavigationEvent(false)
})

onUnmounted(() => {
  if (tg) {
    tg.MainButton.hide()
    tg.MainButton.offClick(props.mode === 'send' ? handleSendGift : closeModal)
  }
  // Показываем нижнюю навигацию при закрытии
  emitBottomNavigationEvent(true)
})

// Функция закрытия модального окна
const closeModal = () => {
  emitBottomNavigationEvent(true)
  emit('close')
}

// Предотвращаем всплытие клика для контента модального окна
const preventPropagation = (e: Event) => {
  e.stopPropagation()
}
</script>

<template>
  <div 
    class="modal-open fixed inset-0 bg-black/50 z-40" 
    @click="closeModal"
  />
  
  <div 
    class="fixed bottom-0 left-0 right-0 bg-[#F2F2F7] dark:bg-bg-primary-dark rounded-t-2xl p-4 z-50"
    :style="{
      maxHeight: 'calc(100vh - 80px)',
      paddingBottom: '16px'
    }"
    @click="preventPropagation"
  >
    <!-- Кнопка закрытия -->
    <button 
      class="absolute right-4 top-4 flex w-[30px] h-[30px] items-center justify-center rounded-full hover:bg-black/5 active:bg-black/10"
      @click="closeModal"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>

    <!-- Иконка подарка -->
    <div class="flex justify-center mt-[16px]">
      <img 
        :src="getGiftIcon(gift.gift.name)"
        :alt="gift.gift.name"
        class="w-[150px] h-[150px] p-[6.25px]"
      />
    </div>

    <!-- Название подарка -->
    <h3 class="text-center text-[20px] font-semibold mt-[12px] mb-6">
      {{ gift.gift.name }}
    </h3>

    <!-- Таблица информации -->
    <div class="w-[361px] mx-auto bg-white dark:bg-bg-secondary-dark rounded-[12px] overflow-hidden border border-[#3C3C435C]/[0.36] divide-y divide-[#3C3C435C]/[0.36]">
      <!-- Date -->
      <div class="flex">
        <div class="w-[113px] p-[8px_16px] flex items-center border-r border-[#3C3C435C]/[0.36]">
          <span class="text-[#8E8E93]">Date</span>
        </div>
        <div class="flex-1 p-[8px_16px] flex items-center">
          {{ formattedDate }}
        </div>
      </div>

      <!-- Price -->
      <div class="flex">
        <div class="w-[113px] p-[8px_16px] flex items-center border-r border-[#3C3C435C]/[0.36]">
          <span class="text-[#8E8E93]">Price</span>
        </div>
        <div class="flex-1 p-[8px_16px] flex items-center gap-2">
          <img 
            :src="getCryptoIcon(gift.purchaseAsset)"
            :alt="gift.purchaseAsset"
            class="w-5 h-5"
          />
          <span>{{ gift.purchasePrice }}</span>
          <span>{{ gift.purchaseAsset }}</span>
        </div>
      </div>

      <!-- Availability -->
      <div class="flex">
        <div class="w-[113px] p-[8px_16px] flex items-center border-r border-[#3C3C435C]/[0.36]">
          <span class="text-[#8E8E93]">Availability</span>
        </div>
        <div class="flex-1 p-[8px_16px] flex items-center">
          {{ gift.serialNumber }} of {{ gift.totalAvailable }}
        </div>
      </div>
    </div>
  </div>
</template> 