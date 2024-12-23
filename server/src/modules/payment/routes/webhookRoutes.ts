import { Router } from 'express'
import { WebhookController } from '../controllers/webhookController'

const router = Router()
// const controller = new WebhookController()

router.post('/webhook', (req, res) => {
  console.log('test')
  // controller.handleWebhookAsync(req, res)
})

export { router as webhookRoutes } 