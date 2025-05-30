import React from 'react';

interface LanguageSelectorProps {
  currentLanguage: string;
  onSelectLanguage: (language: string) => void;
}

const languages = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'fa-IR', name: 'Persian (فارسی)' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'fr-FR', name: 'French' },
  { code: 'de-DE', name: 'German' },
  { code: 'it-IT', name: 'Italian' },
  { code: 'pt-BR', name: 'Portuguese' },
  { code: 'ru-RU', name: 'Russian' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'ko-KR', name: 'Korean' },
  { code: 'ar-SA', name: 'Arabic' },
  { code: 'hi-IN', name: 'Hindi' },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onSelectLanguage,
}) => {
  return (
    <div className="max-h-60 overflow-y-auto py-1">
      <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
        Select Language
      </div>
      <div className="mt-1">
        {languages.map((language) => (
          <button
            key={language.code}
            className={`w-full text-left px-3 py-2 text-sm rounded-md ${
              currentLanguage === language.code
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => onSelectLanguage(language.code)}
          >
            {language.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;