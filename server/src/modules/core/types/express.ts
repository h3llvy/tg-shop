import { Request } from 'express'

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number
    first_name: string
    last_name?: string
    username?: string
    language_code?: string
  }
} 