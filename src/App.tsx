import React from "react";
import { RecognitionProvider } from "./context/RecognitionContext";
import Header from "./components/Header";
import RecognitionButton from "./components/RecognitionButton";
import AudioVisualizer from "./components/AudioVisualizer";
import TranscriptDisplay from "./components/TranscriptDisplay";
import TranscriptList from "./components/TranscriptList";
import CombinedTranscript from "./components/CombinedTranscript";
import ControlPanel from "./components/ControlPanel";
import { useRecognition } from "./context/RecognitionContext";

const MainContent: React.FC = () => {
    const { isListening, audioLevel, status } = useRecognition();

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <Header />

            <main className="mt-6">
                <div className="flex flex-col items-center mb-10">
                    <AudioVisualizer isActive={isListening} audioLevel={audioLevel} status={status} />

                    <div className="mt-6">
                        <RecognitionButton />
                    </div>

                    <TranscriptDisplay />
                </div>

                <div className="border-t border-gray-200 pt-4">
                    <ControlPanel />
                    <CombinedTranscript />
                    <div className="mt-4">
                        <TranscriptList />
                    </div>
                </div>
            </main>
        </div>
    );
};

function App() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <RecognitionProvider>
                <MainContent />
            </RecognitionProvider>
        </div>
    );
}

export default App;
