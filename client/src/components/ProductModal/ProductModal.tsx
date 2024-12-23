"use client"
import * as Dialog from "@radix-ui/react-dialog";
import {Button, Card, Modal, VisuallyHidden} from "@telegram-apps/telegram-ui";
import React from "react";
import {
    ModalHeader
} from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import {useCartStore} from "@/state/cart_store";
import {useLaunchParams} from "@telegram-apps/sdk-react";

export default function ProductModal({setSelectedProduct, selectedProduct}) {
    const cart = useCartStore(state => state.cart);

    const lp = useLaunchParams();

    return <Modal
        header={<ModalHeader>Описание товара</ModalHeader>}
        open={!!selectedProduct}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
        className='h-full flex flex-col items-center justify-between'
    >
        <VisuallyHidden>
            <Dialog.Title className="DialogTitle"></Dialog.Title>
            <Dialog.Description className="DialogDescription">
            </Dialog.Description>
        </VisuallyHidden>
        <div className='flex flex-col justify-between 160' style={{height: '90vh'}}>
            <Card className="m-2" style={{maxWidth: 300}} onClick={() => {
            }}>

                <img
                    alt={selectedProduct?.subtitle}
                    src={selectedProduct?.image}
                    style={{
                        display: "block",
                        height: 200,
                        objectFit: "cover",
                        width: 300,
                    }}
                />
                <div className="pt-4 py-1" style={{background: 'var(--tgui--bg_color)'}}>
                    <h1 className="text-xl pb-2">
                        {selectedProduct?.price}
                    </h1>
                    <h2>{selectedProduct?.subtitle}</h2>
                </div>
            </Card>
            <div className="flex justify-end h-24 bott flex-col items-center pb-4">

                {selectedProduct && cart && cart[selectedProduct?.id] &&
                    <Button
                        mode="outline"
                        size="s"
                        style={{width: 140}}
                        className="mb-4"
                        onClick={(e) => {
                            e.stopPropagation();
                            useCartStore.getState().deleteCompletelyItem(selectedProduct.id)
                        }}
                    >
                        Убрать ({cart[selectedProduct?.id]})
                    </Button>
                }
                {
                    <Button
                        mode="filled"
                        size="s"
                        style={{width: 140, marginBottom: lp.platform === "ios" ? "20px" : "0",}}
                        onClick={(e) => {
                            e.stopPropagation();
                            useCartStore.getState().addItem(selectedProduct.id)
                        }}
                    >
                        Добавить
                    </Button>
                }
            </div>
        </div>
    </Modal>;
}