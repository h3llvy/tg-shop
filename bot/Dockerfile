# Базовый образ
FROM node:20-alpine as base
WORKDIR /app
COPY package*.json ./

# Образ для разработки
FROM base as development
RUN npm install
# Копируем все файлы, включая ассеты
COPY . .
# Создаем символическую ссылку для ассетов в dist
RUN mkdir -p dist && ln -s /app/assets /app/dist/assets
CMD ["npm", "run", "dev"]

# Образ для продакшена
FROM base as production
RUN npm install
COPY . .
RUN npm run build
# Копируем ассеты в dist
RUN cp -r assets dist/
RUN npm prune --production
CMD ["npm", "start"]