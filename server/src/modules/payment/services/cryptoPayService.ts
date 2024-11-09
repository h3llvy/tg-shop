import CryptoBotAPI from 'crypto-bot-api'
import { config } from '../../../config'
import { LoggerService } from '../../core/services/loggerService'

class CryptoPayService {
  private readonly p_client: CryptoBotAPI
  private readonly p_logger: LoggerService

  constructor() {
    this.p_client = new CryptoBotAPI(config.CRYPTO_PAY_API_TOKEN)
    this.p_logger = new LoggerService()
  }

  public async createInvoiceAsync(amount: number, payload: string) {
    try {
      this.p_logger.logInfo('Создание инвойса:', { amount, payload })

      const invoice = await this.p_client.createInvoice({
        amount: amount.toString(),
        asset: 'TON',
        description: 'Gift Shop Purchase',
        payload,
        paid_btn_name: 'viewItem',
        paid_btn_url: `${config.WEBAPP_URL}/payment/success`,
        allow_comments: false,
        allow_anonymous: false,
        expires_in: 1800
      })

      this.p_logger.logInfo('Инвойс создан:', invoice)

      const invoiceUrl = `ton://invoice/${invoice.hash}`

      return {
        invoice_id: invoice.id,
        status: invoice.status,
        pay_url: invoiceUrl
      }
    } catch (error) {
      this.p_logger.logError('Ошибка создания инвойса:', error)
      throw error
    }
  }

  public async getInvoiceAsync(invoiceId: number) {
    try {
      const response = await this.p_client.getInvoices({ 
        invoice_ids: [invoiceId] 
      })
      return response.items[0]
    } catch (error) {
      this.p_logger.logError('Ошибка получения инвойса:', error)
      throw error
    }
  }
}

export const cryptoPayService = new CryptoPayService()
