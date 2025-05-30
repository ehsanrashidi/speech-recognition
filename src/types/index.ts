// Type definitions for the application

export interface TranscriptItem {
    id: string;
    text: string;
    timestamp: Date;
    language: string;
    confidence: number;
    isFavorite: boolean;
}

export interface RecognitionSettings {
    language: string;
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;
    autoDetectLanguage?: boolean;
}

export type RecognitionStatus = "idle" | "listening" | "processing" | "error";

export interface AudioVisualizerProps {
    isActive: boolean;
    audioLevel?: number;
}

export interface ThemeColors {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: {
        primary: string;
        secondary: string;
        accent: string;
    };
}

export interface RecognitionContextType {
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
