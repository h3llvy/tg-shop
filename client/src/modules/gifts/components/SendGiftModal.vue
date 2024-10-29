<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { 
  XMarkIcon, 
  CurrencyDollarIcon,
  CakeIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline'
import { 
  mainButton, 
  hapticFeedback
} from '@telegram-apps/sdk-vue'
import type { IGift } from '@/modules/gifts/types/gift'

const props = defineProps<{
  gift: IGift
  onClose: () => void
}>()

const currentDate = ref(new Date().toLocaleDateString())

const handleClose = () => {
  props.onClose()
}

// Монтируем компоненты SDK
onMounted(() => {
  mainButton.mount()
  
  mainButton.setParams({
    text: 'Send Gift to Contact',
    isVisible: true,
    backgroundColor: '#007AFF',
    textColor: '#FFFFFF'
  })
  
  mainButton.onClick(() => {
    hapticFeedback.impactOccurred('medium')
    
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.switchInlineQuery(
        `gift_${props.gift.id}`,
        ['users', 'groups']
      )
    }
  })
})

const getGiftIcon = (name: string) => {
  return name.includes('Star') ? SparklesIcon : CakeIcon
}
</script>

<template>
  <!-- Затемнение фона -->
  <div 
    class="fixed inset-0 bg-black/50 z-40"
    @click="handleClose"
  />

  <!-- Модальное окно -->
  <div class="fixed bottom-0 left-0 right-0 h-[60vh] bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-t-2xl z-50 transform transition-transform duration-300 ease-out overflow-y-auto pb-[60px]">
    <!-- Кнопка закрытия -->
    <button 
      @click="handleClose"
      class="absolute right-4 top-4 text-label-secondary-light dark:text-label-secondary-dark"
    >
      <XMarkIcon class="w-6 h-6" />
    </button>

    <!-- Заголовок -->
    <h2 class="text-xl font-bold text-label-primary-light dark:text-label-primary-dark text-center mt-6 mb-8">
      Send Gift
    </h2>

    <!-- Изображение подарка -->
    <div class="w-32 h-32 mx-auto mb-6">
      <component 
        :is="getGiftIcon(gift.name)"
        class="w-full h-full"
        :class="[
          gift.name.includes('Red') ? 'text-accent-purple-light' :
          gift.name.includes('Green') ? 'text-accent-green-light' :
          gift.name.includes('Blue') ? 'text-accent-cyan-light' :
          'text-accent-gold-light'
        ]"
      />
    </div>

    <!-- Информационная таблица -->
    <div class="bg-bg-primary-light dark:bg-bg-primary-dark rounded-xl mx-4 my-6 divide-y divide-separator-light dark:divide-separator-dark">
      <div class="flex justify-between p-4">
        <span class="text-label-secondary-light dark:text-label-secondary-dark">Gift</span>
        <span class="text-label-primary-light dark:text-label-primary-dark">{{ gift.name }}</span>
      </div>

      <div class="flex justify-between p-4">
        <span class="text-label-secondary-light dark:text-label-secondary-dark">Date</span>
        <span class="text-label-date-light dark:text-label-date-dark">{{ currentDate }}</span>
      </div>

      <div class="flex justify-between p-4">
        <span class="text-label-secondary-light dark:text-label-secondary-dark">Price</span>
        <div class="flex items-center gap-1 text-accent-cyan-light dark:text-accent-cyan-dark">
          <CurrencyDollarIcon class="w-5 h-5" />
          <span>{{ gift.price }} USDT</span>
        </div>
      </div>

      <div class="flex justify-between p-4">
        <span class="text-label-secondary-light dark:text-label-secondary-dark">Availability</span>
        <span class="text-label-primary-light dark:text-label-primary-dark">Available</span>
      </div>

      <div class="flex justify-between p-4">
        <span class="text-label-secondary-light dark:text-label-secondary-dark">Gift ID</span>
        <span class="text-label-primary-light dark:text-label-primary-dark">#{{ gift.id }}</span>
      </div>
    </div>

    <!-- Описание процесса -->
    <div class="px-4 text-center text-label-secondary-light dark:text-label-secondary-dark">
      <p>Click "Send Gift to Contact" to choose a recipient from your contacts</p>
    </div>
  </div>
</template>
