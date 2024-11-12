# Базовый образ
FROM node:20-alpine as base
WORKDIR /app
COPY package*.json ./

# Образ для продакшена
FROM base as production
RUN npm install --production
COPY . .
RUN npm run build
CMD ["node", "dist/index.js"]
