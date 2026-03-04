import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    SafeAreaView,
    Alert,
} from 'react-native';
import { Mail, Lock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useLogin } from './hooks/useLogin';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors } from '@/constants/Colors';

// region LOGIN
export function Login() {
    const router = useRouter();
    const { theme } = useThemeStore();
    const colors = Colors[theme];
    const {
        email, setEmail,
        password, setPassword,
        isLoading,
        error,
        handleLogin,
    } = useLogin();

    // Show inline alert if error from hook
    React.useEffect(() => {
        if (error) Alert.alert('Login Failed', error);
    }, [error]);

    // region Main UI
    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={[styles.container, { backgroundColor: colors.background }]}
            >
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Sign in to continue to MiniFeeds</Text>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Email"
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                        leftIcon={<Mail size={20} color={colors.textSecondary} />}
                    />
                    <Input
                        label="Password"
                        placeholder="Enter your password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        leftIcon={<Lock size={20} color={colors.textSecondary} />}
                    />

                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <Button
                        title="Sign In"
                        onPress={handleLogin}
                        isLoading={isLoading}
                        style={styles.loginBtn}
                    />
                </View>

                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: colors.textSecondary }]}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/register')}>
                        <Text style={[styles.registerText, { color: colors.primary }]}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// region STYLES-SHEET
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
    container: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
    header: { marginBottom: 40 },
    title: { fontSize: 32, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#6B7280' },
    form: { marginBottom: 24 },
    forgotPassword: { alignSelf: 'flex-end', marginBottom: 24 },
    forgotPasswordText: { color: '#4F46E5', fontWeight: '600', fontSize: 14 },
    loginBtn: { marginTop: 8 },
    footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24 },
    footerText: { color: '#6B7280', fontSize: 15 },
    registerText: { color: '#4F46E5', fontWeight: 'bold', fontSize: 15 },
});
