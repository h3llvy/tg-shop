#!/bin/bash

# Создаем директорию static если её нет
mkdir -p server/static

# Проверяем наличие файлов
if [ ! -f "server/static/avatar.png" ]; then
  echo "Копируем avatar.png в static..."
  cp server/assets/defaults/avatar.png server/static/avatar.png
fi

if [ ! -f "server/static/botstart.png" ]; then
  echo "Копируем botstart.png в static..."
  cp server/assets/defaults/botstart.png server/static/botstart.png
fi

echo "Проверка статических файлов завершена" 