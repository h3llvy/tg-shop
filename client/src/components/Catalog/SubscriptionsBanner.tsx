"use client";
import {Banner, Card} from "@telegram-apps/telegram-ui";
import {CardCell} from "@telegram-apps/telegram-ui/dist/components/Blocks/Card/components/CardCell/CardCell";
import {CardChip} from "@telegram-apps/telegram-ui/dist/components/Blocks/Card/components/CardChip/CardChip";

export default function SubscriptionsBanner() {
    const subscriptions = [
        {subtitle: "300 мин + 30 ГБ", title: "Баланс"},
        {subtitle: "Безлимит на минуты и гигабайты", title: "Все сразу!"},
        {subtitle: "Всего по-немногу", title: "Минимум"},
        {subtitle: "700мин + 70ГБ", title: "С запасом"},
    ];

    return (
        <Banner header="Подписки" style={{marginTop: 20, borderRadius: 15, overflow: "auto"}}>
            <div className="cards" style={{display: "flex"}}>
                <Card>
                    <CardChip readOnly>
                        Hot place
                    </CardChip>
                    <img
                        alt="Dog"
                        src="https://i.imgur.com/892vhef.jpeg"
                        style={{
                            display: 'block',
                            height: 308,
                            objectFit: 'cover',
                            width: 254
                        }}
                    />
                    <CardCell
                        readOnly
                        subtitle="United states"
                    >
                        New York
                    </CardCell>
                </Card>
                <Card>
                    <CardChip readOnly>
                        Hot place
                    </CardChip>
                    <img
                        alt="Dog"
                        src="https://i.imgur.com/892vhef.jpeg"
                        style={{
                            display: 'block',
                            height: 308,
                            objectFit: 'cover',
                            width: 254
                        }}
                    />
                    <CardCell
                        readOnly
                        subtitle="United states"
                    >
                        New York
                    </CardCell>
                </Card>
                <Card>
                    <CardChip readOnly>
                        Hot place
                    </CardChip>
                    <img
                        alt="Dog"
                        src="https://i.imgur.com/892vhef.jpeg"
                        style={{
                            display: 'block',
                            height: 308,
                            objectFit: 'cover',
                            width: 254
                        }}
                    />
                    <CardCell
                        readOnly
                        subtitle="United states"
                    >
                        New York
                    </CardCell>
                </Card> <Card>
                <CardChip readOnly>
                    Hot place
                </CardChip>
                <img
                    alt="Dog"
                    src="https://i.imgur.com/892vhef.jpeg"
                    style={{
                        display: 'block',
                        height: 308,
                        objectFit: 'cover',
                        width: 254
                    }}
                />
                <CardCell
                    readOnly
                    subtitle="United states"
                >
                    New York
                </CardCell>
            </Card>


            </div>
        </Banner>
    );
}