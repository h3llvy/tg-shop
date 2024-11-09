import { connect } from 'mongoose'
import { Gift } from '../modules/database/models/Gift'
import { config } from '../config'

const GIFTS = [
  {
    name: 'Delicious Cake',
    description: 'A tasty cake for your friend',
    price: 10,
    category: 'cakes',
    rarity: 'common',
    quantity: 1000,
    soldCount: 0,
    isAvailable: true,
    bgColor: 'bg-[#FFF3E0]'
  },
  {
    name: 'Red Star',
    description: 'A shiny premium star',
    price: 50,
    category: 'stars',
    rarity: 'epic',
    quantity: 100,
    soldCount: 0,
    isAvailable: true,
    bgColor: 'bg-[#FCE4EC]'
  },
  {
    name: 'Green Star',
    description: 'A beautiful rare star',
    price: 25,
    category: 'stars',
    rarity: 'rare',
    quantity: 500,
    soldCount: 0,
    isAvailable: true,
    bgColor: 'bg-[#E8F5E9]'
  },
  {
    name: 'Blue Star',
    description: 'An amazing legendary star',
    price: 100,
    category: 'stars',
    rarity: 'legendary',
    quantity: 50,
    soldCount: 0,
    isAvailable: true,
    bgColor: 'bg-[#E3F2FD]'
  }
] as const

export async function seedGiftsAsync() {
  try {
    console.log('Подключение к MongoDB...')
    await connect(config.MONGODB_URI)
    console.log('✅ MongoDB подключена')

    console.log('Удаление существующих подарков...')
    await Gift.deleteMany({})

    console.log('Добавление новых подарков...')
    await Gift.insertMany(GIFTS)

    console.log('✅ Подарки успешно добавлены')
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