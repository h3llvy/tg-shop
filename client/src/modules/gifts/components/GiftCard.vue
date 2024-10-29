<script setup lang="ts">
import { ref } from 'vue'
import { CakeIcon, SparklesIcon } from '@heroicons/vue/24/outline'
import { hapticFeedback } from '@telegram-apps/sdk-vue'
import type { IGift } from '@/modules/gifts/types/gift'
import SendGiftModal from './SendGiftModal.vue'

defineProps<{
  gift: IGift
}>()

const showModal = ref(false)

const getGiftIcon = (name: string) => {
  return name.includes('Star') ? SparklesIcon : CakeIcon
}

const getGiftColor = (name: string) => {
  switch (name) {
    case 'Red Star':
      return 'text-accent-purple-light dark:text-accent-purple-dark'
    case 'Green Star':
      return 'text-accent-green-light dark:text-accent-green-dark'
    case 'Blue Star':
      return 'text-accent-cyan-light dark:text-accent-cyan-dark'
    default:
      return 'text-accent-gold-light dark:text-accent-gold-dark'
  }
}

const handleSendClick = () => {
  // Добавляем тактильную отдачу
  hapticFeedback.impactOccurred('medium')
  showModal.value = true
}
</script>

<template>
  <div class="bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-xl p-4 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow">
    <!-- Название подарка -->
    <h3 class="text-[14px] font-medium text-label-primary-light dark:text-label-primary-dark text-center mb-4">
      {{ gift.name }}
    </h3>

    <!-- Изображение подарка -->
    <div class="flex-1 flex items-center justify-center w-full my-4">
      <component 
        :is="getGiftIcon(gift.name)" 
        class="w-16 h-16"
        :class="getGiftColor(gift.name)"
      />
    </div>

    <!-- Кнопка Send -->
    <button 
      @click="handleSendClick"
      class="w-full h-8 bg-primary-light dark:bg-primary-dark text-white rounded-lg text-[14px] font-medium hover:opacity-80 active:scale-95 transition-all"
    >
      Send
    </button>

    <!-- Модальное окно -->
    <SendGiftModal 
      v-if="showModal"
      :gift="gift"
      @close="showModal = false"
    />
  </div>
</template>
