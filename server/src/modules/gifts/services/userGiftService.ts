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

  public async sendGiftAsync(
    giftId: string,
    fromUserId: number,
    toUserId: number,
    message?: string
  ): Promise<IUserGift> {
    const userGift = await UserGift.findOne({
      giftId,
      userId: fromUserId,
      status: 'purchased'
    })

    if (!userGift) throw new Error('Gift not found or already sent')

    userGift.status = 'sent'
    userGift.recipientId = toUserId
    userGift.sentDate = new Date()
    userGift.history.push({
      action: 'send',
      fromUserId,
      toUserId,
      date: new Date()
    })

    if (message) {
      userGift.metadata.giftMessage = message
    }

    await userGift.save()
    return userGift
  }

  public async receiveGiftAsync(
    giftId: string,
    fromUserId: number,
    toUserId: number
  ): Promise<IUserGift> {
    const userGift = await UserGift.findOne({
      giftId,
      userId: fromUserId,
      recipientId: toUserId,
      status: 'sent'
    })

    if (!userGift) throw new Error('Gift not found or already received')

    userGift.status = 'received'
    userGift.receivedDate = new Date()
    userGift.history.push({
      action: 'receive',
      fromUserId,
      toUserId,
      date: new Date()
    })

    // Передаем подарок получателю
    userGift.userId = toUserId

    await userGift.save()
    return userGift
  }
} 