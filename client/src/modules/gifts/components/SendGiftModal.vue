<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import type { IGift } from '../types/gift'

const props = defineProps<{
  gift: IGift
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const handleClose = () => {
  emit('close')
}

const handleSend = () => {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.switchInlineQuery(
      `gift_${props.gift._id}`,
      ['users', 'groups']
    )
  }
}

onMounted(() => {
  if (window.Telegram?.WebApp?.BackButton) {
    window.Telegram.WebApp.BackButton.show()
    window.Telegram.WebApp.BackButton.onClick(handleClose)
  }
})

onUnmounted(() => {
  if (window.Telegram?.WebApp?.BackButton) {
    window.Telegram.WebApp.BackButton.offClick(handleClose)
    window.Telegram.WebApp.BackButton.hide()
  }
})
</script>

<template>
  <div class="fixed inset-0 bg-black/50 z-40" @click="handleClose" />
  <div class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl p-4 z-50">
    <h2 class="text-xl font-bold mb-4">Send Gift</h2>
    <div class="flex items-center gap-4 mb-4">
      <img :src="gift.image" :alt="gift.name" class="w-16 h-16 rounded-lg">
      <div>
        <h3 class="font-medium">{{ gift.name }}</h3>
        <p class="text-sm text-gray-500">{{ gift.description }}</p>
      </div>
    </div>
    <button 
      class="w-full py-3 bg-blue-500 text-white rounded-lg"
      @click="handleSend"
    >
      Choose Recipient
    </button>
  </div>
</template>
