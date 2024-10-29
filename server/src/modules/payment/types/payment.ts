export interface IPaymentInvoice {
  asset: 'USDT' | 'TON' | 'BTC' | 'ETH'
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
  paid_btn_name?: string
  paid_btn_url?: string
  comment?: string
  payload?: string
  paid_at?: string
  created_at: string
  expiration_date?: string
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