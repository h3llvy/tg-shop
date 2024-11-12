import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import {router } from './router'
import { i18n } from '@/shared/composables/useI18n'
import './main.css'
import Vue3Lottie from 'vue3-lottie'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(Vue3Lottie)

app.mount('#app')