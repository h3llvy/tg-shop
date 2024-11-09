import axios from 'axios'
import { telegramService } from '@/shared/services/telegram/telegramService'

class PaymentService {
  private readonly baseUrl = `${import.meta.env.VITE_API_URL}/api/payment`

  public async createPaymentAsync(amount: number, giftId: string): Promise<void> {
    try {
      // Создаем инвойс на сервере
      const { data } = await axios.post(`${this.baseUrl}`, {
        amount,
        payload: JSON.stringify({ giftId })
      })

      // Открываем нативное окно оплаты, передавая только хэш
      await telegramService.openInvoiceAsync(data.pay_url) // Здесь уже чистый хэш
    } catch (error) {
      console.error('Ошибка создания платежа:', error)
      throw error
    }
  }
}

export const paymentService = new PaymentService()
