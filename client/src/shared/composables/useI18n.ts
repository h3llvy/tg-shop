import { createI18n } from 'vue-i18n'
import { ref, computed } from 'vue'

// Импортируем локализации
import en from '@/shared/locales/en.json'
import ru from '@/shared/locales/ru.json'

const STORAGE_KEY = 'user-locale'
const DEFAULT_LOCALE = 'en'

// Создаем экземпляр i18n
export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem(STORAGE_KEY) || DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages: {
    en,
    ru
  }
})

export function useI18n() {
  const currentLocale = ref(i18n.global.locale.value)

  const availableLocales = ['en', 'ru']

  const currentLanguage = computed(() => currentLocale.value.toUpperCase())

  const toggleLanguage = () => {
    const nextIndex = (availableLocales.indexOf(currentLocale.value) + 1) % availableLocales.length
    const newLocale = availableLocales[nextIndex]
    
    currentLocale.value = newLocale
    i18n.global.locale.value = newLocale
    localStorage.setItem(STORAGE_KEY, newLocale)
  }

  return {
    currentLocale,
    currentLanguage,
    toggleLanguage,
    t: i18n.global.t
  }
} 