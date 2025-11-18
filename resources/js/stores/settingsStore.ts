import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'es' | 'en';
export type Theme = 'light' | 'dark' | 'system';
export type FontSize = 'small' | 'medium' | 'large' | 'xlarge';

interface SettingsState {
  language: Language;
  theme: Theme;
  fontSize: FontSize;
  highContrast: boolean;
  reducedMotion: boolean;
  effectiveTheme: 'light' | 'dark';
}

interface SettingsActions {
  setLanguage: (language: Language) => void;
  setTheme: (theme: Theme) => void;
  setFontSize: (fontSize: FontSize) => void;
  setHighContrast: (value: boolean) => void;
  setReducedMotion: (value: boolean) => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  updateEffectiveTheme: () => void;
  resetSettings: () => void;
}

interface SettingsStore extends SettingsState, SettingsActions {}

// Helper to determine effective theme based on system preference
const getEffectiveTheme = (theme: Theme): 'light' | 'dark' => {
  if (theme === 'system') {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }
  return theme;
};

const defaultSettings: SettingsState = {
  language: 'es',
  theme: 'system',
  fontSize: 'medium',
  highContrast: false,
  reducedMotion: false,
  effectiveTheme: 'light',
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      ...defaultSettings,
      effectiveTheme: getEffectiveTheme(defaultSettings.theme),

      setLanguage: (language) => set({ language }),

      setTheme: (theme) => set({
        theme,
        effectiveTheme: getEffectiveTheme(theme)
      }),

      setFontSize: (fontSize) => set({ fontSize }),

      setHighContrast: (value) => set({ highContrast: value }),

      setReducedMotion: (value) => set({ reducedMotion: value }),

      toggleHighContrast: () => set((state) => ({
        highContrast: !state.highContrast
      })),

      toggleReducedMotion: () => set((state) => ({
        reducedMotion: !state.reducedMotion
      })),

      updateEffectiveTheme: () => set((state) => ({
        effectiveTheme: getEffectiveTheme(state.theme)
      })),

      resetSettings: () => set({
        ...defaultSettings,
        effectiveTheme: getEffectiveTheme(defaultSettings.theme)
      }),
    }),
    {
      name: 'settings-storage',
      partialize: (state) => ({
        language: state.language,
        theme: state.theme,
        fontSize: state.fontSize,
        highContrast: state.highContrast,
        reducedMotion: state.reducedMotion,
      }),
    }
  )
);

export default useSettingsStore;
