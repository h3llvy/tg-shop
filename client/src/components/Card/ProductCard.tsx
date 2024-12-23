import {CardCell} from "@telegram-apps/telegram-ui/dist/components/Blocks/Card/components/CardCell/CardCell";
import {Button, Card, Input} from "@telegram-apps/telegram-ui";
import React from "react";
import {useCartStore} from "@/state/cart_store";

export default function ProductCard({product, setSelectedProduct})
{
    const cart = useCartStore(state => state.cart);

    return <Card
        className="m-2 shadow-lg"
        style={{maxWidth: 164, background: 'var(--tgui--card_bg_color)'}}
        onClick={() => setSelectedProduct(product)}
    >

        <img
            alt={product.price}
            src={product.image}
            style={{
                display: "block",
                height: 170,
                objectFit: "cover",
                width: 164,
            }}
        />
        <CardCell readOnly subtitle={product.subtitle} style={{WebkitLineClamp: 4}} className='product__card-cell'>
            {product.price}
        </CardCell>

        <div className="flex justify-end h-24 bott flex-col items-center pb-4">

            {cart && cart[product.id] &&
                <Button
                    mode="outline"
                    size="s"
                    style={{width: 140}}
                    className="mb-2"
                    onClick={(e) => {
                        e.stopPropagation();
                        useCartStore.getState().deleteCompletelyItem(product.id)
                    }}
                >
                    Убрать ({cart[product.id]})
                </Button>
            }
            {
                <Button
                    mode="filled"
                    size="s"
                    style={{width: 140}}
                    onClick={(e) => {
                        e.stopPropagation();
                        useCartStore.getState().addItem(product.id)
                    }}
                >
                    Добавить
                </Button>
            }
        </div>

    </Card>;
}