import { GiftHistory } from '../../database/models/GiftHistory'
import { User } from '../../database/models/User'

export class GiftHistoryService {
  public async getGiftHistoryAsync(giftId: string) {
    const history = await GiftHistory.find({ giftId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()

    const userIds = history.map(h => h.userId)
    const users = await User.find({ telegramId: { $in: userIds } })
      .select('telegramId firstName lastName username')
      .lean()

    const userMap = new Map(users.map(u => [u.telegramId, u]))

    return history.map(h => ({
      action: h.action,
      timestamp: h.createdAt,
      user: userMap.get(h.userId)
    }))
  }
} 