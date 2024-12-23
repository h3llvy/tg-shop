"use client"
import React, {useRef, useState} from "react";
import "./style.css"
import CatalogPage from "@/app/catalog/page";
import {Input, Tappable} from "@telegram-apps/telegram-ui";
import {Icon24Close} from "@telegram-apps/telegram-ui/dist/icons/24/close";


export default function Home() {
    const [value, setValue] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null); // Store the recorded audio
    const mediaRecorderRef = useRef(null);
    const audioChunks = useRef([]); // Temporary storage for the audio data
    const [audioUrl, setAudioUrl] = useState(null);
    const streamRef = useRef(null); // Ref to store the microphone stream

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        streamRef.current = stream;

        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunks.current.push(event.data); // Collect audio data
        };

        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
            setAudioBlob(audioBlob);
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioUrl(audioUrl); // Create a URL for the audio
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }        setIsRecording(false);
    };

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };


    return <>
        <div>
            <Input
                status="focused"
                header="Input"
                placeholder="Write and clean me"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                after={
                    <Tappable
                        Component="div"
                        style={{display: 'flex'}}
                        onClick={toggleRecording}
                    >
                        {isRecording ? <Icon24Close/> :
                            <span>Record</span>} {/* Change text/icon depending on recording state */}
                    </Tappable>
                }
            />

            {/* Display the recorded audio */}
            {audioUrl && !isRecording && (
                <div>
                    <audio controls src={audioUrl}></audio>
                </div>
            )}
        </div>

        <CatalogPage/>
    </>;
}