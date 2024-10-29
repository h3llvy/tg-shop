import axios from 'axios'
import type { IPaymentInvoice, IPaymentWebhook, ICreateInvoiceResponse } from '../types/payment'

export class CryptoPayService {
  private readonly p_apiUrl: string
  private readonly p_token: string

  constructor() {
    const token = process.env.CRYPTO_PAY_API_TOKEN
    if (!token) {
      throw new Error('Не задан CRYPTO_PAY_API_TOKEN')
    }
    this.p_token = token
    this.p_apiUrl = 'https://pay.crypt.bot/api'
  }

  private async requestAsync<T>(method: string, data?: any): Promise<T> {
    try {
      const { data: response } = await axios.post<{ ok: boolean, result: T }>(
        `${this.p_apiUrl}/${method}`,
        data,
        {
          headers: {
            'Crypto-Pay-API-Token': this.p_token
          }
        }
      )

      if (!response.ok) {
        throw new Error('API вернул ошибку')
      }

      return response.result
    } catch (error) {
      console.error(`Ошибка запроса к ${method}:`, error)
      throw error
    }
  }

  public async createInvoiceAsync(_amount: number, _description: string): Promise<ICreateInvoiceResponse> {
    const payload: IPaymentInvoice = {
      asset: 'TON',
      amount: _amount.toString(),
      description: _description,
      paid_btn_name: 'callback',
      paid_btn_url: `${process.env.PUBLIC_URL}/payment/success`,
      hidden_message: 'Спасибо за покупку!',
      allow_comments: true,
      allow_anonymous: false,
      expires_in: 3600 // 1 час
    }

    return this.requestAsync<ICreateInvoiceResponse>('createInvoice', payload)
  }

  public async getInvoiceAsync(_invoiceId: number): Promise<ICreateInvoiceResponse> {
    return this.requestAsync<ICreateInvoiceResponse>('getInvoice', { invoice_id: _invoiceId })
  }

  public async handleWebhookAsync(_data: IPaymentWebhook): Promise<void> {
    try {
      if (_data.status === 'paid') {
        // Здесь логика обработки успешного платежа
        console.log('Платеж успешно обработан:', _data)
      }
    } catch (error) {
      console.error('Ошибка обработки платежа:', error)
      throw error
    }
  }

  public async checkPaymentAsync(_invoiceId: number): Promise<boolean> {
    try {
      const invoice = await this.getInvoiceAsync(_invoiceId)
      return invoice.status === 'paid'
    } catch (error) {
      console.error('Ошибка проверки платежа:', error)
      return false
    }
  }

  public async getBalanceAsync(): Promise<Array<{ currency: string, available: string }>> {
    return this.requestAsync('getBalance')
  }

  public async getExchangeRatesAsync(): Promise<Array<{ source: string, target: string, rate: string }>> {
    return this.requestAsync('getExchangeRates')
  }
}
