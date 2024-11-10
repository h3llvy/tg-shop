<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <div class="text-center">
      <img 
        :src="getGiftIcon(gift?.name || 'default')"
        :alt="gift?.name"
        class="w-24 h-24 mb-4"
      />
      <h1 class="text-2xl font-bold mb-2">Gift Purchased</h1>
      <p class="text-gray-600 mb-8">
        The {{ gift?.name }} gift was purchased for {{ amount }} {{ asset }}.
      </p>
    </div>
    <!-- Popup для отправки подарка -->
    <div class="fixed bottom-20 left-4 right-4 bg-gray-800 text-white p-4 rounded-lg flex items-center justify-between">
      <div class="flex items-center">
        <span class="text-2xl mr-2">🎁</span>
        <div>
          <div class="font-semibold">You Bought a Gift</div>
          <div class="text-sm text-gray-300">Now send it to your friend.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { giftService } from '@/modules/gifts/services/giftService'
import { getGiftIcon } from '@/shared/utils/giftIcons'

const route = useRoute()
const router = useRouter()
const tg = window.Telegram?.WebApp

const gift = ref(null)
const amount = ref('')
const asset = ref('')

onMounted(async () => {
  const { giftId, paymentAmount, paymentAsset } = route.query
  
  if (giftId) {
    gift.value = await giftService.getGiftByIdAsync(giftId as string)
    amount.value = paymentAmount as string
    asset.value = paymentAsset as string
  }

  // Настраиваем нативные кнопки Telegram
  if (tg) {
    // Кнопка "Назад"
    tg.BackButton.show()
    tg.BackButton.onClick(() => router.back())

    // Основная кнопка для отправки подарка
    tg.MainButton.setParams({
      text: "Send Gift",
      is_visible: true,
      color: "#2481cc",
      text_color: "#ffffff"
    })
    tg.MainButton.onClick(handleSendGift)
    
    // Вторичная кнопка для возврата в магазин
    tg.SecondaryButton.setParams({
      text: "Open Store",
      is_visible: true,
      position: "bottom",
      color: "#f5f5f5",
      text_color: "#2481cc"
    })
    tg.SecondaryButton.onClick(() => router.push('/'))
  }
})

// Очищаем обработчики при размонтировании
onUnmounted(() => {
  if (tg) {
    tg.BackButton.offClick(() => router.back())
    tg.BackButton.hide()
    tg.MainButton.offClick(handleSendGift)
    tg.SecondaryButton.offClick(() => router.push('/'))
    tg.MainButton.hide()
    tg.SecondaryButton.hide()
  }
})

const handleSendGift = async () => {
  if (!gift.value || !tg) return

  try {
    const user = await tg.showContactPicker()
    
    if (user) {
      tg.switchInlineQuery(gift.value._id, user.id)
    }
  } catch (error) {
    console.error('Error selecting contact:', error)
  }
}

const handleOpenStore = () => {
  router.push('/')
}
</script>
