import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const TG_TOKEN = process.env.TG_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TG_TOKEN}/`;

export async function POST(req: NextApiRequest) {
    const body = await req.json();

    if (!body || !body.message || !body.message.text || !body.message.chat) {
        console.log('Bad Request');
        return;
    }

    const messageText = body.message.text;
    const chatId = body.message.chat.id;

    if (messageText === '/start') {
        const replyText = `Привет! Нажмите на кнопку ниже, чтобы открыть магазин.`;

        const replyMarkup = {
            inline_keyboard: [
                [
                    {
                        text: 'Открыть магазин',
                        web_app: {url: process.env.MINI_APP_URL}
                    },
                ],
            ],
        };

        try {
            await axios.post(`${TELEGRAM_API_URL}sendMessage`, {
                chat_id: chatId,
                text: replyText,
                reply_markup: replyMarkup,
            });

            return new Response(JSON.stringify({success: true}), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        } catch (error) {
            console.error('Error sending message:', error?.response?.data || error.message);

            return new Response(JSON.stringify(error), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }
    }
}