import {type PropsWithChildren} from "react";
import type {GetServerSideProps, Metadata} from "next";

import {Root} from "@/components/Root/Root";
import "@telegram-apps/telegram-ui/dist/styles.css";
import "./_assets/globals.css";
import {Nav} from "@/components/Nav";
import ProductRepository from "@/services/ProductRepository";
import seedAllAsync from "@/scripts/seedAll";

export const metadata: Metadata = {
    title: "Your Application Title Goes Here",
    description: "Your application description goes here",
};


export default async function RootLayout({children}: PropsWithChildren) {
    const products = await ProductRepository.all()
    return (
        <html lang="ru">
        <body className="min-h-screen ">
        <Root products={products}>
            <div className="min-h-screen flex flex-col">
                <div className="flex-1 flex justify-center">
                    <div className="w-full" style={{background: 'var(--tgui--bg_color)'}}>
                        {children}
                    </div>
                </div>
                <Nav className="mt-auto"/>
            </div>
        </Root>
        </body>
        </html>
    );
}