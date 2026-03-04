import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import { Mail, Settings, LogOut } from 'lucide-react-native';

export function Profile() {
    const { user, logout } = useAuthStore();
    const router = useRouter();

    const userName = user?.fullName || 'John Doe';
    const userHandle = user?.username || 'johndoe';
    const avatarUrl = user?.avatarUrl || 'https://i.pravatar.cc/150?u=a042581f4e29026704d';

    const handleLogout = () => {
        logout();
        router.replace('/(auth)/login');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profile</Text>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Settings size={24} color="#111827" />
                    </TouchableOpacity>
                </View>

                <View style={styles.profileSection}>
                    <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                    <Text style={styles.name}>{userName}</Text>
                    <Text style={styles.username}>@{userHandle}</Text>
                    <View style={styles.stats}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>142</Text>
                            <Text style={styles.statLabel}>Posts</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>12.4k</Text>
                            <Text style={styles.statLabel}>Followers</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>1,042</Text>
                            <Text style={styles.statLabel}>Following</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.menu}>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemIcon}>
                            <Mail size={20} color="#4F46E5" />
                        </View>
                        <Text style={styles.menuItemText}>Email Support</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.menuItem, styles.logoutMenuBtn]} onPress={handleLogout}>
                        <View style={[styles.menuItemIcon, { backgroundColor: '#FEE2E2' }]}>
                            <LogOut size={20} color="#EF4444" />
                        </View>
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        paddingTop: Platform.OS === 'android' ? 30 : 0
    },
    container: {
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
    },
    iconBtn: {
        padding: 8,
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
    },
    profileSection: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 30,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
        borderWidth: 3,
        borderColor: '#4F46E5',
        padding: 2,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    username: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: 4,
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 30,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    statLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    divider: {
        width: 1,
        backgroundColor: '#E5E7EB',
        height: 30,
    },
    menu: {
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    menuItemIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    menuItemText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    logoutMenuBtn: {
        marginTop: 20,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#EF4444',
    }
});
