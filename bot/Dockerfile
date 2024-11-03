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
# Сначала устанавливаем ВСЕ зависимости (включая devDependencies)
RUN npm install
# Копируем исходники
COPY . .
# Собираем проект
RUN npm run build
# Удаляем devDependencies и оставляем только prod
RUN npm prune --production
# Запускаем собранное приложение
CMD ["npm", "start"] 