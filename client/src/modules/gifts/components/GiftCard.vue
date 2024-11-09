<script setup lang="ts">
import type { IGift } from '../types/gift'

const props = defineProps<{
  gift: IGift
}>()

// Определяем основную валюту для каждого подарка
const assetMap = {
  'Delicious Cake': 'USDT',
  'Red Star': 'TON',
  'Green Star': 'BTC',
  'Blue Star': 'ETH'
} as const

const primaryAsset = assetMap[props.gift.name] || 'USDT'
</script>

<template>
  <router-link 
    :to="{ name: 'gift-details', params: { id: gift._id }}" 
    class="block rounded-xl p-4 transition-transform hover:scale-105"
    :class="gift.bgColor"
  >
    <div class="relative">
      <img :src="gift.image" :alt="gift.name" class="w-full rounded-lg mb-2">
      <span class="absolute top-2 right-2 text-xs bg-white/80 rounded px-2 py-1">
        {{ gift.soldCount || 0 }} of {{ gift.availableQuantity }}
      </span>
    </div>
    
    <h3 class="font-medium text-sm mb-1">{{ gift.name }}</h3>
    
    <div class="flex items-center justify-between">
      <span class="text-sm font-bold">
        {{ gift.prices[primaryAsset] }} {{ primaryAsset }}
      </span>
      <span class="text-xs px-2 py-1 bg-white/50 rounded">
        {{ gift.rarity }}
      </span>
    </div>
  </router-link>
</template>
