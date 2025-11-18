import { es } from './es';
import { en } from './en';
import { useSettingsStore, type Language } from '../stores/settingsStore';

export const translations = {
  es,
  en,
} as const;

export type TranslationKey = string;
export type Translations = typeof translations;

/**
 * Get a nested value from an object using dot notation
 * @param obj - The object to traverse
 * @param path - The dot-notation path (e.g., 'common.save')
 * @returns The value at the path or undefined
 */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((current: unknown, key: string) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

/**
 * Translate a key to the specified language
 * @param key - The translation key in dot notation (e.g., 'common.save')
 * @param lang - The language code ('es' or 'en')
 * @param params - Optional parameters for interpolation
 * @returns The translated string or the key if not found
 */
export function t(
  key: string,
  lang: Language = 'es',
  params?: Record<string, string | number>
): string {
  const translation = translations[lang];

  if (!translation) {
    console.warn(`Translation not found for language: ${lang}`);
    return key;
  }

  const value = getNestedValue(translation as unknown as Record<string, unknown>, key);

  if (typeof value !== 'string') {
    console.warn(`Translation not found for key: ${key} in language: ${lang}`);
    return key;
  }

  // Handle parameter interpolation (e.g., {min}, {max})
  if (params) {
    return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return params[paramKey]?.toString() ?? match;
    });
  }

  return value;
}

/**
 * Custom hook for using translations with the current language from settings
 * @returns Object with translation function and current language
 */
export function useTranslation() {
  const language = useSettingsStore((state) => state.language);

  const translate = (key: string, params?: Record<string, string | number>): string => {
    return t(key, language, params);
  };

  return {
    t: translate,
    language,
    setLanguage: useSettingsStore.getState().setLanguage,
  };
}

/**
 * Get all available languages
 * @returns Array of available language codes
 */
export function getAvailableLanguages(): Language[] {
  return Object.keys(translations) as Language[];
}

/**
 * Get the display name for a language
 * @param lang - The language code
 * @returns The display name of the language
 */
export function getLanguageDisplayName(lang: Language): string {
  const names: Record<Language, string> = {
    es: 'Espanol',
    en: 'English',
  };
  return names[lang] || lang;
}

/**
 * Check if a language is supported
 * @param lang - The language code to check
 * @returns True if the language is supported
 */
export function isLanguageSupported(lang: string): lang is Language {
  return lang in translations;
}

export { es, en };
export type { Language };
