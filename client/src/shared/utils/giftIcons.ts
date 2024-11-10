import deliciousCakeIcon from '../assets/icons/delicious-cake.svg'
import redStarIcon from '../assets/icons/red-star.svg'
import greenStarIcon from '../assets/icons/green-star.svg'
import blueStarIcon from '../assets/icons/blue-star.svg'
import defaultIcon from '../assets/icons/default.svg'

export const giftIcons = {
  'Delicious Cake': deliciousCakeIcon,
  'Red Star': redStarIcon,
  'Green Star': greenStarIcon,
  'Blue Star': blueStarIcon,
  default: defaultIcon
} as const

export const getGiftIcon = (name: string): string => {
  return giftIcons[name as keyof typeof giftIcons] || giftIcons.default
}