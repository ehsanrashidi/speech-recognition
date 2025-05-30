import { useState, useEffect, useCallback } from "react";

interface SpeechRecognitionErrorEvent {
    error: string;
}

interface SpeechRecognitionResult {
    transcript: string;
    confidence: number;
}

interface SpeechRecognitionResultList {
    isFinal: boolean;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent {
    resultIndex: number;
    results: SpeechRecognitionResultList[];
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;
    lang: string;
    start: () => void;
    stop: () => void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
}

interface UseSpeechRecognitionProps {
    onResult?: (transcript: string, detectedLanguage?: string) => void;
    onEnd?: () => void;
    onError?: (error: string) => void;
    language?: string;
    continuous?: boolean;
    interimResults?: boolean;
    maxAlternatives?: number;
    autoDetectLanguage?: boolean;
}

interface UseSpeechRecognitionReturn {
    isListening: boolean;
    start: () => void;
    stop: () => void;
    transcript: string;
    error: string | null;
    detectedLanguage: string | null;
}

const SUPPORTED_LANGUAGES = [
    "en-US", // English (US)
    "fa-IR", // Persian
    "en-GB", // English (UK)
    "es-ES", // Spanish
    "fr-FR", // French
    "de-DE", // German
];

export const useSpeechRecognition = ({
    onResult,
    onEnd,
    onError,
    language = "en-US",
    continuous = true,
    interimResults = true,
    maxAlternatives = 1,
    autoDetectLanguage = true,
}: UseSpeechRecognitionProps = {}): UseSpeechRecognitionReturn => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
    const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
    const [recognitionInstances, setRecognitionInstances] = useState<SpeechRecognition[]>([]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const SpeechRecognition =
            (
                window as Window &
                    typeof globalThis & {
                        SpeechRecognition?: new () => SpeechRecognition;
                        webkitSpeechRecognition?: new () => SpeechRecognition;
                    }
            ).SpeechRecognition ||
            (
                window as Window &
                    typeof globalThis & {
                        webkitSpeechRecognition: new () => SpeechRecognition;
                    }
            ).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setError("Speech recognition is not supported in this browser.");
            return;
        }

        let isActive = true;

        if (autoDetectLanguage) {
            const instances = SUPPORTED_LANGUAGES.map((lang) => {
                const instance = new SpeechRecognition();
                instance.continuous = continuous;
                instance.interimResults = interimResults;
                instance.maxAlternatives = maxAlternatives;
                instance.lang = lang;
                return instance;
            });
            if (isActive) {
                setRecognitionInstances(instances);
            }
        } else {
            const instance = new SpeechRecognition();
            instance.continuous = continuous;
            instance.interimResults = interimResults;
            instance.maxAlternatives = maxAlternatives;
            instance.lang = language;
            if (isActive) {
                setRecognition(instance);
            }
        }

        return () => {
            isActive = false;
            if (isListening) {
                if (autoDetectLanguage) {
                    recognitionInstances.forEach((instance) => instance.stop());
                } else if (recognition) {
                    recognition.stop();
                }
            }
        };
    }, [language, continuous, interimResults, maxAlternatives, autoDetectLanguage]);

    useEffect(() => {
        const handleRecognitionResult = (event: SpeechRecognitionEvent, lang: string) => {
            let interimTranscript = "";
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const res = event.results[i];
                if (res.isFinal) {
                    const transcriptText = res[0].transcript;
                    const confidence = res[0].confidence;
                    if (confidence > 0.4) {
                        setDetectedLanguage(lang);
                        setTranscript(transcriptText);
                        onResult?.(transcriptText, lang);
                        if (autoDetectLanguage) {
                            recognitionInstances.forEach((instance) => {
                                if (instance.lang !== lang) {
                                    try {
                                        instance.stop();
                                    } catch (err) {
                                        console.error(`Error stopping recognition for ${instance.lang}:`, err);
                                        // Ignore errors when stopping instances
                                    }
                                }
                            });
                        }
                    }
                } else {
                    interimTranscript += res[0].transcript;
                }
            }
            if (interimTranscript) {
                setTranscript(interimTranscript);
            }
        };

        let isActive = true;

        if (autoDetectLanguage) {
            recognitionInstances.forEach((instance) => {
                instance.onresult = (event: SpeechRecognitionEvent) => {
                    if (isActive) {
                        handleRecognitionResult(event, instance.lang);
                    }
                };
                instance.onerror = (event: SpeechRecognitionErrorEvent) => {
                    if (isActive && event.error !== "no-speech") {
                        setError(`Speech recognition error: ${event.error}`);
                        onError?.(`Speech recognition error: ${event.error}`);
                    }
                };
                instance.onend = () => {
                    if (isActive) {
                        setIsListening(false);
                        onEnd?.();
                    }
                };
            });
        } else if (recognition) {
            recognition.onresult = (event: SpeechRecognitionEvent) => {
                if (isActive) {
                    handleRecognitionResult(event, recognition.lang);
                }
            };
            recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                if (isActive) {
                    setError(`Speech recognition error: ${event.error}`);
                    onError?.(`Speech recognition error: ${event.error}`);
                }
            };
            recognition.onend = () => {
                if (isActive) {
                    setIsListening(false);
                    onEnd?.();
                }
            };
        }

        return () => {
            isActive = false;
        };
    }, [recognition, recognitionInstances, autoDetectLanguage, onResult, onError, onEnd]);

    const start = useCallback(() => {
        if (autoDetectLanguage) {
            recognitionInstances.forEach((instance) => {
                try {
                    instance.start();
                } catch (err) {
                    // Ignore already started errors
                    if (err instanceof Error && !err.message.includes("already started")) {
                        console.error(`Error starting recognition for ${instance.lang}:`, err);
                    }
                }
            });
            setIsListening(true);
            setError(null);
        } else if (recognition) {
            try {
                recognition.start();
                setIsListening(true);
                setError(null);
            } catch (err) {
                if (err instanceof Error) {
                    if (err.message.includes("already started")) {
                        setIsListening(true);
                    } else {
                        setError(err.message);
                        onError?.(err.message);
                    }
                }
            }
        }
    }, [recognition, recognitionInstances, autoDetectLanguage, onError]);

    const stop = useCallback(() => {
        if (autoDetectLanguage) {
            recognitionInstances.forEach((instance) => {
                try {
                    instance.stop();
                } catch (err) {
                    console.error(`Error stopping recognition for ${instance.lang}:`, err);
                    // Ignore errors when stopping
                }
            });
        } else if (recognition) {
            try {
                recognition.stop();
            } catch (err) {
                console.error(`Error stopping recognition for ${recognition.lang}:`, err);
                if (err instanceof Error) {
                    setError(err.message);
                    onError?.(err.message);
                }
            }
        }
        setIsListening(false);
    }, [recognition, recognitionInstances, autoDetectLanguage, onError]);

    return {
        isListening,
        start,
        stop,
        transcript,
        error,
        detectedLanguage,
    };
};
