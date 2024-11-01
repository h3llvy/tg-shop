FROM node:20-alpine

WORKDIR /app

# Установка зависимостей для сборки
COPY package*.json ./
RUN npm install

# Копирование исходного кода
COPY . .

# Сборка приложения
ENV NODE_ENV=production
RUN npm run build

# Запуск preview сервера
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]