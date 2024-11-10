export type CryptoAsset = 'USDT' | 'TON' | 'BTC' | 'ETH'

export interface IPaymentInvoice {
  asset: CryptoAsset
  amount: string
  description: string
  hidden_message?: string
  paid_btn_name?: 'viewItem' | 'openChannel' | 'openBot' | 'callback'
  paid_btn_url?: string
  payload?: string
  allow_comments?: boolean
  allow_anonymous?: boolean
  expires_in?: number
}

export interface IPaymentWebhook {
  id: number
  status: 'active' | 'paid' | 'expired'
  hash: string
  asset: string
  amount: string
  fee: string
  fee_asset: string
  paid_anonymously: boolean
  payload: string
  paid_at?: string
  created_at: string
  user_id?: number
}

export interface ICreateInvoiceResponse {
  invoice_id: number
  status: 'active' | 'paid' | 'expired'
  hash: string
  asset: string
  amount: string
  pay_url: string
  created_at: string
  expiration_date?: string
  paid_at?: string
  allow_comments: boolean
  allow_anonymous: boolean
  description: string
}

export interface IInvoice {
  id: number
  status: 'active' | 'paid' | 'expired'
  hash: string
  asset: string
  amount: string
  payload?: string
  description?: string
  created_at: Date
  paid_at?: Date
  paid_anonymously?: boolean
  comment?: string
}

export interface IPayment {
  invoiceId: number
  status: 'pending' | 'completed' | 'failed'
  amount: number
  asset: string
  giftId: string
  userId: number
  createdAt: Date
  updatedAt: Date
} 