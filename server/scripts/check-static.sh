#!/bin/bash

# Проверяем наличие директории static
if [ ! -d "static" ]; then
  echo "❌ Директория static не найдена"
  exit 1
fi

# Проверяем наличие поддиректории gifts
if [ ! -d "static/gifts" ]; then
  echo "❌ Директория static/gifts не найдена"
  exit 1
fi

# Проверяем наличие файлов
for file in static/gifts/*.png static/*.png; do
  if [ -f "$file" ]; then
    echo "✅ Файл $file существует"
    # Проверяем размер файла
    size=$(identify -format "%wx%h" "$file")
    echo "   Размер: $size"
  else
    echo "❌ Файл $file не найден"
  fi
done

# Проверяем права доступа
echo -e "\nПрава доступа:"
ls -l static/gifts/
ls -l static/ 