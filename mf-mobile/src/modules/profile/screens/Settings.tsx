import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Lock, Save, Eye, EyeOff } from 'lucide-react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { api } from '@/services/api';

export function Settings() {
    const { theme } = useThemeStore();
    const colors = Colors[theme];
    const router = useRouter();

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleUpdatePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all password fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long');
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.put('/users/change-password', {
                oldPassword,
                newPassword,
            });

            if (response.data.success) {
                Alert.alert('Success', 'Password updated successfully', [
                    { text: 'OK', onPress: () => router.back() }
                ]);
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (error: any) {
            console.error('Update password error:', error);
            const message = error.response?.data?.message || 'Failed to update password';
            Alert.alert('Error', message);
        } finally {
            setIsLoading(false);
        }
    };

    const bgColors = theme === 'dark'
        ? (['#020617', '#0f172a'] as const)
        : (['#f8fafc', '#ffffff'] as const);

    return (
        <View style={{ flex: 1 }}>
            <LinearGradient colors={bgColors} style={StyleSheet.absoluteFill} />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={[styles.backBtn, { backgroundColor: colors.surface }]} 
                        onPress={() => router.back()}
                    >
                        <ChevronLeft size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
                    <View style={{ width: 44 }} />
                </View>

                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Lock size={20} color={colors.primary} />
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>Update Password</Text>
                            </View>
                            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                                Choose a strong password to keep your account secure
                            </Text>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>Current Password</Text>
                                <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                    <TextInput
                                        style={[styles.input, { color: colors.text }]}
                                        placeholder="Enter current password"
                                        placeholderTextColor={colors.textSecondary + '80'}
                                        secureTextEntry={!showOldPassword}
                                        value={oldPassword}
                                        onChangeText={setOldPassword}
                                    />
                                    <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)} style={styles.eyeIcon}>
                                        {showOldPassword ? <EyeOff size={20} color={colors.textSecondary} /> : <Eye size={20} color={colors.textSecondary} />}
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>New Password</Text>
                                <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                    <TextInput
                                        style={[styles.input, { color: colors.text }]}
                                        placeholder="Enter new password"
                                        placeholderTextColor={colors.textSecondary + '80'}
                                        secureTextEntry={!showNewPassword}
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                    />
                                    <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeIcon}>
                                        {showNewPassword ? <EyeOff size={20} color={colors.textSecondary} /> : <Eye size={20} color={colors.textSecondary} />}
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>Confirm New Password</Text>
                                <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                    <TextInput
                                        style={[styles.input, { color: colors.text }]}
                                        placeholder="Confirm new password"
                                        placeholderTextColor={colors.textSecondary + '80'}
                                        secureTextEntry={!showConfirmPassword}
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                    />
                                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                                        {showConfirmPassword ? <EyeOff size={20} color={colors.textSecondary} /> : <Eye size={20} color={colors.textSecondary} />}
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity 
                                style={[styles.updateBtn, { backgroundColor: colors.primary }]}
                                onPress={handleUpdatePassword}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#FFF" />
                                ) : (
                                    <>
                                        <Save size={20} color="#FFF" style={{ marginRight: 8 }} />
                                        <Text style={styles.updateBtnText}>Update Password</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
    },
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 30,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginLeft: 10,
    },
    sectionSubtitle: {
        fontSize: 14,
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 56,
        borderRadius: 16,
        borderWidth: 1,
        paddingHorizontal: 16,
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    eyeIcon: {
        padding: 4,
    },
    updateBtn: {
        height: 56,
        borderRadius: 18,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
    },
    updateBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
