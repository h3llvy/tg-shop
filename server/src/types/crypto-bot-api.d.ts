declare module 'crypto-bot-api' {
  export type NetworkType = 'mainnet' | 'testnet'
  
  export interface ApiOptions {
    hostname?: string
    protocol?: string
  }

  export interface CreateInvoiceParams {
    amount: string
    asset: string
    description?: string
    hidden_message?: string
    paid_btn_name?: string
    paid_btn_url?: string
    payload?: string
    allow_comments?: boolean
    allow_anonymous?: boolean
    expires_in?: number
  }

  export interface Invoice {
    id: number
    status: 'active' | 'paid' | 'expired'
    hash: string
    currency: string
    amount: string
    botPayUrl: string
    miniAppPayUrl: string
    webAppPayUrl: string
    created_at: string
    expiration_date?: string
    paid_at?: string
    allow_comments: boolean
    allow_anonymous: boolean
    description: string
  }

  export default class CryptoBotAPI {
    constructor(token: string, network?: NetworkType)
    createInvoice(params: CreateInvoiceParams): Promise<Invoice>
    getInvoices(params?: { invoice_ids?: number[] }): Promise<{ items: Invoice[] }>
  }
} 