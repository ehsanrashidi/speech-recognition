import React, { useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import { useSpeechRecognition } from "../hooks/use-speech-recognition";

interface TextBoxProps {
    onSend: (message: string) => void;
    onRecord: (isRecording: boolean) => void;
    isRecording: boolean;
}

const TextBox: React.FC<TextBoxProps> = ({ onSend, onRecord, isRecording }) => {
    const [message, setMessage] = useState<string>("");

    const { listen, listening, stop } = useSpeechRecognition({
        onResult: (results) => {
            const finalTranscript = results.find((x) => x.isFinal);
            if (finalTranscript) {
                onSend(finalTranscript.transcript);
                setMessage("");
            } else {
                let text = "";
                results
                    .filter((x) => !x.isFinal)
                    .forEach((result) => {
                        text = `${text} ${result.transcript}`;
                    });
                setMessage(text);
            }
        },
        onEnd: () => {
            if (message.trim()) {
                onSend(message.trim());
            }
        },
        onError: (error) => console.error(error),
    });

    const handleRecord = () => {
        isRecording ? stop() : listen({ lang: "fa-IR", interimResults: true, continuous: false });
        onRecord(!isRecording);
    };

    const handleSend = () => {
        if (message.trim()) {
            onSend(message.trim());
            setMessage("");
        }
    };

    return (
        <TextField
            fullWidth
            variant="outlined"
            placeholder="پیام خود را تایپ کنید..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <IconButton onClick={handleSend} color="primary">
                            <SendIcon />
                        </IconButton>
                        <IconButton onClick={handleRecord} color={isRecording ? "error" : "primary"}>
                            <MicIcon />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
};

export default TextBox;
