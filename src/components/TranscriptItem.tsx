import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Star, Trash2, Volume2 } from 'lucide-react';
import { TranscriptItem as TranscriptItemType } from '../types';
import { Card, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';

interface TranscriptItemProps {
  item: TranscriptItemType;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

const TranscriptItem: React.FC<TranscriptItemProps> = ({
  item,
  onToggleFavorite,
  onDelete,
}) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-emerald-500';
    if (confidence >= 0.6) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const speakText = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(item.text);
      utterance.lang = item.language;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <Card 
      className="group hover:border-primary/20 transition-all duration-300"
      style={{
        opacity: item.isFavorite ? 1 : 0.95,
        transform: `scale(${item.isFavorite ? 1.01 : 1})`,
      }}
    >
      <CardContent className="pt-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-base text-gray-900 leading-relaxed">{item.text}</p>
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <span>{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</span>
              <span className="mx-2">•</span>
              <span>{item.language}</span>
              <span className="mx-2">•</span>
              <div className="flex items-center">
                <div 
                  className={`w-2 h-2 rounded-full mr-1 ${getConfidenceColor(item.confidence)}`}
                />
                <span>{Math.round(item.confidence * 100)}% confidence</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="justify-between border-t border-gray-100 pt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-500 hover:text-gray-700"
          onClick={speakText}
        >
          <Volume2 size={16} className="mr-1" />
          <span>Play</span>
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={item.isFavorite ? "text-amber-500" : "text-gray-500 hover:text-amber-500"}
            onClick={() => onToggleFavorite(item.id)}
          >
            <Star size={16} fill={item.isFavorite ? "currentColor" : "none"} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-red-500"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TranscriptItem;