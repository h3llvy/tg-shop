<script setup lang="ts">
import type { IGiftHistory } from '../types/giftHistory'

const props = defineProps<{
  history: IGiftHistory[]
}>()

const getActionText = (item: IGiftHistory) => {
  if (item.action === 'purchase') {
    return 'bought this gift'
  }
  return `sent to ${item.recipient?.firstName}`
}
</script>

<template>
  <div class="space-y-4">
    <div 
      v-for="item in history" 
      :key="`${item.user.id}-${item.timestamp}`"
      class="flex items-start space-x-3"
    >
      <!-- Аватар пользователя -->
      <img 
        :src="item.user.avatar" 
        :alt="item.user.firstName"
        class="w-10 h-10 rounded-full bg-gray-200"
      />
      
      <div>
        <!-- Имя пользователя и действие -->
        <div class="text-sm">
          <span class="font-medium">{{ item.user.firstName }}</span>
          <span class="text-gray-500 ml-1">{{ getActionText(item) }}</span>
        </div>
        
        <!-- Время -->
        <div class="text-xs text-gray-400">
          {{ new Date(item.timestamp).toLocaleString() }}
        </div>
      </div>
    </div>
  </div>
</template> 