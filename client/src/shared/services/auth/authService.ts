import axios from 'axios'
import { telegramService } from '../telegram/telegramService'

class AuthService {
  constructor() {
    axios.interceptors.request.use((config) => {
      const initData = telegramService.initData
      if (initData) {
        config.headers['Telegram-Web-App-Init-Data'] = initData
      }
      return config
    })

    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          try {
            await this.loginAsync()
            return axios(error.config)
          } catch (e) {
            console.error('Ошибка переавторизации:', e)
            throw error
          }
        }
        throw error
      }
    )
  }

  public async loginAsync(): Promise<void> {
    try {
      const initData = telegramService.initData
      if (!initData) {
        throw new Error('Отсутствуют данные инициализации')
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        initData
      })
    } catch (error) {
      console.error('Ошибка авторизации:', error)
      throw error
    }
  }
}

export const authService = new AuthService()