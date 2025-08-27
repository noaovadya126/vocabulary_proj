export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
  isRTL: boolean;
}

export interface I18nConfig {
  sourceLanguage: string;
  supportedLanguages: Language[];
  fallbackLanguage: string;
  namespaces: string[];
}

export const i18nConfig: I18nConfig = {
  sourceLanguage: 'en',
  fallbackLanguage: 'en',
  supportedLanguages: [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      direction: 'ltr',
      isRTL: false
    },
    {
      code: 'he',
      name: 'Hebrew',
      nativeName: 'עברית',
      flag: '🇮🇱',
      direction: 'rtl',
      isRTL: true
    },
    {
      code: 'fr',
      name: 'French',
      nativeName: 'Français',
      flag: '🇫🇷',
      direction: 'ltr',
      isRTL: false
    },
    {
      code: 'ko',
      name: 'Korean',
      nativeName: '한국어',
      flag: '🇰🇷',
      direction: 'ltr',
      isRTL: false
    }
  ],
  namespaces: ['common', 'home', 'learn', 'auth', 'navigation']
};

export const getLanguageByCode = (code: string): Language | undefined => {
  return i18nConfig.supportedLanguages.find(lang => lang.code === code);
};

export const isRTL = (languageCode: string): boolean => {
  const language = getLanguageByCode(languageCode);
  return language?.isRTL || false;
};
