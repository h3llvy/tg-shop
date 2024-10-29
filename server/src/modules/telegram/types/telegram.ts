type ChatType = 'private' | 'group' | 'supergroup'

interface IChat {
  id: number
  type: ChatType
}

interface IMessage {
  message_id: number
  date: number
  text?: string
  chat: IChat
}

export type ITelegramUpdate = {
  update_id: number
  message?: IMessage
} 