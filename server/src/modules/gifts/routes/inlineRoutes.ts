import { Router } from 'express'
import { Gift } from '../../database/models'
import { asyncHandler } from '../../core/middleware/asyncHandler'

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

export const inlineRoutes = router 