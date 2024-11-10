<script setup lang="ts">
import type { IGift } from '@/modules/gifts/types/gift'
import { getGiftIcon } from '@/shared/utils/giftIcons'
import EthIcon from '@/modules/store/assets/icons/ETH.svg'
import TonIcon from '@/modules/store/assets/icons/TON.svg'
import UsdtIcon from '@/modules/store/assets/icons/USDT.svg'
import { CurrencyDollarIcon } from '@heroicons/vue/24/solid'
import { Vue3Lottie } from 'vue3-lottie'
// Импортируем анимации для каждого подарка
import deliciousCakeAnimation from '@/shared/lottie-animations/gift-delicious-cake.json'
import redStarAnimation from '@/shared/lottie-animations/gift-red-star.json'
import greenStarAnimation from '@/shared/lottie-animations/gift-green-star.json'
import blueStarAnimation from '@/shared/lottie-animations/gift-blue-star.json'
import giftBgPattern from '@/shared/utils/giftbg.png'


const props = defineProps<{
  gift: IGift
}>()

const assetMap = {
  'Delicious Cake': 'USDT',
  'Red Star': 'TON',
  'Green Star': 'BTC',
  'Blue Star': 'ETH'
} as const

// Добавим типы для объектов с иконками и фонами
interface IconMap {
  [key: string]: any; // здесь any необходим, так как у нас смешанные типы иконок
  'Delicious Cake': typeof UsdtIcon;
  'Red Star': typeof TonIcon;
  'Green Star': typeof CurrencyDollarIcon;
  'Blue Star': typeof EthIcon;
}

interface BackgroundMap {
  [key: string]: string;
  'Delicious Cake': string;
  'Red Star': string;
  'Green Star': string;
  'Blue Star': string;
}

const getCryptoIcon = (giftName: string) => {
  const icons: IconMap = {
    'Delicious Cake': UsdtIcon,
    'Red Star': TonIcon,
    'Green Star': CurrencyDollarIcon,
    'Blue Star': EthIcon
  }
  return icons[giftName] || UsdtIcon
}

const getBackgroundClass = (giftName: string) => {
  const backgrounds: BackgroundMap = {
    'Delicious Cake': 'from-[rgba(254,159,65,0.20)] to-[rgba(254,159,65,0.10)]',
    'Green Star': 'from-[rgba(70,209,0,0.20)] to-[rgba(70,209,0,0.06)]',
    'Blue Star': 'from-[rgba(0,122,255,0.20)] to-[rgba(0,122,255,0.05)]',
    'Red Star': 'from-[rgba(255,71,71,0.20)] to-[rgba(255,71,71,0.05)]'
  }
  return backgrounds[giftName] || ''
}

const getPrimaryAsset = (giftName: string) => {
  return assetMap[giftName as keyof typeof assetMap] || 'USDT'
}

// Создаем мапу анимаций для всех подарков
const giftAnimationMap = {
  'Delicious Cake': deliciousCakeAnimation,
  'Red Star': redStarAnimation,
  'Blue Star': blueStarAnimation,
  'Green Star': greenStarAnimation
} as const

// Добавим типизацию для анимаций
interface GiftAnimationMap {
  [key: string]: any;
  'Delicious Cake': typeof deliciousCakeAnimation;
  'Red Star': typeof redStarAnimation;
  'Blue Star': typeof blueStarAnimation;
  'Green Star': typeof greenStarAnimation;
}

const lottieOptions = {
  loop: true,
  autoplay: true,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
    progressiveLoad: true,
  }
}

// Обновляем функцию получения анимации с новой типизацией
const getGiftAnimation = (giftName: string) => {
  const animations: GiftAnimationMap = giftAnimationMap
  return animations[giftName] || deliciousCakeAnimation // Возвращаем deliciousCakeAnimation как fallback
}

// Проверяем, есть ли анимация для подарка
const hasAnimation = (giftName: string): boolean => {
  return giftName in giftAnimationMap
}

// Обновляем стили для фонового изображения с правильной типизацией
const backgroundStyle = {
  backgroundImage: `url(${giftBgPattern})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  mixBlendMode: 'multiply' as const,
} as const
</script>

<template>
  <div 
    class="cursor-pointer rounded-xl bg-white relative p-4 overflow-hidden"
  >
    <!-- Фоновое изображение с opacity-5 (5%) -->
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
    <div class="relative z-10">
      <div class="text-right text-[13px] text-black/50 leading-[18px] tracking-[-0.08px]">
        {{ gift.soldCount }} of {{ gift.availableQuantity + gift.soldCount }}
      </div>

      <div class="flex justify-center items-center">
        <Vue3Lottie
          v-if="hasAnimation(gift.name)"
          :animationData="getGiftAnimation(gift.name)"
          :height="128"
          :width="128"
          :options="lottieOptions"
          class="p-[5.333px]"
        />
        <img 
          v-else
          :src="getGiftIcon(gift.name)"
          :alt="gift.name"
          class="w-32 h-32 p-[5.333px]"
        />
      </div>

      <div class="text-center">
        <h3 class="text-[17px] font-semibold text-black leading-[22px] tracking-[-0.43px] mb-3">
          {{ gift.name }}
        </h3>
        
        <div class="inline-flex h-[30px] px-4 py-1.5 bg-[#007AFF] rounded-full items-center justify-center">
          <img 
            v-if="typeof getCryptoIcon(gift.name) === 'string'"
            :src="getCryptoIcon(gift.name)"
            class="w-5 h-5 mr-2 object-contain"
          />
          <component 
            v-else
            :is="getCryptoIcon(gift.name)"
            class="w-5 h-5 mr-2 text-white"
          />
          <span class="text-sm font-medium text-white">
            {{ gift.prices[getPrimaryAsset(gift.name)] }} {{ getPrimaryAsset(gift.name) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>