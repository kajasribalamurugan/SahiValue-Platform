import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '../types';
import { translations } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string) => string;
  getBilingualEntity: (officialName: string, localHi?: string, localMr?: string) => { primary: string; secondary: string | null };
  getBilingualMaterial: (id: string, defaultName: string) => { primary: string; secondary: string | null };
  getTranslatedMaterialDesc: (id: string, defaultDesc: string) => string;
}

const LANGUAGE_STORAGE_KEY = '@sahi_value_collector_language';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (saved === 'hi' || saved === 'mr' || saved === 'en') {
          setLanguageState(saved as Language);
        }
      } catch (e) {
        // Fallback to English
      } finally {
        setIsLoading(false);
      }
    };
    loadSavedLanguage();
  }, []);

  const setLanguage = useCallback(async (lang: Language) => {
    setLanguageState(lang);
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (e) {
      // Save error ignored
    }
  }, []);

  const t = useCallback((key: string): string => {
    const langDict = translations[language] || translations['en'];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    const enDict = translations['en'];
    return enDict[key] || key;
  }, [language]);

  const getBilingualEntity = useCallback((officialName: string, localHi?: string, localMr?: string) => {
    if (language === 'en') {
      return { primary: officialName, secondary: null };
    }
    const local = language === 'hi' ? localHi : localMr;
    if (!local || local === officialName) {
      return { primary: officialName, secondary: null };
    }
    return { primary: local, secondary: officialName };
  }, [language]);

  const getBilingualMaterial = useCallback((id: string, defaultName: string) => {
    const hiMap: Record<string, string> = {
      'm-pcb': 'मदरबोर्ड व पीसीबी (PCBs)',
      'm-copper': 'कॉपर केबल व तार',
      'm-battery': 'लिथियम व लेड बैटरियां',
      'm-mixed': 'आईटी हार्डवेयर व लैपटॉप',
      'm-monitors': 'मॉनिटर व स्क्रीन',
      'm-appliances': 'घरेलू उपकरण व स्क्रैप',
    };
    const mrMap: Record<string, string> = {
      'm-pcb': 'मदरबोर्ड व पीसीबी (PCBs)',
      'm-copper': 'कॉपर केबल व तार',
      'm-battery': 'लिथियम व लेड बॅटऱ्या',
      'm-mixed': 'आयटी हार्डवेअर व लॅपटॉप',
      'm-monitors': 'मॉनिटर व स्क्रीन',
      'm-appliances': 'घरगुती उपकरणे व स्क्रॅप',
    };

    if (language === 'en') {
      return { primary: defaultName, secondary: null };
    }

    const localName = language === 'hi' ? hiMap[id] : mrMap[id];
    if (!localName) {
      return { primary: defaultName, secondary: null };
    }

    return { primary: localName, secondary: defaultName };
  }, [language]);

  const getTranslatedMaterialDesc = useCallback((id: string, defaultDesc: string): string => {
    const keyMap: Record<string, string> = {
      'm-pcb': 'material.pcb.desc',
      'm-copper': 'material.copper.desc',
      'm-battery': 'material.battery.desc',
      'm-mixed': 'material.mixed.desc',
      'm-monitors': 'material.monitors.desc',
      'm-appliances': 'material.appliances.desc',
    };
    const key = keyMap[id];
    return key ? t(key) : defaultDesc;
  }, [t]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t,
    getBilingualEntity,
    getBilingualMaterial,
    getTranslatedMaterialDesc,
  }), [language, setLanguage, t, getBilingualEntity, getBilingualMaterial, getTranslatedMaterialDesc]);

  return (
    <LanguageContext.Provider value={value}>
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
