import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSettingsStore, type Theme, type FontSize } from '../stores/settingsStore';
import { t, useTranslation } from '../i18n';

/**
 * Get the resolved theme based on system preference
 * @param theme - The theme setting ('light', 'dark', or 'system')
 * @returns The resolved theme ('light' or 'dark')
 */
function getResolvedTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return 'light';
  }
  return theme;
}

/**
 * Get the CSS class for font size scaling
 * @param fontSize - The font size setting
 * @returns The corresponding CSS class
 */
function getFontSizeClass(fontSize: FontSize): string {
  const fontSizeClasses: Record<FontSize, string> = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl',
  };
  return fontSizeClasses[fontSize];
}

/**
 * Get the root font size multiplier for scaling
 * @param fontSize - The font size setting
 * @returns The multiplier value
 */
function getFontSizeMultiplier(fontSize: FontSize): number {
  const multipliers: Record<FontSize, number> = {
    small: 0.875,
    medium: 1,
    large: 1.125,
    xlarge: 1.25,
  };
  return multipliers[fontSize];
}

/**
 * Custom hook that combines settings store with computed values and translations
 * Provides reactive settings with theme resolution, font scaling, and i18n support
 */
export function useSettings() {
  const {
    language,
    theme,
    fontSize,
    highContrast,
    reducedMotion,
    setLanguage,
    setTheme,
    setFontSize,
    toggleHighContrast,
    toggleReducedMotion,
    resetSettings,
  } = useSettingsStore();

  const { t: translate } = useTranslation();

  // Track the resolved theme (handling system preference)
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(() =>
    getResolvedTheme(theme)
  );

  // Listen for system theme changes when theme is set to 'system'
  useEffect(() => {
    const updateTheme = () => {
      setCurrentTheme(getResolvedTheme(theme));
    };

    // Initial update
    updateTheme();

    // Listen for system preference changes
    if (theme === 'system' && typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = () => {
        updateTheme();
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [theme]);

  // Apply theme to document
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(currentTheme);

      // Update meta theme-color for mobile browsers
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute(
          'content',
          currentTheme === 'dark' ? '#1f2937' : '#ffffff'
        );
      }
    }
  }, [currentTheme]);

  // Apply font size to document
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      const multiplier = getFontSizeMultiplier(fontSize);
      root.style.fontSize = `${multiplier * 16}px`;
    }
  }, [fontSize]);

  // Apply high contrast mode
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (highContrast) {
        root.classList.add('high-contrast');
      } else {
        root.classList.remove('high-contrast');
      }
    }
  }, [highContrast]);

  // Apply reduced motion preference
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (reducedMotion) {
        root.classList.add('reduce-motion');
        root.style.setProperty('--transition-duration', '0ms');
      } else {
        root.classList.remove('reduce-motion');
        root.style.removeProperty('--transition-duration');
      }
    }
  }, [reducedMotion]);

  // Computed values
  const fontSizeClass = useMemo(() => getFontSizeClass(fontSize), [fontSize]);
  const fontSizeMultiplier = useMemo(() => getFontSizeMultiplier(fontSize), [fontSize]);

  // Check if system prefers dark mode
  const systemPrefersDark = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  }, []);

  // Check if system prefers reduced motion
  const systemPrefersReducedMotion = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  }, []);

  // Convenience translation function with current language
  const tFunc = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      return t(key, language, params);
    },
    [language]
  );

  // Get accessibility classes
  const accessibilityClasses = useMemo(() => {
    const classes: string[] = [];
    if (highContrast) classes.push('high-contrast');
    if (reducedMotion) classes.push('reduce-motion');
    return classes.join(' ');
  }, [highContrast, reducedMotion]);

  // Check if current settings match defaults
  const isDefaultSettings = useMemo(() => {
    return (
      language === 'es' &&
      theme === 'system' &&
      fontSize === 'medium' &&
      !highContrast &&
      !reducedMotion
    );
  }, [language, theme, fontSize, highContrast, reducedMotion]);

  return {
    // State
    language,
    theme,
    fontSize,
    highContrast,
    reducedMotion,

    // Computed values
    currentTheme,
    fontSizeClass,
    fontSizeMultiplier,
    accessibilityClasses,
    systemPrefersDark,
    systemPrefersReducedMotion,
    isDefaultSettings,

    // Actions
    setLanguage,
    setTheme,
    setFontSize,
    toggleHighContrast,
    toggleReducedMotion,
    resetSettings,

    // Translation function
    t: tFunc,
    translate,
  };
}

export default useSettings;
