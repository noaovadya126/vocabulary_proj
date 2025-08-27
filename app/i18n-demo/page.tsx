'use client';

import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { Learnable } from '../../components/Learnable';
import { useI18nContext } from '../../contexts/I18nContext';

export default function I18nDemoPage() {
  const { t, tLearn, displayLanguage, learningLanguage, sourceLanguage } = useI18nContext();

  const sampleTerms = [
    'hello',
    'thank_you',
    'please',
    'sorry',
    'yes',
    'no',
    'what',
    'where',
    'when',
    'how'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🌍 {t('i18n_demo_title', 'common') || 'Internationalization Demo'}
          </h1>
          <p className="text-xl text-gray-600">
            {t('i18n_demo_subtitle', 'common') || 'Experience the power of our multilingual infrastructure'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Language Controls */}
          <div className="space-y-6">
            {/* Language Switcher */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🚩 {t('language_switcher', 'common') || 'Language Switcher'}
              </h2>
              <LanguageSwitcher showLearningMode={true} size="lg" />
            </div>

            {/* Current Status */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📊 {t('current_status', 'common') || 'Current Status'}
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">{t('display_language', 'common')}:</span>
                  <span className="text-indigo-600">{displayLanguage.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{t('learning_language', 'common')}:</span>
                  <span className="text-green-600">
                    {learningLanguage ? learningLanguage.toUpperCase() : t('none', 'common') || 'None'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{t('source_language', 'common')}:</span>
                  <span className="text-gray-600">{sourceLanguage.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                💡 {t('how_to_use', 'common') || 'How to Use'}
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• {t('switch_display_language', 'common') || 'Switch display language using the flags above'}</li>
                <li>• {t('set_learning_language', 'common') || 'Set a learning language to see terms in that language'}</li>
                <li>• {t('hover_over_terms', 'common') || 'Hover over learnable terms to see translations'}</li>
                <li>• {t('rtl_support', 'common') || 'Hebrew automatically enables RTL layout'}</li>
              </ul>
            </div>
          </div>

          {/* Right Column - Content Examples */}
          <div className="space-y-6">
            {/* UI Text Examples */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🎨 {t('ui_text_examples', 'common') || 'UI Text Examples'}
              </h2>
              <div className="space-y-2 text-sm">
                <p><strong>{t('loading', 'common')}:</strong> {t('loading_text', 'common')}</p>
                <p><strong>{t('success', 'common')}:</strong> {t('success', 'common')}</p>
                <p><strong>{t('error', 'common')}:</strong> {t('error', 'common')}</p>
                <p><strong>{t('continue', 'common')}:</strong> {t('continue', 'common')}</p>
                <p><strong>{t('cancel', 'common')}:</strong> {t('cancel', 'common')}</p>
              </div>
            </div>

            {/* Learnable Terms */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📚 {t('learnable_terms', 'common') || 'Learnable Terms'}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {t('learnable_terms_description', 'common') || 
                 'These terms are displayed in the learning language. Hover over them to see translations.'}
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {sampleTerms.map((term) => (
                  <div key={term} className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">{term}</div>
                    <Learnable 
                      termKey={term} 
                      namespace="learn"
                      variant="highlighted"
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Mode Info */}
            {learningLanguage && learningLanguage !== displayLanguage && (
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">
                  🎯 {t('learning_mode_active', 'common') || 'Learning Mode Active'}
                </h3>
                <p className="text-sm text-green-800">
                  {t('learning_mode_description', 'common') || 
                   `You're learning ${learningLanguage.toUpperCase()} while using the interface in ${displayLanguage.toUpperCase()}. 
                   Study terms appear in ${learningLanguage.toUpperCase()} with tooltips showing ${displayLanguage.toUpperCase()} translations.`}
                </p>
              </div>
            )}

            {/* RTL Support Info */}
            {displayLanguage === 'he' && (
              <div className="bg-purple-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">
                  🔄 {t('rtl_support_active', 'common') || 'RTL Support Active'}
                </h3>
                <p className="text-sm text-purple-800">
                  {t('rtl_support_description', 'common') || 
                   'Hebrew language detected. The interface automatically switches to Right-to-Left (RTL) layout.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              🚀 {t('features', 'common') || 'Features'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">🌍 {t('multilingual', 'common') || 'Multilingual'}</h4>
                <p>{t('multilingual_description', 'common') || 'Support for English, Hebrew, French, and Korean'}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">🎯 {t('learning_mode', 'common') || 'Learning Mode'}</h4>
                <p>{t('learning_mode_description_short', 'common') || 'Study terms in one language while using the interface in another'}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">♿ {t('accessibility', 'common') || 'Accessibility'}</h4>
                <p>{t('accessibility_description', 'common') || 'Full RTL support, ARIA labels, and keyboard navigation'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
