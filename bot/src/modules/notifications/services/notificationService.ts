export class NotificationService {
  public async notifyGiftPurchaseAsync(_userId: number, _giftName: string): Promise<void> {
    // Уведомление о покупке подарка
  }

  public async notifyGiftReceivedAsync(_userId: number, _fromUser: string): Promise<void> {
    // Уведомление о получении подарка
  }

  public async notifyGiftSentAsync(_userId: number, _toUser: string): Promise<void> {
    // Уведомление об отправке подарка
  }
} 