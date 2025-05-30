import React from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useRecognition } from "../context/RecognitionContext";

const RecognitionButton: React.FC = () => {
    const { isListening, status, startListening, stopListening } = useRecognition();

    const handleToggle = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const getButtonStyles = () => {
        const baseStyles = "relative rounded-full flex items-center justify-center transition-all duration-300 shadow-lg";

        if (isListening) {
            return `${baseStyles} bg-primary text-white w-20 h-20 animate-pulse`;
        } else if (status === "error") {
            return `${baseStyles} bg-red-500 text-white w-16 h-16`;
        } else {
            return `${baseStyles} bg-white text-primary hover:bg-primary hover:text-white w-16 h-16`;
        }
    };

    const getButtonIcon = () => {
        if (status === "processing") {
            return <Loader2 size={28} className="animate-spin" />;
        } else if (isListening) {
            return <Mic size={28} />;
        } else if (status === "error") {
            return <MicOff size={24} />;
        } else {
            return <Mic size={24} />;
        }
    };

    return (
        <div className="flex flex-col items-center">
            <button
                onClick={handleToggle}
                className={getButtonStyles()}
                aria-label={isListening ? "Stop recording" : "Start recording"}
                disabled={status === "processing" || status === "error"}>
                {getButtonIcon()}

                {/* Animation rings */}
                {isListening && (
                    <>
                        <span className="absolute w-full h-full rounded-full bg-primary/20 animate-ping"></span>
                        <span className="absolute w-[120%] h-[120%] rounded-full border-2 border-primary/30 animate-pulse"></span>
                    </>
                )}
            </button>

            <span className="text-sm mt-2 text-gray-600">{isListening ? "Listening..." : "Tap to speak"}</span>
        </div>
    );
};

export default RecognitionButton;
