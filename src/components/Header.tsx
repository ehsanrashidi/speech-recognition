import React from 'react';
import { Mic } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-primary/10 text-primary p-2 rounded-lg">
            <Mic size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">VoiceScribe</h1>
            <p className="text-sm text-gray-500">Premium Speech Recognition</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;