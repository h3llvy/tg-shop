import 'dotenv/config'
import { app, initDatabaseAsync } from './app'

const PORT = Number(process.env.PORT) || 4000
const HOST = process.env.HOST || '0.0.0.0'

const startServerAsync = async (): Promise<void> => {
  try {
    await initDatabaseAsync()
    
    app.listen(PORT, HOST, () => {
      console.log(`Сервер запущен на http://${HOST}:${PORT}`)
    })
  } catch (error) {
    console.error('Ошибка запуска сервера:', error)
    process.exit(1)
  }
}

startServerAsync()
