FROM node:20-alpine 
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходные файлы
COPY . .

# Создаем директорию для статических файлов
RUN mkdir -p static/gifts

# Устанавливаем права на директории
RUN chown -R node:node /app

# Переключаемся на пользователя node
USER node

# Запускаем приложение без проверки типов
CMD ["npm", "run", "start"]