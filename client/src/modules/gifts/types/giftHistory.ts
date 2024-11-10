export interface IGiftHistoryUser {
  id: number
  firstName: string
  lastName?: string
  username?: string
}

export interface IGiftHistory {
  action: 'purchase' | 'send' | 'receive'
  timestamp: string
  user: IGiftHistoryUser
  recipient?: IGiftHistoryUser
  message?: string
} 