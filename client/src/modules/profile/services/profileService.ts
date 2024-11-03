import axios from 'axios'
import { telegramService } from '@/shared/services/telegram/telegramService'

const API_URL = import.meta.env.VITE_API_URL
console.log('API_URL')
console.log(API_URL)

if (!API_URL) {
  console.error('VITE_API_URL не определен. Проверьте переменные окружения в Coolify.')
  throw new Error('VITE_API_URL не определен')
}

interface IProfileResponse {
  avatarUrl: string
}

export const profileService = {
  async getUserAvatarAsync(): Promise<string | null> {
    try {
      const user = telegramService.user
      console.log('Текущий пользователь:', user)
      
      if (!user) {
        throw new Error('Пользователь не авторизован')
      }
  
      console.log('Отправка запроса на получение аватара для пользователя:', user.id)
      const { data } = await axios.get<IProfileResponse>(`${API_URL}/api/users/me/avatar`, {
        params: { userId: user.id }
      })
      console.log('Получен ответ с аватаром:', data)
      
      return data.avatarUrl
    } catch (error) {
      console.error('Ошибка при получении аватара:', error)
      return null
    }
  }
}
