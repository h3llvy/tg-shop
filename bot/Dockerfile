FROM node:20-alpine
WORKDIR /app

# Устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем исходный код и assets
COPY . .

# Запускаем в режиме разработки
CMD ["npm", "run", "dev"]