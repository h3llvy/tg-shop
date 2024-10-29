import type { IGift } from '../types/gift'

const mockGifts: IGift[] = [
  {
    id: '1',
    name: 'Delicious Cake',
    description: 'A tasty cake for your friend',
    price: 10,
    status: 'available' as const
  },
  {
    id: '2',
    name: 'Red Star',
    description: 'A shiny red star',
    price: 5,
    status: 'available' as const
  },
  {
    id: '3',
    name: 'Green Star',
    description: 'A beautiful green star',
    price: 5,
    status: 'available' as const
  },
  {
    id: '4',
    name: 'Blue Star',
    description: 'An amazing blue star',
    price: 5,
    status: 'available' as const
  },
  // Дублируем подарки для заполнения сетки
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `${i + 5}`,
    name: ['Delicious Cake', 'Red Star', 'Green Star', 'Blue Star'][i % 4],
    description: 'A wonderful gift',
    price: i % 2 ? 5 : 10,
    status: 'available' as const
  }))
]

export const giftService = {
  async getGifts(): Promise<IGift[]> {
    return mockGifts
  }
}
