import { getLanguageByCode, i18nConfig, isRTL } from '../i18n.config';

describe('i18n Configuration', () => {
  test('should have valid language configuration', () => {
    expect(i18nConfig.supportedLanguages).toBeDefined();
    expect(i18nConfig.supportedLanguages.length).toBeGreaterThan(0);
    expect(i18nConfig.sourceLanguage).toBe('en');
    expect(i18nConfig.fallbackLanguage).toBe('en');
  });

  test('should support required languages', () => {
    const languageCodes = i18nConfig.supportedLanguages.map(lang => lang.code);
    expect(languageCodes).toContain('en');
    expect(languageCodes).toContain('he');
    expect(languageCodes).toContain('fr');
    expect(languageCodes).toContain('ko');
  });

  test('should have valid language objects', () => {
    i18nConfig.supportedLanguages.forEach(language => {
      expect(language.code).toBeDefined();
      expect(language.name).toBeDefined();
      expect(language.nativeName).toBeDefined();
      expect(language.flag).toBeDefined();
      expect(language.direction).toBeDefined();
      expect(language.isRTL).toBeDefined();
    });
  });

  test('should correctly identify RTL languages', () => {
    expect(isRTL('he')).toBe(true);
    expect(isRTL('en')).toBe(false);
    expect(isRTL('fr')).toBe(false);
    expect(isRTL('ko')).toBe(false);
  });

  test('should find languages by code', () => {
    const hebrew = getLanguageByCode('he');
    expect(hebrew).toBeDefined();
    expect(hebrew?.code).toBe('he');
    expect(hebrew?.isRTL).toBe(true);

    const english = getLanguageByCode('en');
    expect(english).toBeDefined();
    expect(english?.code).toBe('en');
    expect(english?.isRTL).toBe(false);

    const invalid = getLanguageByCode('invalid');
    expect(invalid).toBeUndefined();
  });

  test('should have valid namespaces', () => {
    expect(i18nConfig.namespaces).toBeDefined();
    expect(i18nConfig.namespaces.length).toBeGreaterThan(0);
    expect(i18nConfig.namespaces).toContain('common');
    expect(i18nConfig.namespaces).toContain('learn');
  });
});

describe('Language Properties', () => {
  test('Hebrew should have correct properties', () => {
    const hebrew = getLanguageByCode('he');
    expect(hebrew?.direction).toBe('rtl');
    expect(hebrew?.isRTL).toBe(true);
    expect(hebrew?.nativeName).toBe('עברית');
  });

  test('English should have correct properties', () => {
    const english = getLanguageByCode('en');
    expect(english?.direction).toBe('ltr');
    expect(english?.isRTL).toBe(false);
    expect(english?.nativeName).toBe('English');
  });

  test('French should have correct properties', () => {
    const french = getLanguageByCode('fr');
    expect(french?.direction).toBe('ltr');
    expect(french?.isRTL).toBe(false);
    expect(french?.nativeName).toBe('Français');
  });

  test('Korean should have correct properties', () => {
    const korean = getLanguageByCode('ko');
    expect(korean?.direction).toBe('ltr');
    expect(korean?.isRTL).toBe(false);
    expect(korean?.nativeName).toBe('한국어');
  });
});
