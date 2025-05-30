import React, { useEffect, useRef } from 'react';
import { useRecognition } from '../context/RecognitionContext';

const TranscriptDisplay: React.FC = () => {
  const { transcript, status } = useRecognition();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the bottom when transcript changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [transcript]);
  
  if (!transcript && status !== 'listening') {
    return null;
  }
  
  return (
    <div 
      ref={containerRef}
      className={`mt-4 p-4 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm min-h-[80px] transition-opacity duration-300 ${
        transcript ? 'opacity-100' : 'opacity-70'
      }`}
    >
      {transcript ? (
        <p className="text-gray-800 text-lg">{transcript}</p>
      ) : (
        <p className="text-gray-400 text-center italic">
          Listening for speech...
        </p>
      )}
    </div>
  );
};

export default TranscriptDisplay;