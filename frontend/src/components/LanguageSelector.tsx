import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Language } from '../i18n/translations';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  compact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ compact = true }) => {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'mr', label: 'मराठी' },
  ];

  return (
    <div className="inline-flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
      <Globe className="w-3.5 h-3.5 text-slate-500 ml-1 mr-0.5 shrink-0" />
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
            language === lang.code
              ? 'bg-white text-emerald-800 shadow-2xs font-extrabold border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};
