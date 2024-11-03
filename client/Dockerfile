FROM node:20-alpine

# Добавить ARG для сборочных переменных
ARG VITE_API_URL
ARG VITE_TELEGRAM_BOT_USERNAME
ARG VITE_PUBLIC_URL

# Сделать их доступными как ENV во время сборки
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_TELEGRAM_BOT_USERNAME=$VITE_TELEGRAM_BOT_USERNAME
ENV VITE_PUBLIC_URL=$VITE_PUBLIC_URL

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]