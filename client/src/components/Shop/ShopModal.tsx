"use client"

import { Modal, Placeholder} from "@telegram-apps/telegram-ui";
import * as Dialog from "@radix-ui/react-dialog";

export default function ShopModal({isShow, setIsShow}) {
    return (<>
        <Modal
            open={isShow}
            onOpenChange={setIsShow}
        >
            <Placeholder
                description="Descasdription"
                header="Title"
            >
                <Dialog.Title className="DialogTitle">DialogTitle</Dialog.Title>
                <Dialog.Description className="DialogDescription">
                    DialogDescription
                </Dialog.Description>
                <img
                    alt="Telegram sticker"
                    src="https://xelene.me/telegram.gif"
                    style={{
                        display: 'block',
                        height: '144px',
                        width: '144px'
                    }}
                />
            </Placeholder>
        </Modal>
    </>)
}