import React from 'react';
import { Languages, Settings, Trash2 } from 'lucide-react';
import { Button } from './ui/Button';
import { useRecognition } from '../context/RecognitionContext';
import LanguageSelector from './LanguageSelector';
import { Card } from './ui/Card';

const ControlPanel: React.FC = () => {
  const { 
    clearTranscript, 
    fullTranscript,
    settings, 
    updateSettings 
  } = useRecognition();
  
  const [showLanguageSelector, setShowLanguageSelector] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  
  const toggleLanguageSelector = () => {
    setShowLanguageSelector(!showLanguageSelector);
    if (showSettings) setShowSettings(false);
  };
  
  const toggleSettings = () => {
    setShowSettings(!showSettings);
    if (showLanguageSelector) setShowLanguageSelector(false);
  };
  
  return (
    <div className="relative">
      <div className="flex items-center justify-between py-3">
        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={toggleLanguageSelector}
            className={showLanguageSelector ? "bg-gray-100" : ""}
          >
            <Languages size={16} className="mr-2" />
            <span>{settings.language.split('-')[0].toUpperCase()}</span>
          </Button>
          
          <Button 
            variant="outline"
            size="sm"
            onClick={toggleSettings}
            className={showSettings ? "bg-gray-100" : ""}
          >
            <Settings size={16} className="mr-2" />
            <span>Settings</span>
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={clearTranscript}
          disabled={fullTranscript.length === 0}
          className="text-gray-500 hover:text-red-500 disabled:opacity-30"
        >
          <Trash2 size={16} className="mr-2" />
          <span>Clear All</span>
        </Button>
      </div>
      
      {showLanguageSelector && (
        <Card className="absolute top-full left-0 z-10 w-64 mt-1 p-2 shadow-lg">
          <LanguageSelector 
            currentLanguage={settings.language} 
            onSelectLanguage={(lang) => {
              updateSettings({ language: lang });
              setShowLanguageSelector(false);
            }}
          />
        </Card>
      )}
      
      {showSettings && (
        <Card className="absolute top-full left-0 z-10 w-64 mt-1 p-4 shadow-lg">
          <h3 className="font-medium mb-3">Recognition Settings</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm">Continuous</label>
              <input 
                type="checkbox"
                checked={settings.continuous}
                onChange={(e) => updateSettings({ continuous: e.target.checked })}
                className="rounded text-primary focus:ring-primary"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm">Interim Results</label>
              <input 
                type="checkbox"
                checked={settings.interimResults}
                onChange={(e) => updateSettings({ interimResults: e.target.checked })}
                className="rounded text-primary focus:ring-primary"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm">Max Alternatives</label>
              <select
                value={settings.maxAlternatives}
                onChange={(e) => updateSettings({ maxAlternatives: Number(e.target.value) })}
                className="rounded border border-gray-300 text-sm py-1"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ControlPanel;