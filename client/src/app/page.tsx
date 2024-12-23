"use client"
import React, {useCallback, useEffect, useRef, useState} from "react";
import "./style.css";
import CatalogPage from "@/app/catalog/page";
import {Input, Tappable} from "@telegram-apps/telegram-ui";
import {Icon24Close} from "@telegram-apps/telegram-ui/dist/icons/24/close";
import axios from "axios";
import {useCartStore} from "@/state/cart_store";
import IconMicrophone from "@/icons/IconMicrophone";
import IconClose from "@/icons/IconClose";
import {debounce} from "next/dist/server/utils";
import {useDebouncedCallback} from "use-debounce";

export default function Home() {
    const [value, setValue] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef(null);

    const startRecording = () => {
        if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
            alert("Ваш браузер не поддерживает распознавание речи.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = "ru-RU"; // Установите нужный язык
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onresult = (event) => {
            const transcript = event.results[0][0].transcript; // Распознанный текст
            setValue(transcript); // Установим значение в инпут
            handleSearch(transcript); // Обновим список продуктов
        };

        recognitionRef.current.onerror = (error) => {
            console.error("Ошибка распознавания речи:", error);
        };

        recognitionRef.current.onend = () => {
            setIsRecording(false);
        };

        recognitionRef.current.start();
        setIsRecording(true);
    };

    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsRecording(false);
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const handleSearch = useDebouncedCallback(async (searchQuery) => {
        const response = await axios.get(`/api/all?searchQuery=${searchQuery}`);
        useCartStore.getState().setProducts(response.data);
    }, 200);

    return (
        <>
            <div>
                <Input
                    status="focused"
                    header="Поиск"
                    placeholder="Напишите или произнесите ваш запрос"
                    value={value}
                    onChange={async (e) => {
                        setValue(e.target.value);
                        handleSearch(e.target.value);
                    }}
                    after={
                        <Tappable
                            Component="div"
                            style={{display: "flex"}}
                            onClick={toggleRecording}
                        >
                            {isRecording ? <IconClose/> : <IconMicrophone/>}
                        </Tappable>
                    }
                />

                {/* Подсказка о записи */}
                <div className='min-h-6 text-center'>{isRecording && '🎤 Слушаем вас...'}</div>
            </div>

            <CatalogPage/>
        </>
    );
}