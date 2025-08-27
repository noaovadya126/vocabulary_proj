'use client';

import React, { ReactNode, createContext, useContext } from 'react';
import { I18nContextType, useI18n } from '../hooks/useI18n';

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const i18nValue = useI18n();

  return (
    <I18nContext.Provider value={i18nValue}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18nContext = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18nContext must be used within an I18nProvider');
  }
  return context;
};

// Hook for components that need direct access to i18n context
export const useI18nDirect = () => {
  return useContext(I18nContext);
};
