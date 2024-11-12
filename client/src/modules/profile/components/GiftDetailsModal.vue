<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import type { IUserGift } from '@/modules/gifts/types/userGift'
import { getGiftIcon } from '@/shared/utils/giftIcons'
import { telegramService } from '@/shared/services/telegram/telegramService'
import { profileService } from '@/modules/profile/services/profileService'
import { useRouter } from 'vue-router'
import USDTIcon from '@/shared/assets/USDT.svg'
import TONIcon from '@/shared/assets/TON.svg'
import ETHIcon from '@/shared/assets/ETH.svg'

const props = defineProps<{
  userGift: IUserGift
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const router = useRouter()
const tg = window.Telegram?.WebApp

// Добавляем ref для аватарки отправителя
const senderAvatarUrl = ref<string | null>(null)

// Загружаем аватарку отправителя
const loadSenderAvatarAsync = async () => {
  try {
    senderAvatarUrl.value = await profileService.getUserAvatarAsync(props.userGift.userId)
  } catch (error) {
    console.error('Ошибка загрузки аватара отправителя:', error)
  }
}

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

// Получаем данные отправителя
const fromUser = computed(() => {
  // Если это покупка самим пользователем
  if (props.userGift.userId === telegramService.user?.id) {
    return {
      id: telegramService.user.id,
      name: telegramService.user.first_name,
      avatar: senderAvatarUrl.value
    }
  }
  // Если это подарок от другого пользователя
  return {
    id: props.userGift.userId,
    name: props.userGift.fromUserName || 'Unknown',
    avatar: senderAvatarUrl.value
  }
})

// Обработчик клика по профилю
const handleProfileClick = () => {
  if (fromUser.value.id === telegramService.user?.id) {
    router.push({ name: 'profile' })
  } else {
    router.push({ 
      name: 'profile', 
      params: { id: fromUser.value.id.toString() }
    })
  }
  closeModal()
}

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

onMounted(() => {
  loadSenderAvatarAsync()
  
  if (tg) {
    // Настраиваем главную кнопку Telegram
    tg.MainButton.setParams({
      text: 'Close',
      is_visible: true
    })
    tg.MainButton.onClick(closeModal)
  }
  
  // Скрываем нижнюю навигацию
  emitBottomNavigationEvent(false)
})

onUnmounted(() => {
  if (tg) {
    tg.MainButton.hide()
    tg.MainButton.offClick(closeModal)
  }
  // Показываем нижнюю навигацию при закрытии
  emitBottomNavigationEvent(true)
})

// Функция закрытия модального окна
const closeModal = () => {
  // Показываем нижнюю навигацию
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
    class="fixed bottom-0 left-0 right-0 bg-[#F2F2F7] rounded-t-2xl p-4 z-50"
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
        :src="getGiftIcon(userGift.gift.name)"
        :alt="userGift.gift.name"
        class="w-[150px] h-[150px] p-[6.25px]"
      />
    </div>

    <!-- Название подарка -->
    <h3 class="text-center text-[20px] font-semibold mt-[12px] mb-6">
      {{ userGift.gift.name }}
    </h3>

    <!-- Таблица информации -->
    <div class="w-[361px] mx-auto bg-white rounded-[12px] overflow-hidden border border-[#3C3C435C]/[0.36] divide-y divide-[#3C3C435C]/[0.36]">
      <!-- From с аватаркой -->
      <div class="flex">
        <div class="w-[113px] p-[8px_16px] flex items-center border-r border-[#3C3C435C]/[0.36]">
          <span class="text-[#8E8E93]">From</span>
        </div>
        <div 
          class="flex-1 p-[8px_16px] flex items-center gap-2 cursor-pointer hover:bg-black/[0.02]"
          @click="handleProfileClick"
        >
          <div class="w-5 h-5 rounded-full overflow-hidden">
            <img 
              v-if="fromUser.avatar"
              :src="fromUser.avatar"
              :alt="fromUser.name"
              class="w-full h-full object-cover"
            />
            <div 
              v-else
              class="w-full h-full bg-gray-200 flex items-center justify-center text-xs"
            >
              {{ fromUser.name[0] }}
            </div>
          </div>
          <span class="text-[#007AFF]">{{ fromUser.name }}</span>
        </div>
      </div>

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
            :src="getCryptoIcon(userGift.purchaseAsset)"
            :alt="userGift.purchaseAsset"
            class="w-5 h-5"
          />
          <span>{{ userGift.purchasePrice }}</span>
          <span>{{ userGift.purchaseAsset }}</span>
        </div>
      </div>

      <!-- Availability -->
      <div class="flex">
        <div class="w-[113px] p-[8px_16px] flex items-center border-r border-[#3C3C435C]/[0.36]">
          <span class="text-[#8E8E93]">Availability</span>
        </div>
        <div class="flex-1 p-[8px_16px] flex items-center">
          {{ userGift.serialNumber }} of {{ userGift.totalAvailable }}
        </div>
      </div>
    </div>
  </div>
</template> 