import { Router } from 'express'
import { asyncHandler } from '../../core/types/express'
import { Gift } from '../../database/models'

const router = Router()

router.get('/:id/inline', asyncHandler(async (req, res) => {
  const { id } = req.params
  const gift = await Gift.findById(id)
    .select('name description image prices')
    .lean()

  if (!gift) {
    return res.status(404).json({ error: 'Gift not found' })
  }

  const imageUrl = gift.image.startsWith('http') 
    ? gift.image 
    : `${process.env.SERVER_URL}/static/${gift.image}`

  res.json({
    ...gift,
    image: imageUrl
  })
}))

export { router as inlineRoutes } 