import React from 'react';
import { Language } from './types';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  currentLang: Language;
  onSelect: (lang: Language) => void;
}

export function LanguageSelector({ currentLang, onSelect }: LanguageSelectorProps) {
  const languages: { code: Language; name: string }[] = [
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'ml', name: 'മലയാളം (Malayalam)' },
    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  ];

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 text-gray-700 bg-white border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50">
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">
          {languages.find((l) => l.code === currentLang)?.name.split(' ')[0]}
        </span>
      </button>
      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg hidden group-hover:block z-50">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onSelect(lang.code)}
            className={`block w-full text-left px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 ${
              currentLang === lang.code ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
            }`}
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
}
