"use client";
import {Button, Modal, Tabbar, VisuallyHidden} from "@telegram-apps/telegram-ui";
import {
    ModalHeader
} from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import React, {useState} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {useCartStore, useTotalSumCart} from "@/state/cart_store";
import {useLaunchParams} from "@telegram-apps/sdk-react";


export function Nav() {
    const [openModal, setOpenModal] = useState(false)
    const cart = useCartStore(state => state.cart)
    const products = useCartStore(state => state.originalProducts)
    const cartItems = Object.entries(cart).map(e => {
            const id = e[0];
            const count = e[1];
            const product = products.find(p => p.id == id)

            return {
                product: product,
                count: count
            }
        }
    )
    const totalSum = useTotalSumCart();

    const lp = useLaunchParams();

    return (
        <>
            <Modal
                header={<ModalHeader>Корзина</ModalHeader>}
                open={openModal}
                onOpenChange={setOpenModal}
            >
                <VisuallyHidden>
                    <Dialog.Title className="DialogTitle"></Dialog.Title>
                    <Dialog.Description className="DialogDescription">
                    </Dialog.Description>
                </VisuallyHidden>
                <div style={{padding: "16px"}}>
                    {cartItems.map((item) => (
                        <div
                            key={item.product.id}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "8px 0",
                                borderBottom: "1px solid #e0e0e0",
                            }}
                        >
                            <span>{`${item.product.subtitle}`} <b>[{item.product.price}]</b> {`(${item.count} шт)`}</span>
                            <span>{parseInt(item.product.price.replace(/\D/g, '')) * item.count} ₽</span>
                        </div>
                    ))}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "16px 0",
                            fontWeight: "bold",
                            fontSize: "1.2rem",
                            borderTop: "2px solid #e0e0e0",
                        }}
                    >
                        <span>Всего</span>
                        <span>{totalSum}</span>
                    </div>
                    <Button
                        mode='bezeled'
                        style={{
                            display: "block",
                            width: "100%",
                            backgroundColor: "#ff0000",
                            color: "#fff",
                            fontSize: "1rem",
                            borderRadius: "8px",
                            marginTop: "16px",
                        }}

                        onClick={() => useCartStore.getState().clear()}
                    >
                        Очистить корзину
                    </Button>
                    <Button
                        style={{
                            display: "block",
                            width: "100%",
                            backgroundColor: "#0078ff",
                            color: "#fff",
                            fontSize: "1rem",
                            borderRadius: "8px",
                            marginTop: "16px",
                            marginBottom: lp.platform === "ios" ? "30px" : "0",
                        }}
                        onClick={() => alert("Order placed!")}
                    >
                        Оформить заказ
                    </Button>
                </div>
            </Modal>
            <Tabbar>
                <Tabbar.Item
                    style={{
                        marginBottom: lp.platform === "ios" ? "30px" : "0",
                    }}
                    selected={true}
                    text={`Корзина (${totalSum})`}
                    onClick={() => setOpenModal(true)}
                >
                </Tabbar.Item>
            </Tabbar>
        </>
    );
}
