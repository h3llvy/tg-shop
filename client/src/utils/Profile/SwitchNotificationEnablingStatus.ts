import sendDataToBackend from "@/utils/sendDataToBackend";

export default function setNotificationEnablingStatus(status) {
    sendDataToBackend({
        method: "setNotificationEnablingStatus",
        data: {status},
    })
}