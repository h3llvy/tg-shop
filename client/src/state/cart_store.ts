import {create} from 'zustand'

export const useCartStore = create((set) => ({
    products: [],
    originalProducts: [],
    cart: {},
    init: () => set(() => {
        return {cart: JSON.parse(localStorage.getItem('cart')) ?? {}}
    }),
    addItem: (id) => set((state) => {
        const newCart = {...state.cart}
        if (!newCart[id]) {
            newCart[id] = 1; // Если товара нет в корзине, добавляем 1 шт.
        } else {
            newCart[id] += 1; // Увеличиваем количество товара.
        }

        localStorage.setItem('cart', JSON.stringify(newCart))
        return {cart: newCart}
    }),
    setCount: (id, count) => set((state) => {
        const newCart = {...state.cart}

        if (!newCart[id]) {
            return
        }

        newCart[id] = count
        localStorage.setItem('cart', JSON.stringify(newCart))
        return {cart: newCart}
    }),
    deleteOneItem: (id) => set((state) => {
        const newCart = {...state.cart}

        if (!newCart[id]) {
            return
        }

        if (newCart[id] === 1) {
            delete newCart[id]
            localStorage.setItem('cart', JSON.stringify(newCart))
            return {cart: newCart}
        }

        newCart[id] -= 1
        localStorage.setItem('cart', JSON.stringify(newCart))
        return {cart: newCart}
    }),
    deleteCompletelyItem: (id) => set((state) => {
        const newCart = {...state.cart}
        delete newCart[id]
        localStorage.setItem('cart', JSON.stringify(newCart))
        return {cart: newCart}
    }),
    clear: () => set(() => {
        localStorage.removeItem('cart')
        return {cart: {}}
    }),
    setProducts: (products) => set(() => {
        return {products: products}
    }),
    setOriginalProducts: (products) => set(() => {
        return {originalProducts: products}
    }),
}))

export const useTotalCart = () => {
    const cart = useCartStore(state => state.cart)
    let count = 0;
    for (const id in cart) {
        for (const size in cart[id]) {
            count += cart[id];
        }
    }
    return count;
}

export const useTotalSumCart = () => {
    const cart = useCartStore(state => state.cart)
    const products = useCartStore(state => state.originalProducts)
    let totalSum = 0;
    Object.keys(cart).forEach(id => {
        const product = products.find(e => e.id == id);
        const quantity = cart[id];
        totalSum += parseInt(product.price.replace(/\D/g, '')) * quantity;
    })

    return totalSum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
}

export const useCartItems = () => {
    const cart = useCartStore(state => state.cart)
    const products = useCartStore(state => state.originalProducts)

    return Object.entries(cart).map(e => {
            const id = e[0];
            const count = e[1];
            const product = products.find(p => p.id == id)

            return {
                product: product,
                count: count
            }
        }
    )
}