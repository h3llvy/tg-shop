import mongoose, {connect} from 'mongoose'
import Product from "@/entities/Product";

async function seedAllAsync() {
    try {
        console.log('Подключение к MongoDB...')
        await connect(config.MONGODB_URI)
        console.log('✅ MongoDB подключена')

        const items = [
            {
                "image": "https://hoff.ru/upload/iblock/ee2/4ovmrr9dowmqmnqldyv8ltqet8z75e5q.jpg",
                "price": "20 999 ₽ ",
                "subtitle": "Кровать с подъемным механизмом Paloma 160х200 см",
                "id": 1
            },
            {
                "image": "https://hoff.ru/upload/iblock/e30/g3iq8kat5mw4igpdlgwuj46fyje9lyth.jpg",
                "price": "18 999 ₽ ",
                "subtitle": "Кровать с подъемным механизмом Paloma 120х200 см, морской, велюр",
                "id": 2
            },
            {
                "image": "https://hoff.ru/upload/iblock/e1b/tn3in56j3o85px00mbytxnxdajqim280.jpg",
                "price": "18 999 ₽ ",
                "subtitle": "Кровать с подъемным механизмом Paloma 120х200 см",
                "id": 3
            },
            {
                "image": "https://hoff.ru/upload/iblock/f55/d697x12jv9ebpwkjbdl6eif5w17ptjij.jpg",
                "price": "18 999 ₽ ",
                "subtitle": "Кровать с подъемным механизмом Paloma 120х200 см",
                "id": 4
            },
            {
                "image": "https://hoff.ru/upload/iblock/76e/1mwpsduhwtyyanq8y6oabynzfsioutnd.jpg",
                "price": "18 999 ₽ ",
                "subtitle": "Кровать с подъемным механизмом Paloma 120х200 см",
                "id": 5
            },
            {
                "image": "https://hoff.ru/upload/iblock/83c/83c91bfc679c91be937c845c9f6b89ba.jpg",
                "price": "6 699 ₽ ",
                "subtitle": "Кровать двойная МСП цвет дуб золотой, камень тёмный 140х200 см",
                "id": 6
            },
            {
                "image": "https://hoff.ru/upload/iblock/76f/3yigrx56ryf4xd12twc1wb1slhat1xcp.jpg",
                "price": "10 599 ₽ ",
                "subtitle": "Каркас кровати Paloma цвет серый 120х200 см",
                "id": 7
            },
            {
                "image": "https://hoff.ru/upload/iblock/cce/cce45b619f88ae11e0d85c2643a97001.jpg",
                "price": "17 999 ₽ ",
                "subtitle": "Каркас кровати Вена цвет бежевый 180х200 см",
                "id": 8
            },
            {
                "image": "https://hoff.ru/upload/iblock/a36/a36a5a735df0ad508872ce7fdb226c7c.jpg",
                "price": "4 299 ₽ ",
                "subtitle": "Кровать Мета цвет чёрный 80х200 см",
                "id": 9
            },
            {
                "image": "https://hoff.ru/upload/iblock/efa/fo628d13naot6fa912lc7kqb9hew6eh5.jpg",
                "price": "5 999 ₽ ",
                "subtitle": "Кровать Капри цвет белый текстурный 140х200 см",
                "id": 10
            },
            {
                "image": "https://hoff.ru/upload/iblock/641/g1ikve5iny288kxn3805angxbnknihwn.jpg",
                "price": "9 599 ₽ ",
                "subtitle": "Каркас кровати Астра цвет серый 90х200 см, ЛДСП",
                "id": 11
            },
            {
                "image": "https://hoff.ru/upload/iblock/f00/7dm83ejtzern7q8vx1tdgpnc3yeyn3fd.jpg",
                "price": "5 999 ₽ ",
                "subtitle": "Кровать Софт цвет белый 90х200 см",
                "id": 12
            },
            {
                "image": "https://hoff.ru/upload/iblock/845/rji4kbixaqyvyvpdttij3igncyoj04yy.jpg",
                "price": "6 999 ₽ ",
                "subtitle": "Кровать двойная Токио без подъёмного механизма цвет белый текстурный",
                "id": 13
            },
            {
                "image": "https://hoff.ru/upload/iblock/370/370013ad840b04593d1b19181ac2bbff.jpg",
                "price": "34 999 ₽ ",
                "subtitle": "Кровать c подъёмным механизмом Вена 180х200 см",
                "id": 14
            },
            {
                "image": "https://hoff.ru/upload/iblock/f62/p8yihbobmmcm6jyh7dv4p5n34ddisozx.jpg",
                "price": "34 999 ₽ ",
                "subtitle": "Кровать с подъемным механизмом Вена 180х200 см, бежевый, велюр",
                "id": 15
            },
            {
                "image": "https://hoff.ru/upload/iblock/916/xqv4lrauhsimvfj1pvfiiwxw26be2wzw.jpg",
                "price": "12 999 ₽ ",
                "subtitle": "Кровать Эстери 1 цвет белый античный 90х200 см",
                "id": 16
            },
            {
                "image": "https://hoff.ru/upload/iblock/5da/xiivsk68gelbhhuj46boz907pqp2v4gv.jpg",
                "price": "11 999 ₽ ",
                "subtitle": "Каркас кровати Fresco цвет белый, дуб вотан 140х200 см",
                "id": 17
            },
            {
                "image": "https://hoff.ru/upload/iblock/af0/ks209l2h35hqesvxwr0jyavyszdqdwvg.jpg",
                "price": "11 799 ₽ ",
                "subtitle": "Каркас кровати Глазго цвет таксония, металл бруклин, серый 160х200 см",
                "id": 18
            },
            {
                "image": "https://hoff.ru/upload/iblock/783/x4cau2qwoj6aobch8ibrriaeoomh32bn.jpg",
                "price": "6 299 ₽ ",
                "subtitle": "Кровать Мира цвет чёрный 140х200 см",
                "id": 19
            },
            {
                "image": "https://hoff.ru/upload/iblock/034/09amsuxxc6a0x7nzg3gfd03gm7iekvv6.jpg",
                "price": "19 499 ₽ ",
                "subtitle": "Каркас кровати SCANDICA Wilma цвет белый гладкий, чёрный гладкий 160х200 см",
                "id": 20
            },
            {
                "image": "https://hoff.ru/upload/hoff_resize/hoff-images/223/107/2/wqednqsa67ujaax0tyzggsz85nimit8w.jpg/666x444_85.jpeg",
                "price": "6 199 ₽ ",
                "subtitle": "Каркас кровати Соренто цвет дуб Бонифаций, дуб Бордо 90х200 см",
                "id": 21
            },
            {
                "image": "https://hoff.ru/upload/iblock/8bd/tsycyo2n5dl638p6xzl7lcxo156oqnpm.jpg",
                "price": "11 499 ₽ ",
                "subtitle": "Каркас кровати Paloma цвет серо-бежевый 160х200 см",
                "id": 22
            },
            {
                "image": "https://hoff.ru/upload/iblock/e66/hnhwf3qcxkzs49jxhypga3dz4sv6xbgx.jpg",
                "price": "32 999 ₽ ",
                "subtitle": "Кровать с подъёмным механизмом Victori цвет молочный 160х200 см",
                "id": 23
            },
            {
                "image": "https://hoff.ru/upload/iblock/bda/z5bi0gk2idgvh5g590dqz2jwv1it7xr4.jpg",
                "price": "19 999 ₽ ",
                "subtitle": "Каркас кровати SOLANA Briana цвет кофейный 140х200 см",
                "id": 24
            },
            {
                "image": "https://hoff.ru/upload/iblock/002/t4at211g0bawkabyqoiu270nbgiu72mc.jpg",
                "price": "4 999 ₽ ",
                "subtitle": "Кровать Варта 90х200 см",
                "id": 25
            },
            {
                "image": "https://hoff.ru/upload/iblock/702/ku87pmujvbwblbe6z33r47vn9bau8hpc.jpg",
                "price": "9 599 ₽ ",
                "subtitle": "Каркас кровати Астра цвет бежевый 90х200 см",
                "id": 26
            },
            {
                "image": "https://hoff.ru/upload/hoff_resize/hoff-images/286/833/0/z9mni4v5ga5oekkopdmukxi4fh1f2fxe.jpg/666x444_85.jpeg",
                "price": "31 999 ₽ ",
                "subtitle": "Кровать левосторонняя c подъёмным механизмом Тред цвет тёмно-серый 120х200 см",
                "id": 27
            },
            {
                "image": "https://hoff.ru/upload/iblock/163/e3tj1b5bm1407icmmx7z10bu70q3mqnc.jpg",
                "price": "19 499 ₽ ",
                "subtitle": "Каркас кровати Линда цвет белый снег, белый 160х200 см",
                "id": 28
            }
        ];

        await Product.insertMany(items);

        console.log('✅ Все данные успешно добавлены')
        process.exit(0)
    } catch (error) {
        console.error('❌ Ошибка:', error)
        process.exit(1)
    }
}

seedAllAsync()