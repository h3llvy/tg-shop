"use client";
import {Tabbar } from "@telegram-apps/telegram-ui";
import React, {useState} from "react";
import {useCartStore, useTotalSumCart} from "@/state/cart_store";
import {useLaunchParams} from "@telegram-apps/sdk-react";
import ModalCart from "@/components/Cart/ModalCart";


export function Nav() {
    const [openModal, setOpenModal] = useState(false)

    const totalSum = useTotalSumCart();

    const lp = useLaunchParams();

    return (
        <>
            <ModalCart setOpenModal={setOpenModal} openModal={openModal} />
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
