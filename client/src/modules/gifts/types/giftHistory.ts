export interface IGiftHistoryUser {
  id: number
  firstName: string
  lastName?: string
  username?: string
}

export interface IGiftHistory {
  action: 'purchase' | 'send'
  user: IGiftHistoryUser
  recipient?: IGiftHistoryUser
  date: string
} 