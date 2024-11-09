import { User } from '../../database/models/User'
import { LoggerService } from '../../core/services/loggerService'

export class LeaderboardService {
  private readonly p_logger: LoggerService

  constructor() {
    this.p_logger = new LoggerService()
  }

  public async getLeaderboardAsync(_page: number, _limit: number, _userId?: number) {
    try {
      const skip = (_page - 1) * _limit

      // Используем агрегацию для подсчета общего количества подарков
      const users = await User.aggregate([
        {
          $addFields: {
            totalGifts: { $sum: ['$giftsReceived', '$giftsSent'] }
          }
        },
        {
          $sort: { totalGifts: -1 }
        },
        {
          $skip: skip
        },
        {
          $limit: _limit
        },
        {
          $project: {
            _id: 0,
            telegramId: 1,
            firstName: 1,
            lastName: 1,
            username: 1,
            giftsReceived: 1,
            giftsSent: 1,
            totalGifts: 1,
            lastActive: 1
          }
        }
      ])

      const total = await User.countDocuments()

      // Если есть userId, получаем позицию пользователя
      let userPosition = null
      if (_userId) {
        const currentUser = await User.findOne({ telegramId: _userId })
        if (currentUser) {
          const totalGifts = currentUser.giftsReceived + currentUser.giftsSent
          const betterUsers = await User.countDocuments({
            $expr: {
              $gt: [
                { $sum: ['$giftsReceived', '$giftsSent'] },
                totalGifts
              ]
            }
          })
          userPosition = betterUsers + 1
        }
      }

      // Форматируем данные для ответа
      const formattedUsers = users.map((user, index) => ({
        id: user.telegramId,
        name: `${user.firstName} ${user.lastName || ''}`.trim(),
        username: user.username,
        giftsCount: user.totalGifts,
        giftsReceived: user.giftsReceived,
        giftsSent: user.giftsSent,
        lastActive: user.lastActive,
        position: skip + index + 1
      }))

      return {
        users: formattedUsers,
        total,
        currentPage: _page,
        totalPages: Math.ceil(total / _limit),
        userPosition
      }
    } catch (error) {
      this.p_logger.logError('Ошибка получения данных лидерборда:', error)
      throw error
    }
  }
} 