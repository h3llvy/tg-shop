import CryptoBotAPI from 'crypto-bot-api'
import { config } from '../../../config'
import { LoggerService } from '../../core/services/loggerService'
import { CryptoAsset } from '../types/payment'

class CryptoPayService {
  private readonly p_client: CryptoBotAPI
  private readonly p_logger: LoggerService

  constructor() {
    this.p_logger = new LoggerService()
    
    try {
      if (!config.CRYPTO_PAY_API_TOKEN) {
        throw new Error('CRYPTO_PAY_API_TOKEN не задан в конфигурации')
      }
      
      const isTestnet = config.CRYPTO_PAY_API_TOKEN.startsWith('20028:')
      
      this.p_logger.logInfo('Инициализация CryptoPay с токеном:', {
        tokenPreview: `${config.CRYPTO_PAY_API_TOKEN.substring(0, 5)}...${config.CRYPTO_PAY_API_TOKEN.slice(-5)}`,
        environment: isTestnet ? 'testnet' : 'mainnet'
      })
      
      this.p_client = new CryptoBotAPI(
        config.CRYPTO_PAY_API_TOKEN,
        isTestnet ? 'testnet' : 'mainnet'
      )
    } catch (error) {
      this.p_logger.logError('Ошибка инициализации CryptoPay клиента:', error)
      throw error
    }
  }

  public async createInvoiceAsync(amount: number, payload: string, giftName: string, asset: CryptoAsset) {
    try {
      this.p_logger.logInfo('Создание инвойса:', { amount, payload, giftName, asset })
      
      const params = {
        amount: amount.toString(),
        asset,
        description: `Purchasing a ${giftName}`,
        payload,
        paid_btn_name: 'viewItem' as const,
        paid_btn_url: `${config.WEBAPP_URL}/payment/success`,
        allow_comments: false,
        allow_anonymous: false,
        expires_in: 1800,
        hidden_message: config.BOT_NAME
      }

      this.p_logger.logInfo('Параметры инвойса:', params)
      
      const invoice = await this.p_client.createInvoice(params)
      
      this.p_logger.logInfo('Ответ от Crypto Pay API:', invoice)
      
      if (!invoice) {
        throw new Error('Пустой ответ от Crypto Pay API')
      }

      if (!invoice.miniAppPayUrl) {
        throw new Error(`URL для оплаты отсутствует в ответе: ${JSON.stringify(invoice)}`)
      }

      return {
        invoice_id: invoice.id,
        status: invoice.status,
        result: {
          mini_app_invoice_url: invoice.miniAppPayUrl
        }
      }
    } catch (error: any) {
      this.p_logger.logError('Ошибка создания инвойса:', {
        error: error.message,
        stack: error.stack,
        response: error.response?.data,
        token: config.CRYPTO_PAY_API_TOKEN ? '***' : 'не задан'
      })
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
