import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Alert,
} from 'react-native';
import { Mail, Lock, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { useRegister } from './hooks/useRegister';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors } from '@/constants/Colors';

// region REGISTER
export function Register() {
    const router = useRouter();
    const { theme } = useThemeStore();
    const colors = Colors[theme];
    const {
        fullName, setFullName,
        username, setUsername,
        email, setEmail,
        password, setPassword,
        isLoading,
        error,
        handleRegister,
    } = useRegister();

    React.useEffect(() => {
        if (error) Alert.alert('Registration Failed', error);
    }, [error]);

    // region Main UI
    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Join MiniFeeds to connect with friends</Text>
                    </View>

                    <View style={styles.form}>
                        <Input
                            label="Full Name"
                            placeholder="John Doe"
                            value={fullName}
                            onChangeText={setFullName}
                            leftIcon={<User size={20} color={colors.textSecondary} />}
                        />
                        <Input
                            label="Username"
                            placeholder="@johndoe"
                            autoCapitalize="none"
                            value={username}
                            onChangeText={setUsername}
                            leftIcon={<User size={20} color={colors.textSecondary} />}
                        />
                        <Input
                            label="Email"
                            placeholder="hello@example.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                            leftIcon={<Mail size={20} color={colors.textSecondary} />}
                        />
                        <Input
                            label="Password"
                            placeholder="Create a password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            leftIcon={<Lock size={20} color={colors.textSecondary} />}
                        />

                        <Button
                            title="Sign Up"
                            onPress={handleRegister}
                            isLoading={isLoading}
                            style={styles.registerBtn}
                        />
                    </View>

                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: colors.textSecondary }]}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/login')}>
                            <Text style={[styles.loginText, { color: colors.primary }]}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// region STYLES-SHEET
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
    container: { paddingHorizontal: 24, paddingVertical: 40, justifyContent: 'center', minHeight: '100%' },
    header: { marginBottom: 40 },
    title: { fontSize: 32, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#6B7280' },
    form: { marginBottom: 24 },
    registerBtn: { marginTop: 24 },
    footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24, paddingBottom: 24 },
    footerText: { color: '#6B7280', fontSize: 15 },
    loginText: { color: '#4F46E5', fontWeight: 'bold', fontSize: 15 },
});
