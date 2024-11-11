#!/bin/bash

# Создаем директории
mkdir -p static/gifts

# Создаем тестовые изображения с помощью ImageMagick
convert -size 400x400 xc:pink -pointsize 40 -gravity center -draw "text 0,0 'Cake'" static/gifts/cake.png
convert -size 400x400 xc:red -pointsize 40 -gravity center -draw "text 0,0 '★'" static/gifts/red-star.png
convert -size 400x400 xc:green -pointsize 40 -gravity center -draw "text 0,0 '★'" static/gifts/green-star.png
convert -size 400x400 xc:blue -pointsize 40 -gravity center -draw "text 0,0 '★'" static/gifts/blue-star.png

# Создаем аватар по умолчанию
convert -size 400x400 xc:gray -pointsize 40 -gravity center -draw "text 0,0 'Gift'" static/avatar.png

# Оптимизируем изображения
for img in static/gifts/*.png static/*.png; do
  echo "Оптимизация $img..."
  convert "$img" -strip -quality 85 "$img"
done

# Устанавливаем права
chmod 644 static/gifts/* static/*.png

echo "Статические файлы подготовлены в директории static/"
ls -l static/gifts/
ls -l static/