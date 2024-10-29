import 'dotenv/config'
import { app, initDatabaseAsync } from './app'

const PORT = process.env.PORT || 4000

const startServerAsync = async (): Promise<void> => {
  try {
    await initDatabaseAsync()
    
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`)
    })
  } catch (error) {
    console.error('Ошибка запуска сервера:', error)
    process.exit(1)
  }
}

startServerAsync()
