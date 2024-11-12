import { ref, watch } from 'vue'

const isDarkTheme = ref(false)

// Проверяем предпочтения системы
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)')

export function useTheme() {
  // Инициализация темы
  const initTheme = () => {
    // Проверяем сохраненную тему
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isDarkTheme.value = savedTheme === 'dark'
    } else {
      // Если нет сохраненной темы, используем системные предпочтения
      isDarkTheme.value = systemPrefersDark.matches
    }
    updateThemeClass()
  }

  // Обновление класса темы
  const updateThemeClass = () => {
    if (isDarkTheme.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Переключение темы
  const toggleTheme = () => {
    isDarkTheme.value = !isDarkTheme.value
    localStorage.setItem('theme', isDarkTheme.value ? 'dark' : 'light')
  }

  // Слушаем изменения системной темы
  systemPrefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      isDarkTheme.value = e.matches
    }
  })

  // Следим за изменениями темы
  watch(isDarkTheme, updateThemeClass, { immediate: true })

  // Инициализируем тему при создании
  initTheme()

  return {
    isDarkTheme,
    toggleTheme
  }
} 