<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Vue3Lottie } from 'vue3-lottie'


// Импортируем JSON анимации
import tabStoreAnimation from '@/shared/lottie-animations/tab-store.json'
import tabGiftsAnimation from '@/shared/lottie-animations/tab-gifts.json'
import tabLeaderboardAnimation from '@/shared/lottie-animations/tab-leaderboard.json'
import tabProfileAnimation from '@/shared/lottie-animations/tab-profile.json'

const route = useRoute()
const router = useRouter()

const currentRoute = computed(() => route.name)
const isInitialMount = ref(true)

type LottieRef = {
  play: () => void;
  stop: () => void;
  goToAndStop: (frame: number) => void;
}

const storeAnimationInstance = ref<LottieRef | null>(null)
const giftsAnimationInstance = ref<LottieRef | null>(null)
const leaderboardAnimationInstance = ref<LottieRef | null>(null)
const profileAnimationInstance = ref<LottieRef | null>(null)

// Создаем record для типизации animationInstances
const animationInstances: Record<string, typeof storeAnimationInstance> = {
  store: storeAnimationInstance,
  gifts: giftsAnimationInstance,
  leaderboard: leaderboardAnimationInstance,
  profile: profileAnimationInstance
}

// При монтировании компонента устанавливаем начальное состояние
onMounted(() => {
  // Устанавливаем все анимации в последний кадр
  Object.entries(animationInstances).forEach(([routeName, instance]) => {
    if (routeName === currentRoute.value) {
      // Для активного маршрута проигрываем анимацию один раз
      instance.value?.play()
    } else {
      // Для неактивных устанавливаем первый кадр
      instance.value?.goToAndStop(0)
    }
  })
  isInitialMount.value = false
})

const navigate = async (_routeName: string) => {
  try {
    if (_routeName !== currentRoute.value) {
      await router.push({ name: _routeName })
      // Запускаем анимацию только для выбранной вкладки
      animationInstances[_routeName]?.value?.play()
    }
  } catch (error) {
    console.error('Ошибка навигации:', error)
  }
}

// Конфигурация для каждого пункта меню
const menuItems = [
  { 
    name: 'store', 
    animation: tabStoreAnimation, 
    label: 'Store',
    ref: storeAnimationInstance 
  },
  { 
    name: 'gifts', 
    animation: tabGiftsAnimation, 
    label: 'Gifts',
    ref: giftsAnimationInstance 
  },
  { 
    name: 'leaderboard', 
    animation: tabLeaderboardAnimation, 
    label: 'Leaderboard',
    ref: leaderboardAnimationInstance 
  },
  { 
    name: 'profile', 
    animation: tabProfileAnimation, 
    label: 'Profile',
    ref: profileAnimationInstance 
  }
]

// Следим за изменением маршрута
watch(currentRoute, (newRoute, oldRoute) => {
  if (!isInitialMount.value && newRoute && typeof newRoute === 'string') {
    // Останавливаем старую анимацию
    if (oldRoute) {
      animationInstances[oldRoute]?.value?.goToAndStop(0)
    }
    // Запускаем новую анимацию
    const instance = animationInstances[newRoute]?.value
    if (instance) {
      instance.play()
    }
  }
})

// Настройки для Lottie анимаций
const getLottieOptions = (itemName: string) => ({
  width: 26,
  height: 26,
  loop: false,
  autoplay: false,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid meet',
    clearCanvas: true,
    progressiveLoad: true,
  }
})
</script>

<template>
  <nav 
    class="fixed bottom-0 left-0 right-0 z-50 flex justify-center items-start self-stretch bg-white dark:bg-black border-t border-[#3C3C4326] dark:border-[#545458A6]"
  >
    <div class="flex justify-around w-full">
      <button
        v-for="item in menuItems"
        :key="item.name"
        class="flex flex-col items-center pt-[7px] min-w-[70px] transition-all duration-200 active:scale-95"
        :class="{
          'text-[#007AFF]': currentRoute === item.name,
          'text-[#545458A6]': currentRoute !== item.name
        }"
        @click="navigate(item.name)"
      >
        <Vue3Lottie
          :animation-data="item.animation"
          :ref="(el) => item.ref.value = el"
          :options="getLottieOptions(item.name)"
          :style="{
            filter: currentRoute === item.name ? 'invert(40%) sepia(93%) saturate(1352%) hue-rotate(198deg) brightness(119%) contrast(119%)' : 'none'
          }"
          class="w-[26px] h-[26px]"
        />
        <span 
          class="text-[10px] font-['SF_Pro_Text'] font-medium tracking-[0.1px] mt-1 transition-transform duration-200"
          :class="{ 'transform active:scale-95': true }"
        >
          {{ item.label }}
        </span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
@font-face {
  font-family: 'SF Pro Text';
  src: url('@/shared/assets/fonts/SF-Pro-Text-Medium.otf') format('opentype');
  font-weight: 500;
  font-style: normal;
}

/* Добавляем стили для активного состояния кнопки */
button:active {
  transform: scale(0.95);
}

/* Добавляем плавность для всех трансформаций */
button, span {
  transition: all 0.2s ease;
}
</style>
