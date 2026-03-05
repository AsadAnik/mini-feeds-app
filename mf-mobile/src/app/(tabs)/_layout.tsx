import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import { Home, PlusSquare, Bell, User } from 'lucide-react-native';
import { Platform, StyleSheet, View } from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors } from '@/constants/Colors';
import { useAuthStore } from '@/store/useAuthStore';

// region TAB-LAYOUT
export default function TabLayout() {
    const { theme } = useThemeStore();
    const colors = Colors[theme];
    const { isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
        return <Redirect href="/(auth)/login" />;
    }

    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textSecondary,
            tabBarShowLabel: true,
            tabBarLabelStyle: {
                fontSize: 11,
                fontWeight: '700',
                marginBottom: Platform.OS === 'ios' ? 0 : 4,
            },
            tabBarStyle: {
                position: 'absolute',
                bottom: Platform.OS === 'ios' ? 24 : 16,
                left: 20,
                right: 20,
                borderRadius: 25,
                height: 70,
                backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                borderTopWidth: 0,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
                elevation: 5,
                paddingBottom: Platform.OS === 'ios' ? 0 : 10,
                paddingTop: 10,
                borderWidth: 1,
                marginLeft: 20,
                marginRight: 20,
                borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.03)',
            },
            tabBarItemStyle: {
                height: 60,
            }
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={focused ? styles.activeIconBg : null}>
                            <Home color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
                        </View>
                    )
                }}
            />
            <Tabs.Screen
                name="create"
                options={{
                    title: 'Share',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={focused ? styles.activeIconBg : null}>
                            <PlusSquare color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
                        </View>
                    )
                }}
            />
            <Tabs.Screen
                name="notification"
                options={{
                    title: 'Activity',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={focused ? styles.activeIconBg : null}>
                            <Bell color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
                        </View>
                    )
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Me',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={focused ? styles.activeIconBg : null}>
                            <User color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
                        </View>
                    )
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    activeIconBg: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 2,
    }
});
