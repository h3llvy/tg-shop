<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { mainButton, backButton, hapticFeedback} from '@telegram-apps/sdk-vue'
import { GiftIcon } from '@heroicons/vue/24/outline'
import type { IGift } from '@/modules/gifts/types/gift'

interface IGiftDetails extends IGift {
  available?: number
}

interface IGiftAction {
  id: number
  from: string
  to: string
  avatar: string
}

const router = useRouter()

const gift = ref<IGiftDetails>({
  id: '1',
  name: 'Premium Gift',
  price: 100,
  description: 'A premium gift for special occasions',
  status: 'available',
  available: 5,
  imageUrl: 'https://placehold.co/400x400/gold/white?text=PremiumGift'
})

const recentActions = ref<IGiftAction[]>([
  {
    id: 1,
    from: 'Алиса',
    to: 'Марк',
    avatar: 'https://i.pravatar.cc/40?u=1'
  }
])

const handleBackClick = (): void => {
  hapticFeedback.impactOccurred('light')
  router.back()
}

const handleBuyClick = (): void => {
  hapticFeedback.impactOccurred('medium')
}

onMounted(() => {
  // Сначала монтируем кнопки
  mainButton.mount()
  backButton.mount()
  
  // Затем показываем back button
  backButton.show()
  backButton.onClick(handleBackClick)
  
  // Настраиваем main button
  mainButton.setParams({
    text: 'Купить подарок',
    isVisible: true,
    backgroundColor: '#007AFF',
    textColor: '#FFFFFF'
  })

  mainButton.onClick(handleBuyClick)
})

onUnmounted(() => {
    mainButton.setParams({
    text: 'Купить подарок',
    isVisible: false,
    backgroundColor: '#007AFF',
    textColor: '#FFFFFF'
  })
  mainButton.unmount()
  backButton.hide()
  backButton.unmount()
})
</script>

<template>
  <div class="p-4">
    <div class="w-full aspect-square flex items-center justify-center bg-[#FFF3E0] rounded-lg mb-4">
      <GiftIcon class="w-32 h-32 text-primary-light dark:text-primary-dark" />
    </div>
    
    <h1 class="text-2xl font-bold text-label-primary-light dark:text-label-primary-dark">
      {{ gift.name }}
    </h1>
    <p class="text-sm text-label-secondary-light dark:text-label-secondary-dark">
      {{ gift.available ?? 'Нет в наличии' }}
    </p>
    
    <p class="mt-4 text-label-secondary-light dark:text-label-secondary-dark">
      {{ gift.description }}
    </p>
    
    <div class="mt-8">
      <h2 class="text-sm font-medium text-label-secondary-light dark:text-label-secondary-dark mb-4">
        НЕДАВНИЕ ДЕЙСТВИЯ
      </h2>
      <div 
        v-for="action in recentActions" 
        :key="action.id" 
        class="flex items-center gap-2 mb-2"
      >
        <img 
          :src="action.avatar" 
          :alt="action.from"
          class="w-8 h-8 rounded-full"
        >
        <span class="text-label-primary-light dark:text-label-primary-dark">
          {{ action.from }}
        </span>
        <span class="text-label-secondary-light dark:text-label-secondary-dark">
          отправил подарок
        </span>
        <span class="text-primary-light dark:text-primary-dark">
          {{ action.to }}
        </span>
      </div>
    </div>
  </div>
</template>