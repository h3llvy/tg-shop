FROM node:20-alpine 
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем typescript и ts-node глобально
RUN npm install -g typescript ts-node

# Устанавливаем зависимости
RUN npm install

# Копируем исходные файлы и конфигурацию
COPY . .

# Создаем необходимые директории
RUN mkdir -p static/gifts

# Устанавливаем права на директории
RUN chown -R node:node /app

# Переключаемся на пользователя node
USER node

# Компилируем TypeScript
RUN npm run build

# Запускаем скомпилированное приложение
CMD ["node", "dist/index.js"]