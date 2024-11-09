import { Router } from 'express'
import { PaymentController } from '../controllers/paymentController'
import { telegramAuthMiddleware } from '../../auth/middleware/telegramAuthMiddleware'

const router = Router()
const controller = new PaymentController()

// Создание платежа (требует авторизации)
router.post('/', telegramAuthMiddleware, (req, res, next) => {
  controller.createPaymentAsync(req, res).catch(next)
})

// Проверка статуса платежа (требует авторизации)
router.get('/:invoiceId', telegramAuthMiddleware, (req, res, next) => {
  controller.checkPaymentAsync(req, res).catch(next)
})

// Вебхук от Crypto Pay (не требует авторизации)
router.post('/webhook', (req, res, next) => {
  controller.handleWebhookAsync(req, res).catch(next)
})

export { router as paymentRoutes } 