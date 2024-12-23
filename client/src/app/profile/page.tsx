"use client";

import {
    initData,
} from "@telegram-apps/sdk-react";

import ShopModal from "@/components/Shop/ShopModal";
import {useState} from "react";
import SubscriptionsBanner from "@/components/Catalog/SubscriptionsBanner";

export default function ProfilePage() {
    const user = initData.user();
    const [isShowModal, setIsShowModal] = useState(false);

    return (
        <>
            <ShopModal isShow={isShowModal} setIsShow={setIsShowModal} />
            <div style={{ padding: "16px 30px 100px" }}>
                <SubscriptionsBanner />
            </div>
        </>
    );
}