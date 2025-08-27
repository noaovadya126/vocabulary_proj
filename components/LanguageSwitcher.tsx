'use client';

import React, { useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import { Language } from '../i18n.config';

interface LanguageSwitcherProps {
  showLearningMode?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  showLearningMode = true,
  className = '',
  size = 'md'
}) => {
  const {
    displayLanguage,
    learningLanguage,
    setDisplayLanguage,
    setLearningLanguage,
    supportedLanguages,
    t
  } = useI18n();

  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'display' | 'learning'>('display');

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  const handleLanguageClick = async (languageCode: string, type: 'display' | 'learning') => {
    if (type === 'display') {
      await setDisplayLanguage(languageCode);
    } else {
      setLearningLanguage(languageCode);
    }
  };

  const isLanguageDisabled = (languageCode: string, type: 'display' | 'learning'): boolean => {
    if (type === 'learning') {
      // Learning language can't be the same as display language
      return languageCode === displayLanguage;
    }
    return false;
  };

  const getTooltipText = (language: Language, type: 'display' | 'learning'): string => {
    if (type === 'learning' && isLanguageDisabled(language.code, type)) {
      return t('learning_language_disabled', 'common');
    }
    
    if (type === 'display') {
      return `${t('switch_to', 'common')} ${language.nativeName}`;
    } else {
      return `${t('set_learning_language', 'common')} ${language.nativeName}`;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-3 ${className}`}>
      {/* Tab Navigation */}
      {showLearningMode && (
        <div className="flex mb-3 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('display')}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === 'display'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('display_language', 'common')}
          </button>
          <button
            onClick={() => setActiveTab('learning')}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === 'learning'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('learning_language', 'common')}
          </button>
        </div>
      )}

      {/* Language Flags Grid */}
      <div className="grid grid-cols-2 gap-2">
        {supportedLanguages.map((language) => {
          const isDisabled = isLanguageDisabled(language.code, activeTab);
          const isActive = activeTab === 'display' 
            ? language.code === displayLanguage
            : language.code === learningLanguage;

          return (
            <div key={language.code} className="relative">
              <button
                onClick={() => handleLanguageClick(language.code, activeTab)}
                disabled={isDisabled}
                onMouseEnter={() => setShowTooltip(language.code)}
                onMouseLeave={() => setShowTooltip(null)}
                onFocus={() => setShowTooltip(language.code)}
                onBlur={() => setShowTooltip(null)}
                className={`
                  ${sizeClasses[size]}
                  rounded-lg border-2 transition-all duration-200 flex items-center justify-center
                  ${isActive 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                    : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                  }
                  ${isDisabled 
                    ? 'opacity-50 cursor-not-allowed border-gray-300 bg-gray-100' 
                    : 'hover:scale-105 cursor-pointer'
                  }
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                `}
                aria-label={getTooltipText(language, activeTab)}
                aria-pressed={isActive}
                title={getTooltipText(language, activeTab)}
              >
                <span className="text-2xl">{language.flag}</span>
              </button>

              {/* Language Name */}
              <div className="mt-1 text-center">
                <p className={`text-xs font-medium ${
                  isActive ? 'text-indigo-600' : 'text-gray-600'
                }`}>
                  {language.nativeName}
                </p>
              </div>

              {/* Active Indicator */}
              {isActive && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white"></div>
              )}

              {/* Tooltip */}
              {showTooltip === language.code && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
                  {getTooltipText(language, activeTab)}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Current Selection Info */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-600">
          <div className="flex justify-between">
            <span>{t('current_language', 'common')}:</span>
            <span className="font-medium">
              {supportedLanguages.find(l => l.code === displayLanguage)?.nativeName}
            </span>
          </div>
          {showLearningMode && learningLanguage && (
            <div className="flex justify-between mt-1">
              <span>{t('learning_language', 'common')}:</span>
              <span className="font-medium">
                {supportedLanguages.find(l => l.code === learningLanguage)?.nativeName}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
