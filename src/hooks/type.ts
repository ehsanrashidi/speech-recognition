export namespace SpeechRecognitionTypes {
    // Extend the Window interface to include SpeechRecognition and webkitSpeechRecognition
    export interface WindowWithSpeechRecognition extends Window {
        SpeechRecognition: new () => any;
        webkitSpeechRecognition: new () => any;
    }

    // Type for the recognition instance
    export type RecognitionInstance = any;

    // Props for the useSpeechRecognition hook
    export type UseSpeechRecognition = {
        onResult: (result: RecognizedSpeech[]) => void;
        onEnd: () => void;
        onError: (error: Error) => void;
    };

    // Options for the listen function
    export type ListenOptions = {
        lang?: string;
        interimResults?: boolean;
        continuous?: boolean;
        maxAlternatives?: number;
        grammars?: any;
    };

    // Event callback utility type
    export type EventCallback<T extends any[] = any[], R = void> = (...args: T) => R;

    interface RecognizedSpeech {
        isFinal: boolean;
        transcript: string;
    }

    interface SpeechRecognitionAlternative {
        transcript: string;
        confidence: number;
    }

    interface SpeechRecognitionResult {
        isFinal: boolean;
        length: number;
        item(index: number): SpeechRecognitionAlternative;
        [index: number]: SpeechRecognitionAlternative;
    }

    interface SpeechRecognitionResultList {
        length: number;
        item(index: number): SpeechRecognitionResult;
        [index: number]: SpeechRecognitionResult;
    }

    export interface SpeechRecognitionEvent extends Event {
        resultIndex: number;
        results: SpeechRecognitionResultList;
        target: SpeechRecognition;
    }

    interface SpeechRecognition extends EventTarget {
        grammars: any;
        lang: string;
        continuous: boolean;
        interimResults: boolean;
        maxAlternatives: number;
    }
}
