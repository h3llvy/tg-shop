import axios from 'axios'
import { telegramService } from '@/shared/services/telegram/telegramService'

class PaymentService {
  private readonly baseUrl = `${import.meta.env.VITE_API_URL}/api/payment`

  public async createPaymentAsync(amount: number, giftId: string, giftName: string, asset: string): Promise<void> {
    try {
      const { data } = await axios.post(`${this.baseUrl}`, {
        amount,
        giftId,
        giftName,
        asset
      })
  
      if (!data.result?.mini_app_invoice_url) {
        throw new Error('URL инвойса не получен от сервера')
      }
  
      return new Promise((resolve, reject) => {
        const handleInvoiceClosed = (event: any) => {
          window.Telegram.WebApp.offEvent('invoiceClosed', handleInvoiceClosed)
          
          switch(event.status) {
            case 'paid':
              console.log('Оплата успешна')
              resolve()
              break
            case 'cancelled':
              reject(new Error('Оплата отменена'))
              break
            case 'failed':
              reject(new Error('Ошибка оплаты'))
              break
            case 'pending':
              reject(new Error('Оплата в процессе'))
              break
          }
        }
  
        window.Telegram.WebApp.onEvent('invoiceClosed', handleInvoiceClosed)
        telegramService.openTelegramLink(data.result.mini_app_invoice_url + '&mode=compact')
      })
    } catch (error) {
      console.error('Ошибка создания платежа:', error)
      throw error
    }
  }
}

export const paymentService = new PaymentService()
