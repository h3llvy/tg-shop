import { connect } from 'mongoose'
import { config } from '../config'
import { seedGiftsAsync } from './seedGifts'
import { seedLeaderboardAsync } from './seedLeaderboard'
import { seedOrdersAsync } from './seedOrders'

async function seedAllAsync() {
  try {
    console.log('Подключение к MongoDB...')
    await connect(config.MONGODB_URI)
    console.log('✅ MongoDB подключена')

    await seedGiftsAsync()
    await seedLeaderboardAsync()
    await seedOrdersAsync()

    console.log('✅ Все данные успешно добавлены')
    process.exit(0)
  } catch (error) {
    console.error('❌ Ошибка:', error)
    process.exit(1)
  }
}

seedAllAsync() 