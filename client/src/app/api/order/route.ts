import axios from 'axios';
import {validate} from "@telegram-apps/init-data-node";
import {NextApiRequest, NextApiResponse} from "next";
import {parseInitData} from "@telegram-apps/sdk-react";
import db from "@/services/db";
import Order from "@/entities/Order";

const TG_TOKEN = process.env.TG_TOKEN
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TG_TOKEN}/`;

export async function POST(req: NextApiRequest) {
    const {initDataRaw, orderDetails} = await req.json();

    validate(initDataRaw, TG_TOKEN)

    const initData = parseInitData(initDataRaw)

    const fullName = `${initData.user?.lastName} ${initData.user?.firstName}`.trim()

    db.connect()

    const order = await Order.create({
        status: 'pending',
        products: orderDetails.items,
        totalAmount: orderDetails.total.replace(/\D/g, ''),
        userName: fullName,
        userNick: initData.user?.username,
    })

    console.log(await Order.find())

    const orderMessage = `
${fullName}, оформлен новый заказ №${order.id}.

Товары: ${orderDetails.items.map(item => `${item.product.subtitle} - ${item.count} шт`).join(', ')}.

Общая сумма: ${orderDetails.total}.

Наш менеджер скоро свяжется с вами!
        `;

    try {
        const res = await axios.post(`${TELEGRAM_API_URL}sendMessage`, {
            chat_id: initData.user?.id,
            text: orderMessage,
        });

        return new Response(JSON.stringify({success: true}), {
            status: 200,
            headers: {"Content-Type": "application/json"}
        });
    } catch (error) {
        if (error.response && error.response.data) {
            console.error("Error fetching products:", error.response);
        }
        console.error('Error sending message:', error);
        return new Response(JSON.stringify(error), {
            status: 500,
            headers: {"Content-Type": "application/json"}
        });
    }
}