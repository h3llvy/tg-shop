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
# Устанавливаем все зависимости, включая devDependencies для сборки
RUN npm install
# Устанавливаем TypeScript глобально
RUN npm install -g typescript
COPY . .
# Собираем проект
RUN npm run build
# Удаляем devDependencies после сборки
RUN npm prune --production
CMD ["npm", "start"] 