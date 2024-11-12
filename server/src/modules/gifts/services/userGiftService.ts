import { UserGift, Gift } from '../../database/models'
import type { IUserGift } from '../../database/models/UserGift'
import { LoggerService } from '../../core/services/loggerService'

export class UserGiftService {
  private readonly p_logger = new LoggerService()

  public async purchaseGiftAsync(
    userId: number,
    giftId: string,
    price: number,
    asset: string,
    invoiceId: number
  ): Promise<IUserGift> {
    const gift = await Gift.findById(giftId)
    if (!gift) throw new Error('Gift not found')

    // Получаем следующий порядковый номер
    const serialNumber = gift.soldCount + 1
    const totalAvailable = gift.availableQuantity + gift.soldCount

    const userGift = await UserGift.create({
      userId,
      giftId,
      purchasePrice: price,
      purchaseAsset: asset,
      serialNumber,
      totalAvailable,
      history: [{
        action: 'purchase',
        fromUserId: userId,
        price,
        asset
      }],
      metadata: {
        purchaseInvoiceId: invoiceId,
        originalPrice: gift.prices[asset]
      }
    })

    // Обновляем количество проданных подарков
    await Gift.findByIdAndUpdate(giftId, {
      $inc: { soldCount: 1, availableQuantity: -1 }
    })

    return userGift
  }

  public async getUserGiftsAsync(userId: number): Promise<IUserGift[]> {
    return UserGift.find({ userId })
      .populate('giftId')
      .sort({ purchaseDate: -1 })
  }

  public async getGiftHistoryAsync(giftId: string): Promise<IUserGift[]> {
    return UserGift.find({ giftId })
      .populate('userId', 'firstName lastName username avatar')
      .sort({ purchaseDate: -1 })
  }
} 