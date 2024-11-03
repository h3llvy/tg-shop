import type { IUser } from '../types/user'
import { User } from '../models/User'

export class UserRepository {
  public async findByTelegramIdAsync(_telegramId: number): Promise<IUser | null> {
    return User.findOne({ telegramId: _telegramId })
  }

  public async createAsync(_userData: Partial<IUser>): Promise<IUser> {
    return User.create(_userData)
  }

  public async updateAsync(_telegramId: number, _update: Partial<IUser>): Promise<IUser | null> {
    return User.findOneAndUpdate(
      { telegramId: _telegramId },
      _update,
      { new: true }
    )
  }
} 