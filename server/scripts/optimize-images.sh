#!/bin/bash

# Устанавливаем ImageMagick если не установлен
if ! command -v convert &> /dev/null; then
    echo "ImageMagick не установлен. Устанавливаем..."
    apt-get update && apt-get install -y imagemagick
fi

# Директория со статическими файлами
STATIC_DIR="static"
GIFTS_DIR="$STATIC_DIR/gifts"

# Создаем директории если не существуют
mkdir -p "$GIFTS_DIR"

# Оптимизируем все PNG файлы
optimize_image() {
    local input=$1
    local output=$1
    
    echo "Оптимизация $input..."
    
    # Изменяем размер до 100x100 и оптимизируем
    convert "$input" -resize 100x100 -strip -quality 85 "$output"
    
    echo "✅ Готово: $output"
}

# Обрабатываем все PNG файлы
find "$STATIC_DIR" -name "*.png" -type f | while read -r file; do
    optimize_image "$file"
done

echo "Все изображения оптимизированы!" 