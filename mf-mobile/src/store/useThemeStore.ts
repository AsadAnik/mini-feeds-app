import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
    theme: ThemeMode;
    isHydrated: boolean;
    setTheme: (theme: ThemeMode) => Promise<void>;
    toggleTheme: () => Promise<void>;
    loadTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
    theme: 'light',
    isHydrated: false,

    setTheme: async (theme: ThemeMode) => {
        try {
            await AsyncStorage.setItem('@theme_mode', theme);
            set({ theme });
        } catch (error) {
            console.error('Error saving theme:', error);
        }
    },

    toggleTheme: async () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        await get().setTheme(newTheme);
    },

    loadTheme: async () => {
        try {
            const storedTheme = await AsyncStorage.getItem('@theme_mode');
            if (storedTheme === 'light' || storedTheme === 'dark') {
                set({ theme: storedTheme, isHydrated: true });
            } else {
                set({ isHydrated: true });
            }
        } catch (error) {
            console.error('Error loading theme:', error);
            set({ isHydrated: true });
        }
    },
}));
