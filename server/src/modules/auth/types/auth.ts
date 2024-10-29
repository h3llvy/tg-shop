export interface IAuthUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}

export interface IInitDataPayload {
  user?: {
    id: number
    first_name: string
    last_name?: string
    username?: string
    language_code?: string
  }
  chat_instance?: string
  start_param?: string
}

export interface IAuthResponse {
  token: string
  user: IAuthUser
} 