import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    ScrollView,
    Alert,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Mail, Lock, Sparkles } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
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

    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Show inline alert if error from hook
    useEffect(() => {
        if (error) Alert.alert('Login Failed', error);
    }, [error]);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 4000,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 4000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [fadeAnim]);

    const gradient1 = theme === 'dark'
        ? (['#1F2937', '#312E81', '#581C87'] as const)
        : (['#6366F1', '#A855F7', '#EC4899'] as const);

    const gradient2 = theme === 'dark'
        ? (['#111827', '#064E3B', '#1E3A8A'] as const)
        : (['#10B981', '#3B82F6', '#8B5CF6'] as const);

    // region Main UI
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <View style={StyleSheet.absoluteFill}>
                <LinearGradient colors={gradient1} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
                <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}>
                    <LinearGradient colors={gradient2} style={StyleSheet.absoluteFill} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} />
                </Animated.View>
            </View>

            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.headerContainer}>
                        <View style={styles.iconWrapper}>
                            <Sparkles size={40} color="#FFFFFF" strokeWidth={1.5} />
                        </View>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to continue to MiniFeeds</Text>
                    </View>

                    <View style={[styles.glassCard, theme === 'dark' ? styles.glassCardDark : styles.glassCardLight]}>
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
                                <Text style={[styles.forgotPasswordText, { color: theme === 'dark' ? '#A78BFA' : '#4F46E5' }]}>Forgot Password?</Text>
                            </TouchableOpacity>

                            <Button
                                title="Sign In"
                                onPress={handleLogin}
                                isLoading={isLoading}
                                style={styles.loginBtn}
                            />
                        </View>

                        <View style={styles.footer}>
                            <Text style={[styles.footerText, { color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }]}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => router.push('/register')}>
                                <Text style={[styles.registerText, { color: theme === 'dark' ? '#A78BFA' : '#4F46E5' }]}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

// region STYLES-SHEET
const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { paddingHorizontal: 24, justifyContent: 'center', flexGrow: 1, paddingVertical: 40 },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    iconWrapper: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    title: {
        fontSize: 34,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '500',
    },
    glassCard: {
        borderRadius: 30,
        padding: 24,
        borderWidth: 1,
        overflow: 'hidden',
    },
    glassCardLight: {
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderColor: 'rgba(255, 255, 255, 1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    glassCardDark: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderColor: 'rgba(255, 255, 255, 0.15)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 5,
    },
    form: { marginBottom: 10 },
    forgotPassword: { alignSelf: 'flex-end', marginBottom: 24, marginTop: 4 },
    forgotPasswordText: { fontWeight: '700', fontSize: 14 },
    loginBtn: { marginTop: 8, borderRadius: 16, height: 56 },
    footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24 },
    footerText: { fontSize: 15, fontWeight: '500' },
    registerText: { fontWeight: '800', fontSize: 15 },
});
