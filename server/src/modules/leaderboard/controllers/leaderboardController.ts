import { Request, Response } from 'express'
import { LeaderboardService } from '../services/leaderboardService'
import { LoggerService } from '../../core/services/loggerService'

export class LeaderboardController {
  private readonly p_leaderboardService: LeaderboardService
  private readonly p_logger: LoggerService

  constructor() {
    this.p_leaderboardService = new LeaderboardService()
    this.p_logger = new LoggerService()
  }

  public async getLeaderboardAsync(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 50

      const result = await this.p_leaderboardService.getLeaderboardAsync(
        page,
        limit,
        req.user?.id
      )

      res.status(200).json(result)
    } catch (error) {
      this.p_logger.logError('Ошибка получения лидерборда:', error)
      res.status(500).json({ error: 'Ошибка получения лидерборда' })
    }
  }
} 