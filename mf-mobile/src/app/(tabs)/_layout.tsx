import React from 'react';
import { Tabs } from 'expo-router';
import { Home, PlusSquare, Bell, User } from 'lucide-react-native';
import { Platform, StyleSheet } from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors } from '@/constants/Colors';

// region TAB-LAYOUT
export default function TabLayout() {
    const { theme } = useThemeStore();
    const colors = Colors[theme];

    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textSecondary,
            tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: '500',
            },
            tabBarStyle: {
                borderTopWidth: 1,
                borderTopColor: colors.border,
                height: Platform.OS === 'ios' ? 88 : 70,
                paddingBottom: Platform.OS === 'ios' ? 28 : 12,
                paddingTop: 12,
                backgroundColor: colors.tabBarBackground,
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: theme === 'dark' ? 0.2 : 0.05,
                shadowRadius: 10,
                elevation: 10,
            }
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Home color={color} size={24} />
                }}
            />
            <Tabs.Screen
                name="create"
                options={{
                    title: 'Create',
                    tabBarIcon: ({ color }) => <PlusSquare color={color} size={24} />
                }}
            />
            <Tabs.Screen
                name="notification"
                options={{
                    title: 'Activity',
                    tabBarIcon: ({ color }) => <Bell color={color} size={24} />
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <User color={color} size={24} />
                }}
            />
        </Tabs>
    );
}
