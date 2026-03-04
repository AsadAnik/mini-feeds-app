import React from 'react';
import { Tabs } from 'expo-router';
import { Home, PlusSquare, Bell, User } from 'lucide-react-native';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#4F46E5',
            tabBarInactiveTintColor: '#9CA3AF',
            tabBarStyle: {
                borderTopWidth: 1,
                borderTopColor: '#F3F4F6',
                height: 60,
                paddingBottom: 8,
                paddingTop: 8,
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
