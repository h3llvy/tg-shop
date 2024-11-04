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
RUN npm install
COPY . .
RUN npm run build
# Копируем package.json с _moduleAliases
COPY package.json ./dist/
RUN cd dist && npm install --production
CMD ["node", "dist/index.js"] 