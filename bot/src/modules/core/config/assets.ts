import path from 'path'

export const BOT_ASSETS = {
  AVATAR_URL: `${process.env.BOT_ASSETS_URL}/avatar.png`,
  START_IMAGE: path.join(__dirname, '../../../../assets/botstart.png')
} as const
