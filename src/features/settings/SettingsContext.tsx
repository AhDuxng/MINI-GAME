// Cài đặt của người dùng: bật/tắt âm thanh và giao diện sáng/tối, lưu bền trong localStorage
'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from 'react';
import useLocalStorage from '@/shared/hooks/useLocalStorage';
import { playSound, type SoundName } from './sound';

export type Theme = 'light' | 'dark';

interface SettingsContextValue {
  soundEnabled: boolean;
  toggleSound: () => void;
  play: (sound: SoundName) => void;
  theme: Theme;
  toggleTheme: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useLocalStorage('sound-enabled', true);
  const [theme, setTheme, themeReady] = useLocalStorage<Theme>('theme', 'light');

  useEffect(() => {
    if (themeReady) document.documentElement.dataset.theme = theme;
  }, [theme, themeReady]);

  const toggleSound = useCallback(() => setSoundEnabled((enabled) => !enabled), [setSoundEnabled]);
  const toggleTheme = useCallback(() => setTheme((current) => (current === 'dark' ? 'light' : 'dark')), [setTheme]);
  const play = useCallback(
    (sound: SoundName) => {
      if (soundEnabled) playSound(sound);
    },
    [soundEnabled],
  );

  const value = useMemo(() => ({ soundEnabled, toggleSound, play, theme, toggleTheme }), [soundEnabled, toggleSound, play, theme, toggleTheme]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings phải được dùng bên trong SettingsProvider');
  return context;
}

export function useSound() {
  const { soundEnabled, toggleSound, play } = useSettings();
  return { soundEnabled, toggleSound, play };
}

export function useTheme() {
  const { theme, toggleTheme } = useSettings();
  return { theme, toggleTheme };
}
