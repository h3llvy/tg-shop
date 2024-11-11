<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 relative">
    <!-- Анимация эффекта покупки -->
    <Vue3Lottie
      v-if="showPurchaseEffect"
      :animationData="effectGiftPurchasedAnimation"
      :options="purchaseEffectOptions"
      :height="300"
      :width="300"
      class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
    />
    
    <!-- Существующий контент -->
    <div class="text-center">
      <Vue3Lottie
        v-if="gift"
        :animationData="deliciousCakeAnimation"
        :height="100"
        :width="100"
        class="mb-4"
      />
      
      <h1 class="text-[24px] font-semibold text-black leading-[30px] tracking-[-0.43px] mb-4">
        Gift Purchased
      </h1>
      
      <div class="text-[17px] text-[#8E8E93] leading-[22px] tracking-[-0.43px]">
        <p class="mb-1">
          The <span class="text-black">{{ gift?.name }}</span> gift was purchased
        </p>
        <p>
          for <span class="text-black">{{ amount }} {{ asset }}</span>.
        </p>
      </div>
    </div>

    <!-- Попап -->
    <div 
      v-if="showPopup"
      class="fixed bottom-0 left-0 right-0 mx-auto flex w-[361px] h-[53px] px-4 py-[9px] items-center justify-between rounded-[14px] bg-[rgba(45,45,45,0.80)] backdrop-blur-[10px] mb-2"
    >
      <div class="flex items-center">
        <img 
          :src="cakePopupIcon" 
          alt="Gift" 
          class="w-7 h-7 mr-3"
        />
        <div>
          <div class="text-[14px] font-medium text-white leading-[18px] tracking-[-0.154px]">
            You Bought a Gift
          </div>
          <div class="text-[14px] font-normal text-white leading-[18px] tracking-[-0.154px]">
            Now send it to your friend.
          </div>
        </div>
      </div>
      
      <button 
        class="text-[#5AC8FA] text-[17px] leading-[22px] tracking-[-0.43px]"
        @click="handleSendGift"
      >
        Send
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { giftService } from '@/modules/gifts/services/giftService'
import type { IGift } from '@/modules/gifts/types/gift'
import { Vue3Lottie } from 'vue3-lottie'
import deliciousCakeAnimation from '@/shared/lottie-animations/gift-delicious-cake.json'
import effectGiftPurchasedAnimation from '@/shared/lottie-animations/effect-gift-purchased.json'
import cakePopupIcon from '@/shared/assets/cake-popup.svg'
import { telegramService } from '@/shared/services/telegram/telegramService'

const route = useRoute()
const router = useRouter()
const tg = telegramService.webApp

const gift = ref<IGift | null>(null)
const amount = ref('')
const asset = ref('')
const showPopup = ref(true)
const showPurchaseEffect = ref(true)

// Настройки для анимаций
const lottieOptions = {
  loop: true,
  autoplay: true,
  animationData: deliciousCakeAnimation,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
}

const purchaseEffectOptions = {
  loop: false,
  autoplay: true,
  animationData: effectGiftPurchasedAnimation,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
    progressiveLoad: true,
  }
}

onMounted(async () => {
  const { giftId, paymentAmount, paymentAsset } = route.query
  
  if (giftId) {
    gift.value = await giftService.getGiftByIdAsync(giftId as string)
    amount.value = paymentAmount as string
    asset.value = paymentAsset as string
  }

  // Настраиваем нативные кнопки Telegram
  if (tg) {
    tg.BackButton.show()
    tg.BackButton.onClick(() => router.back())

    tg.MainButton.setParams({
      text: "Send Gift",
      is_visible: true,
      color: "#2481cc",
      text_color: "#ffffff"
    })
    tg.MainButton.onClick(handleSendGift)
    
    tg.SecondaryButton.setParams({
      text: "Open Store",
      is_visible: true,
      position: "bottom",
      color: "#f5f5f5",
      text_color: "#2481cc"
    })
    tg.SecondaryButton.onClick(() => router.push('/store'))
  }

  // Скрываем попап через 5 секунд
  setTimeout(() => {
    showPopup.value = false
  }, 5000)

  // Запускаем анимацию
  setTimeout(() => {
    showPurchaseEffect.value = true
    setTimeout(() => {
      showPurchaseEffect.value = false
    }, 1500)
  }, 100)
})

onUnmounted(() => {
  if (tg) {
    tg.BackButton.offClick(() => router.back())
    tg.BackButton.hide()
    tg.MainButton.offClick(handleSendGift)
    tg.SecondaryButton.offClick(() => router.push('/store'))
    tg.MainButton.hide()
    tg.SecondaryButton.hide()
  }
})

const handleSendGift = async () => {
  if (!gift.value) return

  try {
    await telegramService.sendGiftAsync(gift.value._id)
  } catch (error) {
    console.error('Error sending gift:', error)
  }
}
</script>
