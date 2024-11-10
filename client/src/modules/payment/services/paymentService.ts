import axios from 'axios'
import { telegramService } from '@/shared/services/telegram/telegramService'

interface CreatePaymentParams {
  amount: number;
  asset: string;
  giftId: string;
  giftName: string;
}

class PaymentService {
  private readonly baseUrl = `${import.meta.env.VITE_API_URL}/api/payment`
  private cryptoPayCallbacks: Map<string, () => void> = new Map()

  public async createPaymentAsync(params: CreatePaymentParams): Promise<any> {
    try {
      const { data } = await axios.post(
        this.baseUrl, 
        params,
        {
          headers: {
            'Content-Type': 'application/json',
            'Telegram-Web-App-Init-Data': window.Telegram?.WebApp?.initData || ''
          }
        }
      )

      if (!data.success || !data.data?.pay_url) {
        throw new Error(data.error || 'Payment creation failed')
      }

      // Открываем CryptoPay через Telegram WebApp
      window.Telegram?.WebApp?.openTelegramLink(data.data.pay_url)

      return {
        success: true,
        invoiceId: data.data.invoice_id
      }
    } catch (error: any) {
      console.error('Ошибка создания платежа:', error)
      throw error
    }
  }
}
export const paymentService = new PaymentService()

