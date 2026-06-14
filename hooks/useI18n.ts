'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Language, getLanguageByCode, i18nConfig, isRTL } from '../i18n.config';

export interface I18nContextType {
  displayLanguage: string;
  learningLanguage?: string;
  sourceLanguage: string;
  t: (key: string, namespace?: string) => string;
  tLearn: (key: string, namespace?: string) => string;
  setDisplayLanguage: (language: string) => void;
  setLearningLanguage: (language?: string) => void;
  currentLanguage: Language;
  isRTL: boolean;
  supportedLanguages: Language[];
}

interface Translations {
  [namespace: string]: {
    [key: string]: string;
  };
}

// Cache for loaded translations
const translationCache: { [key: string]: Translations } = {};

export const useI18n = (): I18nContextType => {
  const [displayLanguage, setDisplayLanguageState] = useState<string>('en');
  const [learningLanguage, setLearningLanguageState] = useState<string | undefined>();
  const [translations, setTranslations] = useState<Translations>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load translations for a specific language
  const loadTranslations = useCallback(async (languageCode: string): Promise<Translations> => {
    if (translationCache[languageCode]) {
      return translationCache[languageCode];
    }

    const loadedTranslations: Translations = {};

    try {
      for (const namespace of i18nConfig.namespaces) {
        try {
          const response = await import(`../i18n/${languageCode}/${namespace}.json`);
          loadedTranslations[namespace] = response.default;
        } catch (error) {
          console.warn(`Failed to load ${namespace} translations for ${languageCode}:`, error);
          loadedTranslations[namespace] = {};
        }
      }

      translationCache[languageCode] = loadedTranslations;
      return loadedTranslations;
    } catch (error) {
      console.error(`Failed to load translations for ${languageCode}:`, error);
      return {};
    }
  }, []);

  // UI is English-only — always use English display language
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        localStorage.setItem('displayLanguage', 'en');

        const validDisplayLang = 'en';
        const savedLearningLang = localStorage.getItem('learningLanguage') || undefined;
        const validLearningLang = savedLearningLang && getLanguageByCode(savedLearningLang) ? savedLearningLang : undefined;

        setDisplayLanguageState(validDisplayLang);
        setLearningLanguageState(validLearningLang);

        const displayTranslations = await loadTranslations(validDisplayLang);
        setTranslations(displayTranslations);

        if (validLearningLang && validLearningLang !== validDisplayLang) {
          await loadTranslations(validLearningLang);
        }

        updateHtmlAttributes(validDisplayLang);
      } catch (error) {
        console.error('Failed to initialize language:', error);
        setDisplayLanguageState('en');
        setLearningLanguageState(undefined);
      } finally {
        setIsLoading(false);
      }
    };

    initializeLanguage();
  }, [loadTranslations]);

  // Update HTML lang and dir attributes
  const updateHtmlAttributes = useCallback((languageCode: string) => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = languageCode;
      document.documentElement.dir = isRTL(languageCode) ? 'rtl' : 'ltr';
      
      // Add/remove RTL class
      if (isRTL(languageCode)) {
        document.documentElement.classList.add('rtl');
      } else {
        document.documentElement.classList.remove('rtl');
      }
    }
  }, []);

  // Set display language
  const setDisplayLanguage = useCallback(async (_languageCode: string) => {
    // English-only UI — ignore display language changes
  }, []);

  // Set learning language
  const setLearningLanguage = useCallback((languageCode?: string) => {
    if (languageCode === learningLanguage) return;

    if (languageCode && !getLanguageByCode(languageCode)) {
      console.error(`Unsupported learning language: ${languageCode}`);
      return;
    }

    setLearningLanguageState(languageCode);
    
    if (languageCode) {
      localStorage.setItem('learningLanguage', languageCode);
    } else {
      localStorage.removeItem('learningLanguage');
    }
  }, [learningLanguage]);

  // Translation function for UI text
  const t = useCallback((key: string, namespace: string = 'common'): string => {
    if (isLoading) return key;

    // Try display language first
    if (translations[namespace]?.[key]) {
      return translations[namespace][key];
    }

    // Fallback to source language (English)
    if (translationCache.en?.[namespace]?.[key]) {
      return translationCache.en[namespace][key];
    }

    // Final fallback to key itself
    return key;
  }, [translations, isLoading]);

  // Translation function for learnable terms
  const tLearn = useCallback((key: string, namespace: string = 'learn'): string => {
    if (isLoading) return key;

    // If learning language is set and different from display language
    if (learningLanguage && learningLanguage !== displayLanguage) {
      const learningTranslations = translationCache[learningLanguage];
      if (learningTranslations?.[namespace]?.[key]) {
        return learningTranslations[namespace][key];
      }
    }

    // Fallback to display language
    if (translations[namespace]?.[key]) {
      return translations[namespace][key];
    }

    // Fallback to source language (English)
    if (translationCache.en?.[namespace]?.[key]) {
      return translationCache.en[namespace][key];
    }

    // Final fallback to key itself
    return key;
  }, [translations, learningLanguage, displayLanguage, isLoading]);

  // Memoized values
  const currentLanguage = useMemo(
    () => getLanguageByCode(displayLanguage) ?? i18nConfig.supportedLanguages[0],
    [displayLanguage]
  );
  const isRTLMode = useMemo(() => isRTL(displayLanguage), [displayLanguage]);

  return {
    displayLanguage,
    learningLanguage,
    sourceLanguage: i18nConfig.sourceLanguage,
    t,
    tLearn,
    setDisplayLanguage,
    setLearningLanguage,
    currentLanguage,
    isRTL: isRTLMode,
    supportedLanguages: i18nConfig.supportedLanguages,
  };
};
