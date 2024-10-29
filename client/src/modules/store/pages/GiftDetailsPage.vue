<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mainButton, backButton, hapticFeedback } from '@telegram-apps/sdk-vue'
import { GiftIcon } from '@heroicons/vue/24/outline'
import type { IGift } from '../types/gift'

interface IGiftAction {
  id: number
  from: string
  to: string
  avatar: string
}

const route = useRoute()
const router = useRouter()

const gift = ref<IGift>({
  id: route.params.id as string,
  name: 'Вкусный торт',
  price: 10,
  description: 'Купите этот подарок, чтобы подарить его другому пользователю.',
  status: 'available'
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
  backButton.show()
  backButton.onClick(handleBackClick)
  
  mainButton.setParams({
    text: 'Купить подарок',
    isVisible: true,
    backgroundColor: '#007AFF',
    textColor: '#FFFFFF'
  })
  mainButton.onClick(handleBuyClick)
})

onUnmounted(() => {
  backButton.hide()
  mainButton.hide()
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
      {{ gift.available }}
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
