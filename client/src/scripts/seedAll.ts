import mongoose, {connect} from 'mongoose'
import Product from "@/entities/Product";
import db from "@/services/db";

async function seedAllAsync() {
    try {
        console.log('Подключение к MongoDB...')
        db.connect()
        console.log('✅ MongoDB подключена')

        const items = [
            {
                "image": "bed-1.jpg",
                "price": "20 999 ₽ ",
                "subtitle": "Кровать с подъемным механизмом Paloma 160х200 см",
                "id": 1
            },
            {
                "image": "bed-2.jpg",
                "price": "18 999 ₽ ",
                "subtitle": "Кровать с подъемным механизмом Paloma 120х200 см, морской, велюр",
                "id": 2
            },
            {
                "image": "bed-3.jpg",
                "price": "18 999 ₽ ",
                "subtitle": "Кровать с подъемным механизмом Paloma 120х200 см",
                "id": 3
            },
            {
                "image": "bed-4.jpg",
                "price": "18 999 ₽ ",
                "subtitle": "Кровать с подъемным механизмом Paloma 120х200 см",
                "id": 4
            },
            {
                "image": "bed-5.jpg",
                "price": "18 999 ₽ ",
                "subtitle": "Кровать с подъемным механизмом Paloma 120х200 см",
                "id": 5
            },
            {
                "image": "bed-6.jpg",
                "price": "6 699 ₽ ",
                "subtitle": "Кровать двойная МСП цвет дуб золотой, камень тёмный 140х200 см",
                "id": 6
            },
            {
                "image": "bed-7.jpg",
                "price": "10 599 ₽ ",
                "subtitle": "Каркас кровати Paloma цвет серый 120х200 см",
                "id": 7
            },
            {
                "image": "bed-8.jpg",
                "price": "17 999 ₽ ",
                "subtitle": "Каркас кровати Вена цвет бежевый 180х200 см",
                "id": 8
            },
            {
                "image": "bed-9.jpg",
                "price": "4 299 ₽ ",
                "subtitle": "Кровать Мета цвет чёрный 80х200 см",
                "id": 9
            },
            {
                "image": "bed-10.jpg",
                "price": "5 999 ₽ ",
                "subtitle": "Кровать Капри цвет белый текстурный 140х200 см",
                "id": 10
            },
            {
                "image": "bed-11.jpg",
                "price": "9 599 ₽ ",
                "subtitle": "Каркас кровати Астра цвет серый 90х200 см, ЛДСП",
                "id": 11
            },
            {
                "image": "bed-12.jpg",
                "price": "5 999 ₽ ",
                "subtitle": "Кровать Софт цвет белый 90х200 см",
                "id": 12
            },
            {
                "image": "bed-13.jpg",
                "price": "6 999 ₽ ",
                "subtitle": "Кровать двойная Токио без подъёмного механизма цвет белый текстурный",
                "id": 13
            },
            {
                "image": "bed-14.jpg",
                "price": "34 999 ₽ ",
                "subtitle": "Кровать c подъёмным механизмом Вена 180х200 см",
                "id": 14
            },
            {
                "image": "bed-15.jpg",
                "price": "34 999 ₽ ",
                "subtitle": "Кровать с подъемным механизмом Вена 180х200 см, бежевый, велюр",
                "id": 15
            },
            {
                "image": "bed-16.jpg",
                "price": "12 999 ₽ ",
                "subtitle": "Кровать Эстери 1 цвет белый античный 90х200 см",
                "id": 16
            },
            {
                "image": "bed-17.jpg",
                "price": "11 999 ₽ ",
                "subtitle": "Каркас кровати Fresco цвет белый, дуб вотан 140х200 см",
                "id": 17
            },
            {
                "image": "bed-18.jpg",
                "price": "11 799 ₽ ",
                "subtitle": "Каркас кровати Глазго цвет таксония, металл бруклин, серый 160х200 см",
                "id": 18
            },
            {
                "image": "bed-19.jpg",
                "price": "6 299 ₽ ",
                "subtitle": "Кровать Мира цвет чёрный 140х200 см",
                "id": 19
            },
            {
                "image": "bed-20.jpg",
                "price": "19 499 ₽ ",
                "subtitle": "Каркас кровати SCANDICA Wilma цвет белый гладкий, чёрный гладкий 160х200 см",
                "id": 20
            },
            {
                "image": "bed-21.jpg",
                "price": "6 199 ₽ ",
                "subtitle": "Каркас кровати Соренто цвет дуб Бонифаций, дуб Бордо 90х200 см",
                "id": 21
            },
            {
                "image": "bed-22.jpg",
                "price": "11 499 ₽ ",
                "subtitle": "Каркас кровати Paloma цвет серо-бежевый 160х200 см",
                "id": 22
            },
            {
                "image": "bed-23.jpg",
                "price": "32 999 ₽ ",
                "subtitle": "Кровать с подъёмным механизмом Victori цвет молочный 160х200 см",
                "id": 23
            },
            {
                "image": "bed-24.jpg",
                "price": "19 999 ₽ ",
                "subtitle": "Каркас кровати SOLANA Briana цвет кофейный 140х200 см",
                "id": 24
            },
            {
                "image": "bed-25.jpg",
                "price": "4 999 ₽ ",
                "subtitle": "Кровать Варта 90х200 см",
                "id": 25
            },
            {
                "image": "bed-26.jpg",
                "price": "9 599 ₽ ",
                "subtitle": "Каркас кровати Астра цвет бежевый 90х200 см",
                "id": 26
            },
            {
                "image": "bed-27.jpg",
                "price": "31 999 ₽ ",
                "subtitle": "Кровать левосторонняя c подъёмным механизмом Тред цвет тёмно-серый 120х200 см",
                "id": 27
            },
            {
                "image": "bed-28.jpg",
                "price": "19 499 ₽ ",
                "subtitle": "Каркас кровати Линда цвет белый снег, белый 160х200 см",
                "id": 28
            }
        ];

        await Product.deleteMany();
        await Product.insertMany(items);

        console.log('✅ Все данные успешно добавлены')
        process.exit(0)
    } catch (error) {
        console.error('❌ Ошибка:', error)
        process.exit(1)
    }
}

seedAllAsync()