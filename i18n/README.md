# 🌍 VocabQuest Internationalization (i18n) System

This document provides comprehensive guidance for using and extending the multilingual infrastructure in VocabQuest.

## 🚀 Quick Start

### 1. Basic Usage

```tsx
import { useI18nContext } from '../contexts/I18nContext';

function MyComponent() {
  const { t, tLearn, displayLanguage, learningLanguage } = useI18nContext();
  
  return (
    <div>
      {/* UI text in display language */}
      <h1>{t('welcome', 'home')}</h1>
      
      {/* Learnable term in learning language */}
      <p>{tLearn('hello', 'learn')}</p>
    </div>
  );
}
```

### 2. Language Switcher Component

```tsx
import { LanguageSwitcher } from '../components/LanguageSwitcher';

function Header() {
  return (
    <header>
      <LanguageSwitcher 
        showLearningMode={true} 
        size="md" 
        className="ml-4" 
      />
    </header>
  );
}
```

### 3. Learnable Terms Component

```tsx
import { Learnable } from '../components/Learnable';

function VocabularyCard() {
  return (
    <div>
      <Learnable 
        termKey="hello" 
        namespace="learn"
        variant="highlighted"
        showTooltip={true}
      />
    </div>
  );
}
```

## 🏗️ Architecture Overview

### Core Components

- **`useI18n` Hook**: Main translation logic and language management
- **`I18nProvider`**: Context provider for the entire application
- **`LanguageSwitcher`**: Flag-based language selection component
- **`Learnable`**: Component for displaying study terms in learning language

### Language Modes

1. **Display Language**: The language of the user interface
2. **Learning Language**: The language for study terms (optional)
3. **Source Language**: The original content language (fixed at build time)

### Fallback Chain

- **UI Text**: `displayLanguage` → `sourceLanguage` → key
- **Study Terms**: `learningLanguage` → `displayLanguage` → `sourceLanguage` → key

## 📁 File Structure

```
/i18n/
├── i18n.config.ts          # Language configuration
├── en/                     # English translations
│   ├── common.json         # Common UI strings
│   ├── home.json          # Home page content
│   ├── learn.json         # Learnable terms
│   ├── auth.json          # Authentication
│   └── navigation.json    # Navigation elements
├── he/                     # Hebrew translations
├── fr/                     # French translations
├── ko/                     # Korean translations
└── README.md              # This file
```

## 🌐 Adding New Languages

### Step 1: Update Configuration

Add the new language to `i18n.config.ts`:

```typescript
export const i18nConfig: I18nConfig = {
  // ... existing config
  supportedLanguages: [
    // ... existing languages
    {
      code: 'ja',
      name: 'Japanese',
      nativeName: '日本語',
      flag: '🇯🇵',
      direction: 'ltr',
      isRTL: false
    }
  ],
  namespaces: [
    // ... existing namespaces
    'new_feature'  // Add new namespace if needed
  ]
};
```

### Step 2: Create Translation Files

Create the translation files for the new language:

```json
// i18n/ja/common.json
{
  "loading": "読み込み中...",
  "error": "エラー",
  "success": "成功"
}

// i18n/ja/learn.json
{
  "hello": "こんにちは",
  "thank_you": "ありがとうございます"
}
```

### Step 3: Test the Implementation

1. Start the development server
2. Navigate to `/i18n-demo`
3. Test the new language flag
4. Verify RTL support if applicable

## 📝 Adding New Translation Keys

### 1. Add to English First

Always add new keys to the English translation files first:

```json
// i18n/en/common.json
{
  "new_feature": "New Feature",
  "feature_description": "This is a description of the new feature"
}
```

### 2. Add to Other Languages

Add translations to all supported languages:

```json
// i18n/he/common.json
{
  "new_feature": "תכונה חדשה",
  "feature_description": "זהו תיאור של התכונה החדשה"
}
```

### 3. Use in Components

```tsx
const { t } = useI18nContext();

return (
  <div>
    <h2>{t('new_feature', 'common')}</h2>
    <p>{t('feature_description', 'common')}</p>
  </div>
);
```

## 🎯 Learning Mode Implementation

### Basic Usage

