import { createApp } from 'vue'
import { init } from '@telegram-apps/sdk-vue'
import App from './App.vue'
import { router } from './router'
import './main.css'

// Инициализируем SDK
init()

const app = createApp(App)
app.use(router) // Добавляем роутер
app.mount('#app')