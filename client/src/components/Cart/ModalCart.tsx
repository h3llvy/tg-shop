import {
    ModalHeader
} from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import {Button, Input, Modal, Tappable, VisuallyHidden} from "@telegram-apps/telegram-ui";
import {useCartItems, useCartStore, useTotalSumCart} from "@/state/cart_store";
import * as Dialog from "@radix-ui/react-dialog";

import React, {useState} from "react";
import {useLaunchParams} from "@telegram-apps/sdk-react";
import IconClose from "@/icons/IconClose";
import IconMicrophone from "@/icons/IconMicrophone";

export default function ModalCart({openModal, setOpenModal}) {
    const cartItems = useCartItems()
    const totalSum = useTotalSumCart();

    const lp = useLaunchParams();

    const [openOrderModal, setOpenOrderModal] = useState(false)
    const [value, setValue] = useState('')

    return (
        <div>
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
                            <span>{`${item.product.subtitle}`}
                                <b>[{item.product.price}]</b> {`(${item.count} шт)`}</span>
                            <span>{parseInt(item.product.price.replace(/\D/g, '')) * item.count} ₽</span>
                        </div>
                    ))}
                    <div
                        style={{
                            display: "flex",
                            justifyContent:  "space-between",
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
                        disabled={0 == parseInt(totalSum.replace(/\D/g, ''))}

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
                        disabled={0 == parseInt(totalSum.replace(/\D/g, ''))}

                        onClick={() => {
                            setOpenOrderModal(true)
                        }}
                    >
                        Оформить заказ
                    </Button>
                </div>
            </Modal>


            <Modal
                className='ordering'
                header={<ModalHeader>Телефон</ModalHeader>}
                open={openOrderModal}
                onOpenChange={setOpenOrderModal}
            >
                <VisuallyHidden>
                    <Dialog.Title className="DialogTitle"></Dialog.Title>
                    <Dialog.Description className="DialogDescription">
                    </Dialog.Description>
                </VisuallyHidden>
                <Input
                    header="Телефон"
                    placeholder="Напишите ваш телефон"
                    value={value}
                    onChange={async (e) => {
                        setValue(e.target.value);
                    }}
                    className="my-40"
                />
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
                    disabled={0 == parseInt(totalSum.replace(/\D/g, ''))}

                    onClick={() => {
                        alert("Заказ оформлен!")
                        setOpenOrderModal(false)
                        setOpenModal(false)
                        useCartStore.getState().clear()
                    }}
                >
                    Подтвердить
                </Button>
            </Modal>
        </div>)
}