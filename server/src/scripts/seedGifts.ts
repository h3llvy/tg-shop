import { connect } from 'mongoose'
import { Gift } from '../modules/database/models/Order'
import { GiftHistory, GiftHistoryAction } from '../modules/database/models/GiftHistory'
import { config } from '../config'

const GIFTS = [
  {
    name: 'Delicious Cake',
    description: 'A tasty cake for your friend',
    prices: {
      USDT: 1,
      TON: 0.5,
      BTC: 1,
      ETH: 1
    },
    category: 'cakes',
    rarity: 'common',
    availableQuantity: 1000,
    soldCount: 0,
    isAvailable: true,
    image: 'https://placehold.co/400x400/pink/white?text=Cake',
    bgColor: 'bg-[#FFF3E0]'
  },
  {
    name: 'Red Star',
    description: 'A shiny premium star',
    prices: {
      USDT: 2,
      TON: 1,
      BTC: 2,
      ETH: 2
    },
    category: 'stars',
    rarity: 'epic',
    availableQuantity: 100,
    soldCount: 0,
    isAvailable: true,
    image: 'https://placehold.co/400x400/red/white?text=RedStar',
    bgColor: 'bg-[#FCE4EC]'
  },
  {
    name: 'Green Star',
    description: 'A beautiful rare star',
    prices: {
      USDT: 3,
      TON: 1.5,
      BTC: 3,
      ETH: 3
    },
    category: 'stars',
    rarity: 'rare',
    availableQuantity: 500,
    soldCount: 0,
    isAvailable: true,
    image: 'https://placehold.co/400x400/green/white?text=GreenStar',
    bgColor: 'bg-[#E8F5E9]'
  },
  {
    name: 'Blue Star',
    description: 'An amazing legendary star',
    prices: {
      USDT: 4,
      TON: 2,
      BTC: 4,
      ETH: 4
    },
    category: 'stars',
    rarity: 'legendary',
    availableQuantity: 50,
    soldCount: 0,
    isAvailable: true,
    image: 'https://placehold.co/400x400/blue/white?text=BlueStar',
    bgColor: 'bg-[#E3F2FD]'
  }
]

// Тестовая история для каждого подарка
const createHistoryForGift = (giftId: string) => [
  {
    giftId,
    userId: 123456789,
    action: GiftHistoryAction.PURCHASE,
    timestamp: new Date()
  },
  {
    giftId,
    userId: 123456789,
    action: GiftHistoryAction.SEND,
    recipientId: 987654321,
    timestamp: new Date()
  }
]

export async function seedGiftsAsync() {
  try {
    console.log('Подключение к MongoDB...')
    await connect(config.MONGODB_URI)
    console.log('✅ MongoDB подключена')

    console.log('Удаление существующих подарков и истории...')
    await Promise.all([
      Gift.deleteMany({}),
      GiftHistory.deleteMany({})
    ])

    console.log('Добавление новых подарков...')
    const createdGifts = await Gift.insertMany(GIFTS)

    console.log('Добавление тестовой истории...')
    for (const gift of createdGifts) {
      const history = createHistoryForGift(gift._id.toString())
      await GiftHistory.insertMany(history)
    }

    console.log('✅ Подарки и история успешно добавлены')
  } catch (error) {
    console.error('❌ Ошибка:', error)
    throw error
  }
}

// Запускаем только если это основной файл
if (require.main === module) {
  seedGiftsAsync()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
} 