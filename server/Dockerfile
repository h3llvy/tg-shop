# Базовый образ
FROM node:20-alpine as base
WORKDIR /app
COPY package*.json ./

# Образ для разработки
FROM base as development
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

# Образ для продакшена
FROM base as production
RUN npm install --production
COPY . .
RUN npm run build
CMD ["npm", "start"] 