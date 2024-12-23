import { connect } from 'mongoose'
import { Order } from '../modules/database/models/Order'
import { Gift } from '../modules/database/models/Order'
import { User } from '../modules/database/models/User'
import { config } from '../config'
import { CryptoAsset } from '../modules/payment/types/payment'

export async function seedOrdersAsync() {
  try {
    console.log('Подключение к MongoDB...')
    await connect(config.MONGODB_URI)
    console.log('✅ MongoDB подключена')

    console.log('Удаление существующих заказов...')
    await Order.deleteMany({})

    // Получаем существующие подарки и пользователей
    const gifts = await Gift.find()
    const users = await User.find()

    if (!gifts.length || !users.length) {
      throw new Error('Нет подарков или пользователей для создания заказов')
    }

    // Создаем тестовые заказы
    const orders = []
    const statuses = ['pending', 'paid', 'sent', 'delivered', 'cancelled']
    const assets: CryptoAsset[] = ['USDT', 'TON', 'BTC', 'ETH']

    for (let i = 0; i < 20; i++) {
      const gift = gifts[Math.floor(Math.random() * gifts.length)]
      const sender = users[Math.floor(Math.random() * users.length)]
      const recipient = users[Math.floor(Math.random() * users.length)]
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const asset = assets[Math.floor(Math.random() * assets.length)]

      orders.push({
        giftId: gift._id,
        senderId: sender.telegramId,
        recipientId: recipient.telegramId,
        status,
        amount: gift.prices[asset],
        message: `Тестовое сообщение ${i + 1}`,
        paymentId: status === 'paid' ? `test_payment_${i}` : undefined,
        asset
      })
    }

    console.log('Добавление тестовых заказов...')
    await Order.insertMany(orders)

    console.log('✅ Заказы успешно добавлены')
  } catch (error) {
    console.error('❌ Ошибка:', error)
    throw error
  }
}

if (require.main === module) {
  seedOrdersAsync()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
} 