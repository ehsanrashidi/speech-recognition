import React from 'react';
import { TranscriptItem as TranscriptItemType } from '../types';
import TranscriptItem from './TranscriptItem';
import { useRecognition } from '../context/RecognitionContext';

const TranscriptList: React.FC = () => {
  const { fullTranscript, toggleFavorite, deleteTranscriptItem } = useRecognition();

  if (fullTranscript.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-gray-400"
          >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" y1="19" x2="12" y2="22"></line>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">No transcripts yet</h3>
        <p className="text-sm text-gray-500 max-w-sm mt-1">
          Click the microphone button to start recording and your transcripts will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {fullTranscript.map((item) => (
        <TranscriptItem
          key={item.id}
          item={item}
          onToggleFavorite={toggleFavorite}
          onDelete={deleteTranscriptItem}
        />
      ))}
    </div>
  );
};

export default TranscriptList;