export interface IGift {
  id: string
  name: string
  description: string
  price: number
  category: 'cakes' | 'stars'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  quantity: number
  soldCount: number
  isAvailable: boolean
  bgColor: string
} 