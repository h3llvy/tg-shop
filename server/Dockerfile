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

# Создаем директории и копируем файлы
RUN mkdir -p static && \
    mkdir -p assets/defaults

# Копируем ассеты
COPY assets/defaults ./assets/defaults
COPY static ./static

# Проверяем наличие необходимых файлов
RUN if [ ! -f static/avatar.png ]; then \
      cp assets/defaults/avatar.png static/; \
    fi && \
    if [ ! -f static/botstart.png ]; then \
      cp assets/defaults/botstart.png static/; \
    fi 