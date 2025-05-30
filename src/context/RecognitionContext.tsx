import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { RecognitionSettings, RecognitionStatus, TranscriptItem } from "../types";
import { useSpeechRecognition } from "../hooks/use-speech-recognition";

interface RecognitionContextType {
    transcript: string;
    fullTranscript: TranscriptItem[];
    isListening: boolean;
    status: RecognitionStatus;
    settings: RecognitionSettings;
    confidence: number;
    errorMessage: string | null;
    startListening: () => void;
    stopListening: () => void;
    clearTranscript: () => void;
    updateSettings: (settings: Partial<RecognitionSettings>) => void;
    toggleFavorite: (id: string) => void;
    deleteTranscriptItem: (id: string) => void;
    audioLevel: number;
    detectedLanguage: string | null;
    undoLastTranscript: () => void;
}

const defaultSettings: RecognitionSettings = {
    language: "fa-IR",
    continuous: true,
    interimResults: true,
    maxAlternatives: 1,
    autoDetectLanguage: false,
};

const RecognitionContext = createContext<RecognitionContextType | undefined>(undefined);

export const useRecognition = () => {
    const context = useContext(RecognitionContext);
    if (!context) {
        throw new Error("useRecognition must be used within a RecognitionProvider");
    }
    return context;
};

interface RecognitionProviderProps {
    children: ReactNode;
}

export const RecognitionProvider: React.FC<RecognitionProviderProps> = ({ children }) => {
    const [fullTranscript, setFullTranscript] = useState<TranscriptItem[]>([]);
    const [status, setStatus] = useState<RecognitionStatus>("idle");
    const [settings, setSettings] = useState<RecognitionSettings>(defaultSettings);
    const [audioLevel, setAudioLevel] = useState<number>(0);

    const handleResult = useCallback(
        (text: string, detectedLang?: string) => {
            const newTranscriptItem: TranscriptItem = {
                id: uuidv4(),
                text,
                timestamp: new Date(),
                language: detectedLang || settings.language,
                confidence: 0.95,
                isFavorite: false,
            };
            setFullTranscript((prev) => [...prev, newTranscriptItem]);
        },
        [settings.language]
    );

    const handleError = useCallback((errorMessage: string) => {
        setStatus("error");
        console.error(errorMessage);
    }, []);

    const handleEnd = useCallback(() => {
        setStatus("idle");
        setAudioLevel(0);
    }, []);

    const {
        isListening,
        start: startRecognition,
        stop: stopRecognition,
        transcript,
        error: errorMessage,
        detectedLanguage,
    } = useSpeechRecognition({
        onResult: handleResult,
        onError: handleError,
        onEnd: handleEnd,
        ...settings,
    });

    useEffect(() => {
        let audioContext: AudioContext;
        let analyser: AnalyserNode;
        let microphone: MediaStreamAudioSourceNode;
        let animationFrameId: number;
        let isActive = true;

        const setupAudioAnalysis = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                audioContext = new AudioContext();
                analyser = audioContext.createAnalyser();
                microphone = audioContext.createMediaStreamSource(stream);
                microphone.connect(analyser);

                analyser.fftSize = 256;
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);

                const updateAudioLevel = () => {
                    if (!isActive) return;

                    analyser.getByteFrequencyData(dataArray);
                    const average = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;
                    const normalizedLevel = average / 128;
                    setAudioLevel(Math.min(1, Math.max(0, normalizedLevel)));
                    animationFrameId = requestAnimationFrame(updateAudioLevel);
                };

                updateAudioLevel();
            } catch (error) {
                console.error("Error accessing microphone:", error);
                if (isActive) {
                    setAudioLevel(0);
                }
            }
        };

        if (isListening) {
            setupAudioAnalysis();
        }

        return () => {
            isActive = false;
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            if (microphone) {
                microphone.disconnect();
            }
            if (audioContext) {
                audioContext.close();
            }
        };
    }, [isListening]);

    const startListening = useCallback(() => {
        setStatus("listening");
        startRecognition();
    }, [startRecognition]);

    const stopListening = useCallback(() => {
        stopRecognition();
        setStatus("idle");
    }, [stopRecognition]);

    const clearTranscript = useCallback(() => {
        setFullTranscript([]);
    }, []);

    const updateSettings = useCallback((newSettings: Partial<RecognitionSettings>) => {
        setSettings((prev) => ({ ...prev, ...newSettings }));
    }, []);

    const toggleFavorite = useCallback((id: string) => {
        setFullTranscript((prev) => prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item)));
    }, []);

    const deleteTranscriptItem = useCallback((id: string) => {
        setFullTranscript((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const undoLastTranscript = useCallback(() => {
        setFullTranscript((prev) => prev.slice(0, -1));
    }, []);

    const value: RecognitionContextType = {
        transcript,
        fullTranscript,
        isListening,
        status,
        settings,
        confidence: 0,
        errorMessage,
        startListening,
        stopListening,
        clearTranscript,
        updateSettings,
        toggleFavorite,
        deleteTranscriptItem,
        audioLevel,
        detectedLanguage,
        undoLastTranscript,
    };

    return <RecognitionContext.Provider value={value}>{children}</RecognitionContext.Provider>;
};
