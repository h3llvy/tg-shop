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
      userAvatars.value[userId] = avatar
    } catch (error) {
      console.error('Ошибка загрузки аватара:', error)
      userAvatars.value[userId] = null
    } finally {
      loadingAvatars.value[userId] = false
    }
  }

  const getUserAvatar = (userId: number) => {
    return userAvatars.value[userId] || null
  }

  const getUserInitials = (name: string) => {
    if (!name) return '?'
    return name[0].toUpperCase()
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
    loadUserAvatarAsync,
    getUserAvatar,
    getUserInitials,
    getAvatarBackgroundColor
  }
} 