'use client';

import React, { useState } from 'react';
import { useI18n } from '../hooks/useI18n';

interface LearnableProps {
  termKey: string;
  namespace?: string;
  showTooltip?: boolean;
  className?: string;
  variant?: 'default' | 'highlighted' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
}

export const Learnable: React.FC<LearnableProps> = ({
  termKey,
  namespace = 'learn',
  showTooltip = true,
  className = '',
  variant = 'default',
  size = 'md'
}) => {
  const { t, tLearn, displayLanguage, learningLanguage, sourceLanguage } = useI18n();
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const variantClasses = {
    default: 'text-gray-900 font-medium',
    highlighted: 'text-indigo-600 font-semibold bg-indigo-50 px-2 py-1 rounded',
    subtle: 'text-gray-600 font-normal'
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  // Get the term in learning language
  const learningTerm = tLearn(termKey, namespace);
  
  // Get the term in display language for tooltip
  const displayTerm = t(termKey, namespace);
  
  // Get the term in source language as final fallback
  const sourceTerm = termKey; // This would come from source language translations

  // Determine if we should show tooltip
  const shouldShowTooltip = showTooltip && 
    learningLanguage && 
    learningLanguage !== displayLanguage && 
    learningTerm !== displayTerm;

  // Get tooltip content
  const getTooltipContent = () => {
    if (learningLanguage === displayLanguage) {
      return null; // No tooltip needed
    }

    if (learningLanguage && learningTerm !== displayTerm) {
      return `${displayTerm} (${t('in', 'common')} ${t('display_language', 'common')})`;
    }

    return `${sourceTerm} (${t('in', 'common')} ${t('source_language', 'common')})`;
  };

  const tooltipContent = getTooltipContent();

  return (
    <span
      className={`inline-block ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onMouseEnter={() => shouldShowTooltip && setIsTooltipVisible(true)}
      onMouseLeave={() => shouldShowTooltip && setIsTooltipVisible(false)}
      onFocus={() => shouldShowTooltip && setIsTooltipVisible(true)}
      onBlur={() => shouldShowTooltip && setIsTooltipVisible(false)}
      tabIndex={shouldShowTooltip ? 0 : -1}
      role={shouldShowTooltip ? 'button' : undefined}
      aria-label={shouldShowTooltip ? `${learningTerm} - ${tooltipContent}` : learningTerm}
    >
      {learningTerm}
      
      {/* Tooltip */}
      {shouldShowTooltip && isTooltipVisible && tooltipContent && (
        <div className="absolute z-50 px-2 py-1 mt-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap pointer-events-none">
          {tooltipContent}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
        </div>
      )}
    </span>
  );
};

// Higher-order component for wrapping existing elements
export const withLearnable = <P extends object>(
  Component: React.ComponentType<P>,
  termKey: string,
  namespace?: string
) => {
  return React.forwardRef<any, P>((props, ref) => (
    <Component
      {...props}
      ref={ref}
      children={
        <Learnable termKey={termKey} namespace={namespace}>
          {props.children}
        </Learnable>
      }
    />
  ));
};

// Hook for getting learnable terms programmatically
export const useLearnable = () => {
  const { tLearn } = useI18n();
  
  return {
    getTerm: (termKey: string, namespace?: string) => tLearn(termKey, namespace),
    getMultipleTerms: (termKeys: string[], namespace?: string) => 
      termKeys.reduce((acc, key) => ({ ...acc, [key]: tLearn(key, namespace) }), {})
  };
};
