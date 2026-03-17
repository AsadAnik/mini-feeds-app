import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { useNotifications } from '../hooks/useNotifications';
import { Colors } from '../constants/Colors';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// region ROOT-LAYOUT
export default function RootLayout() {
  const { checkAuth, isHydrating: isAuthHydrating } = useAuthStore();
  const { loadTheme, isHydrated: isThemeHydrated, theme } = useThemeStore();
  const colors = Colors[theme];
  
  useNotifications();

  useEffect(() => {
    checkAuth();
    loadTheme();
  }, [checkAuth, loadTheme]);

  if (isAuthHydrating || !isThemeHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // region Main UI
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="chat" />
        <Stack.Screen name="friends" />
      </Stack>
    </SafeAreaProvider>
  );
}

