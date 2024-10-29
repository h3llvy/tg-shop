export class BotError extends Error {
  constructor(_message: string) {
    super(_message)
    this.name = 'BotError'
  }
}

export class PaymentError extends BotError {
  constructor(_message: string) {
    super(_message)
    this.name = 'PaymentError'
  }
}

export class GiftError extends BotError {
  constructor(_message: string) {
    super(_message)
    this.name = 'GiftError'
  }
}

export class WebhookError extends BotError {
  constructor(_message: string) {
    super(_message)
    this.name = 'WebhookError'
  }
} 