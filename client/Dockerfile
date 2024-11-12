# Базовый образ для разработки и продакшена
FROM node:20-alpine as base
WORKDIR /app
COPY package*.json ./

# Образ для продакшена
FROM base as production
RUN npm install
COPY . .

# Добавляем ARG для сборочных переменных
ARG VITE_API_URL
ARG VITE_TELEGRAM_BOT_USERNAME
ARG VITE_PUBLIC_URL
ARG VITE_CRYPTO_PAY_API_URL

# Делаем их доступными как ENV во время сборки
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_TELEGRAM_BOT_USERNAME=$VITE_TELEGRAM_BOT_USERNAME
ENV VITE_PUBLIC_URL=$VITE_PUBLIC_URL
ENV VITE_CRYPTO_PAY_API_URL=$VITE_CRYPTO_PAY_API_URL

# Собираем проект
RUN npm run build

# Устанавливаем serve для раздачи статики
RUN npm install -g serve

CMD ["serve", "-s", "dist", "-p", "3000"]