```tsx
import { Learnable } from '../components/Learnable';

function VocabularyList() {
  return (
    <ul>
      <li>
        <Learnable termKey="hello" namespace="learn" />
      </li>
      <li>
        <Learnable termKey="goodbye" namespace="learn" />
      </li>
    </ul>
  );
}
```

### Advanced Usage

```tsx
<Learnable 
  termKey="complex_term"
  namespace="advanced_vocabulary"
  variant="highlighted"
  size="lg"
  showTooltip={true}
  className="custom-styles"
/>
```

### Programmatic Access

```tsx
import { useLearnable } from '../components/Learnable';

function CustomComponent() {
  const { getTerm, getMultipleTerms } = useLearnable();
  
  const singleTerm = getTerm('hello', 'learn');
  const multipleTerms = getMultipleTerms(['hello', 'goodbye'], 'learn');
  
  return (
    <div>
      <p>{singleTerm}</p>
      <p>{multipleTerms.hello} - {multipleTerms.goodbye}</p>
    </div>
  );
}
```

## ♿ Accessibility Features

### RTL Support

- Hebrew automatically enables RTL layout
- HTML `dir` attribute is set automatically
- CSS `.rtl` class is applied for custom styling

### Screen Reader Support

- All flags have proper `aria-label` attributes
- `aria-pressed` indicates active language
- Tooltips provide additional context

### Keyboard Navigation

- All interactive elements are keyboard accessible
- Focus indicators are clearly visible
- Tab order follows logical flow

## 🧪 Testing

### Unit Tests

```typescript
import { renderHook } from '@testing-library/react';
import { useI18n } from '../hooks/useI18n';

describe('useI18n', () => {
  it('should fallback to source language when translation is missing', () => {
    const { result } = renderHook(() => useI18n());
    expect(result.current.t('missing_key')).toBe('missing_key');
  });
});
```

### E2E Tests

```typescript
// cypress/e2e/i18n.cy.ts
describe('Internationalization', () => {
  it('should switch display language when flag is clicked', () => {
    cy.visit('/i18n-demo');
    cy.get('[data-testid="hebrew-flag"]').click();
    cy.get('html').should('have.attr', 'lang', 'he');
    cy.get('html').should('have.attr', 'dir', 'rtl');
  });
});
```

## 🔧 Configuration Options

### Language Switcher Props

```tsx
<LanguageSwitcher 
  showLearningMode={true}    // Show learning mode tabs
  size="md"                  // sm, md, lg
  className="custom-class"   // Additional CSS classes
/>
```

### Learnable Component Props

```tsx
<Learnable 
  termKey="hello"            // Translation key (required)
  namespace="learn"          // Translation namespace
  showTooltip={true}         // Show translation tooltip
  variant="default"          // default, highlighted, subtle
  size="md"                  // sm, md, lg
  className="custom-class"   // Additional CSS classes
/>
```

## 🚨 Common Issues & Solutions

### Issue: Translations Not Loading

**Solution**: Check that the translation file path is correct and the JSON is valid.

### Issue: RTL Not Working

**Solution**: Ensure the language is properly configured in `i18n.config.ts` with `isRTL: true`.

### Issue: Learning Mode Not Working

**Solution**: Verify that `learningLanguage` is different from `displayLanguage`.

### Issue: Missing Fallbacks

**Solution**: Always provide English translations as the source language fallback.

## 📚 Best Practices

1. **Namespace Organization**: Group related translations logically
2. **Key Naming**: Use descriptive, hierarchical keys (e.g., `auth.login.button`)
3. **Fallback Strategy**: Always provide English translations
4. **Testing**: Test with multiple language combinations
5. **Performance**: Use translation caching and lazy loading
6. **Accessibility**: Include proper ARIA labels and keyboard support

## 🔮 Future Enhancements

- [ ] ICU MessageFormat support for complex pluralization
- [ ] Date and number formatting
- [ ] Currency and locale-specific formatting
- [ ] Translation memory and suggestions
- [ ] Crowdsourced translation contributions
- [ ] Machine translation integration
- [ ] Translation quality metrics

## 📞 Support

For questions or issues with the i18n system:

1. Check this README first
2. Review the demo page at `/i18n-demo`
3. Check existing translation files for examples
4. Create an issue with detailed description

---

**Happy Internationalizing! 🌍✨**
