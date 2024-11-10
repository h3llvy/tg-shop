import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

// Добавляем перехватчик для всех запросов
api.interceptors.request.use((config) => {
  const initData = window.Telegram?.WebApp?.initData
  
  if (initData) {
    config.headers['Telegram-Web-App-Init-Data'] = initData
  }
  
  return config
})

export { api } 