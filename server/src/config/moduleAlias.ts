import moduleAlias from 'module-alias'
import path from 'path'

// Настраиваем пути для разработки
moduleAlias.addAliases({
  '@': path.join(__dirname, '../')
}) 