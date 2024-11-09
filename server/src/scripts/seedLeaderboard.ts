import { connect } from 'mongoose'
import { Leaderboard } from '../modules/database/models/Leaderboard'
import { User } from '../modules/database/models/User'
import { config } from '../config'

const generateMockUsers = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    telegramId: 1000000 + i,
    firstName: `User ${i + 1}`,
    lastName: `LastName ${i + 1}`,
    username: `user${i + 1}`,
    languageCode: 'ru',
    isPremium: Math.random() > 0.8,
    giftsReceived: Math.floor(Math.random() * 500),
    giftsSent: Math.floor(Math.random() * 500),
    lastActive: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
  }))
}

export async function seedLeaderboardAsync() {
  try {
    await connect(config.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Очищаем существующие данные
    await Promise.all([
      Leaderboard.deleteMany({}),
      User.deleteMany({})
    ])

    // Генерируем тестовые данные
    const mockUsers = generateMockUsers(100)

    // Создаем пользователей
    await User.insertMany(mockUsers)

    // Создаем записи в лидерборде
    const leaderboardEntries = mockUsers.map(user => ({
      telegramId: user.telegramId,
      name: `${user.firstName} ${user.lastName}`,
      username: user.username,
      giftsCount: user.giftsReceived + user.giftsSent,
      giftsReceived: user.giftsReceived,
      giftsSent: user.giftsSent,
      lastActive: user.lastActive
    }))

    await Leaderboard.insertMany(leaderboardEntries)

    console.log('Users and Leaderboard seeded successfully')
  } catch (error) {
    console.error('❌ Ошибка:', error)
    throw error
  }
}

if (require.main === module) {
  seedLeaderboardAsync()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
} 