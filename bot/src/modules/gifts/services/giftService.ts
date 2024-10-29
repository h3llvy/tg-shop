import { apiService } from '../../core/services/apiService'
import { LoggerService } from '../../core/services/loggerService'
import type { IGift, IGiftPurchase, IGiftSend } from '../types/gift'

export class GiftService {
  private readonly p_logger: LoggerService

  constructor() {
    this.p_logger = new LoggerService()
  }

  public async getGiftByIdAsync(_giftId: string): Promise<IGift> {
    try {
      return await apiService.getGiftAsync(_giftId)
    } catch (error) {
      this.p_logger.logError(error as Error, 'GiftService.getGiftByIdAsync')
      throw error
    }
  }

  public async purchaseGiftAsync(_purchase: IGiftPurchase): Promise<IGift> {
    try {
      return await apiService.purchaseGiftAsync(_purchase)
    } catch (error) {
      this.p_logger.logError(error as Error, 'GiftService.purchaseGiftAsync')
      throw error
    }
  }

  public async sendGiftAsync(_send: IGiftSend): Promise<IGift> {
    try {
      return await apiService.sendGiftAsync(_send.giftId, _send.toUserId)
    } catch (error) {
      this.p_logger.logError(error as Error, 'GiftService.sendGiftAsync')
      throw error
    }
  }

  public async getAllGiftsAsync(): Promise<IGift[]> {
    try {
      return await apiService.getAllGiftsAsync()
    } catch (error) {
      this.p_logger.logError(error as Error, 'GiftService.getAllGiftsAsync')
      throw error
    }
  }
} 