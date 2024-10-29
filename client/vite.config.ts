import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true, // Важно для Docker
    port: 3000
  },
  // Настройки для продакшн сборки
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Оптимизации для продакшена
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia'],
          'telegram': ['@telegram-apps/sdk-vue']
        }
      }
    }
  }
})
