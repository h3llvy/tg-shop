import axios from 'axios';
import {validate} from "@telegram-apps/init-data-node";
import {NextApiRequest, NextApiResponse} from "next";
import {parseInitData} from "@telegram-apps/sdk-react";

const TG_TOKEN = process.env.TG_TOKEN
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TG_TOKEN}/`;

export async function POST(req: NextApiRequest) {
    const {initDataRaw, orderDetails} = await req.json();

    validate(initDataRaw, TG_TOKEN)

    const initData = parseInitData(initDataRaw)

    const fullName = `${initData.user?.lastName} ${initData.user?.firstName}`.trim()

    const order = {id: 1, amount: 2300}

    const orderMessage = `
            ${fullName}, оформлен новый заказ №${order.id}.
            Товары: ${orderDetails.items.map(item => `${item.name} - ${item.count}`).join(', ')}
            Общая сумма: ${orderDetails.total}
            Наш менеджер скоро свяжется с вами!
        `;
    console.log(initData.chat)
    console.log(initData.chatInstance)
    try {
        const res = await axios.post(`${TELEGRAM_API_URL}sendMessage`, {
            chat_id: initData.chat?.id,
            text: orderMessage,
        });

        return new Response(JSON.stringify({success: true}), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        if (error.response && error.response.data) {
            console.error("Error fetching products:", error.response);
        }
        console.error('Error sending message:', error);
        return new Response(JSON.stringify(error), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}