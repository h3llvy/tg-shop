import { Router } from 'express'
import path from 'path'

export class AssetsController {
  public router = Router()
  private readonly assetsPath: string

  constructor() {
    this.assetsPath = path.join(__dirname, '../../../../public/assets')
    this.setupRoutes()
  }

  private setupRoutes() {
    this.router.get('/assets/:filename', this.getAsset.bind(this))
  }

  private getAsset(req: any, res: any) {
    const { filename } = req.params
    try {
      const filePath = path.join(this.assetsPath, filename)
      res.sendFile(filePath)
    } catch (error) {
      console.error('Ошибка отправки файла:', error)
      res.status(404).send('Файл не найден')
    }
  }
}
