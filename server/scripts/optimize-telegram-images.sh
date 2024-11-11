#!/bin/bash

# Директории
STATIC_DIR="static"
GIFTS_DIR="$STATIC_DIR/gifts"
TEMP_DIR="$STATIC_DIR/temp"

# Создаем временную директорию
mkdir -p "$TEMP_DIR"

# Функция оптимизации изображения для Telegram
optimize_for_telegram() {
    local input=$1
    local output=$2
    
    convert "$input" \
        -resize "64x64^" \
        -gravity center \
        -extent 64x64 \
        -quality 85 \
        -strip \
        -format png \
        -background white \
        -alpha remove \
        "$output"
}

# Оптимизируем все изображения подарков
for img in "$GIFTS_DIR"/*.png; do
    if [ -f "$img" ]; then
        filename=$(basename "$img")
        temp_file="$TEMP_DIR/$filename"
        
        echo "Оптимизация $filename..."
        optimize_for_telegram "$img" "$temp_file"
        
        # Проверяем размер
        size=$(stat -f%z "$temp_file")
        if [ "$size" -lt 1048576 ]; then # Меньше 1MB
            mv "$temp_file" "$img"
            echo "✅ Успешно оптимизировано: $filename ($(identify -format "%wx%h" "$img"))"
        else
            echo "❌ Файл слишком большой после оптимизации: $filename"
            rm "$temp_file"
        fi
    fi
done

# Очищаем временную директорию
rm -rf "$TEMP_DIR"

echo "Оптимизация завершена!" 