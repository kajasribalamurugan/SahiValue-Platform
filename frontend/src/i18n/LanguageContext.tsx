import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  getTranslatedMaterialName: (id: string, defaultName: string) => string;
  getTranslatedMaterialDesc: (id: string, defaultDesc: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('sahiValueLanguage');
    if (saved === 'hi' || saved === 'mr' || saved === 'en') {
      return saved as Language;
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sahiValueLanguage', lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    const langDict = translations[language] || translations['en'];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English if missing in target language
    const enDict = translations['en'];
    return enDict[key] || key;
  };

  const getTranslatedMaterialName = (id: string, defaultName: string): string => {
    const keyMap: Record<string, string> = {
      'm-pcb': 'material.pcb.name',
      'pcb': 'material.pcb.name',
      'm-copper': 'material.copper.name',
      'copper': 'material.copper.name',
      'm-battery': 'material.battery.name',
      'battery': 'material.battery.name',
      'm-mixed': 'material.mixed.name',
      'mixed': 'material.mixed.name',
      'mixed_it': 'material.mixed.name',
      'm-monitors': 'material.monitors.name',
      'monitors': 'material.monitors.name',
      'm-appliances': 'material.appliances.name',
      'appliances': 'material.appliances.name',
    };
    const key = keyMap[id];
    return key ? t(key) : defaultName;
  };

  const getTranslatedMaterialDesc = (id: string, defaultDesc: string): string => {
    const keyMap: Record<string, string> = {
      'm-pcb': 'material.pcb.desc',
      'pcb': 'material.pcb.desc',
      'm-copper': 'material.copper.desc',
      'copper': 'material.copper.desc',
      'm-battery': 'material.battery.desc',
      'battery': 'material.battery.desc',
      'm-mixed': 'material.mixed.desc',
      'mixed': 'material.mixed.desc',
      'mixed_it': 'material.mixed.desc',
      'm-monitors': 'material.monitors.desc',
      'monitors': 'material.monitors.desc',
      'm-appliances': 'material.appliances.desc',
      'appliances': 'material.appliances.desc',
    };
    const key = keyMap[id];
    return key ? t(key) : defaultDesc;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        getTranslatedMaterialName,
        getTranslatedMaterialDesc,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
