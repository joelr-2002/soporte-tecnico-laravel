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
}

interface SettingsActions {
  setLanguage: (language: Language) => void;
  setTheme: (theme: Theme) => void;
  setFontSize: (fontSize: FontSize) => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  resetSettings: () => void;
}

interface SettingsStore extends SettingsState, SettingsActions {}

const defaultSettings: SettingsState = {
  language: 'es',
  theme: 'system',
  fontSize: 'medium',
  highContrast: false,
  reducedMotion: false,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setLanguage: (language) => set({ language }),

      setTheme: (theme) => set({ theme }),

      setFontSize: (fontSize) => set({ fontSize }),

      toggleHighContrast: () => set((state) => ({
        highContrast: !state.highContrast
      })),

      toggleReducedMotion: () => set((state) => ({
        reducedMotion: !state.reducedMotion
      })),

      resetSettings: () => set(defaultSettings),
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
