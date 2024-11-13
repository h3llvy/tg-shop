FROM node:20-alpine 
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./
RUN npm install

# Копируем исходные файлы
COPY src/ ./src/
COPY tsconfig.json ./
COPY .env ./


# Устанавливаем права на директории
RUN chown -R node:node /app

# Переключаемся на пользователя node
USER node

CMD ["npm", "run", "dev"]