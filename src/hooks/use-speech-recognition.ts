import { useRef, useEffect, useState, useCallback } from "react";
import { SpeechRecognitionTypes } from "./type";

// Event callback utility function
const useEventCallback = <T extends any[] = any[], R = void>(
    fn: SpeechRecognitionTypes.EventCallback<T, R>,
    dependencies: any[]
): SpeechRecognitionTypes.EventCallback<T, R> => {
    const ref = useRef<SpeechRecognitionTypes.EventCallback<T, R>>(() => {
        throw new Error("Cannot call an event handler while rendering.");
    });

    useEffect(() => {
        ref.current = fn;
    }, [fn, ...dependencies]);

    return useCallback((...args: T) => ref.current(...args), [ref]);
};

// Main hook
export const useSpeechRecognition = (props: SpeechRecognitionTypes.UseSpeechRecognition) => {
    const { onEnd, onResult, onError } = props;
    const recognition = useRef<SpeechRecognitionTypes.RecognitionInstance | null>(null);
    const [listening, setListening] = useState(false);
    const [supported, setSupported] = useState(false);

    const processResult = (event: SpeechRecognitionTypes.SpeechRecognitionEvent) => {
        onResult(
            Array.from(event.results)
                .map((result) => ({ isFinal: result.isFinal, transcript: result[0].transcript }))
                .map((result) => result)
        );
    };

    const handleError = (event: any) => {
        if (!recognition.current) return;
        if (event.error === "not-allowed") {
            recognition.current.onend = () => {};
            setListening(false);
        }
        onError(new Error(event.error));
    };

    const listen = useEventCallback(
        (args: SpeechRecognitionTypes.ListenOptions) => {
            if (listening || !supported || !recognition.current) return;
            const { lang = "", interimResults = true, continuous = false, maxAlternatives = 1, grammars } = args;
            setListening(true);
            recognition.current.lang = lang;
            recognition.current.interimResults = interimResults;
            recognition.current.continuous = continuous;
            recognition.current.maxAlternatives = maxAlternatives;
            if (grammars) {
                recognition.current.grammars = grammars;
            }
            recognition.current.start();
        },
        [listening, supported]
    );

    const stop = useEventCallback(() => {
        if (!listening || !supported || !recognition.current) return;
        recognition.current.stop();
        setListening(false);
        onEnd();
    }, [listening, supported, onEnd]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            setSupported(true);
            recognition.current = new SpeechRecognition();
        }

        return () => {
            if (recognition.current) {
                recognition.current.stop();
                recognition.current.onresult = null;
                recognition.current.onerror = null;
                recognition.current.onend = null;
            }
        };
    }, []);

    useEffect(() => {
        if (recognition.current) {
            recognition.current.onresult = processResult;
            recognition.current.onerror = handleError;
            recognition.current.onend = () => {
                if (listening) recognition.current?.start();
            };
        }
    }, [onResult, onError, listening]);

    return {
        listen,
        listening,
        stop,
        supported,
    };
};
