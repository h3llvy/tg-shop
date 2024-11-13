FROM node:20-alpine 
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходные файлы
COPY . .


# Устанавливаем права на директории
RUN chown -R node:node /app

# Переключаемся на пользователя node
USER node

# Запускаем ts-node с флагом --transpile-only
CMD ["npx", "ts-node-dev", "--transpile-only", "--ignore-watch", "node_modules", "src/index.ts"]