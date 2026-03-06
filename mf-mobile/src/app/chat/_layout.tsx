import { Stack } from 'expo-router';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors } from '@/constants/Colors';
import { StatusBar } from 'react-native';

export default function ChatLayout() {
    const { theme } = useThemeStore();
    const colors = Colors[theme];

    return (
        <>
            <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="[id]" />
            </Stack>
        </>
    );
}
