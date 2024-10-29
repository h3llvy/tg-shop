import { Router } from 'express'
import { PaymentController } from '../controllers/paymentController'
import { authMiddleware } from '../../auth/middleware/authMiddleware'

const router = Router()
const controller = new PaymentController()

router.post('/create', authMiddleware, (req, res) => {
  controller.createPaymentAsync(req, res)
})

router.get('/check/:invoiceId', authMiddleware, (req, res) => {
  controller.checkPaymentAsync(req, res)
})

router.post('/webhook', (req, res) => {
  controller.handleWebhookAsync(req, res)
})

export { router as paymentRoutes } 