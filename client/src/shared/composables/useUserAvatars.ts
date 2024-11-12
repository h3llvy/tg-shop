import { ref } from 'vue'
import { profileService } from '@/modules/profile/services/profileService'

export function useUserAvatars() {
  const userAvatars = ref<Record<number, string | null>>({})
  const loadingAvatars = ref<Record<number, boolean>>({})

  const loadUserAvatarAsync = async (userId: number) => {
    if (!userId || loadingAvatars.value[userId]) return
    
    try {
      loadingAvatars.value[userId] = true
      const avatar = await profileService.getUserAvatarAsync(userId)
      console.log('Загружена аватарка:', { userId, avatar })
      
      // Сохраняем URL аватарки
      if (typeof avatar === 'string') {
        userAvatars.value[userId] = avatar
      } else {
        userAvatars.value[userId] = null
      }
    } catch (error) {
      console.error('Ошибка загрузки аватара:', error)
      userAvatars.value[userId] = null
    } finally {
      loadingAvatars.value[userId] = false
    }
  }

  const getUserAvatar = (userId: number) => {
    const avatar = userAvatars.value[userId]
    console.log('Получение аватарки из кэша:', { userId, avatar })
    return avatar
  }

  const getUserInitials = (firstName: string, lastName?: string) => {
    if (!firstName) return '?'
    const firstInitial = firstName[0]
    const lastInitial = lastName ? lastName[0] : ''
    return (firstInitial + lastInitial).toUpperCase()
  }

  const getAvatarBackgroundColor = (userId: number) => {
    const colors = [
      '#FF885E', '#FF516A', '#FF6B81', '#FE8D71',
      '#77B8C4', '#4FB0C6', '#4C9EEB', '#7595FF',
      '#8E85EE', '#AA75FF', '#E57AF0', '#F178B6',
      '#7BC862', '#59B389', '#51B675', '#96B85B'
    ]
    return colors[userId % colors.length]
  }

  return {
    userAvatars,
    loadUserAvatarAsync,
    getUserAvatar,
    getUserInitials,
    getAvatarBackgroundColor
  }
} 