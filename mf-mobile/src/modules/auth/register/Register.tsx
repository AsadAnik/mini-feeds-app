import React, { useRef, useEffect } from 'react';
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
    Animated,
} from 'react-native';
import { Mail, Lock, User, Users } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
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

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (error) Alert.alert('Registration Failed', error);
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
                            <Users size={40} color="#FFFFFF" strokeWidth={1.5} />
                        </View>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join MiniFeeds to connect with friends</Text>
                    </View>

                    <View style={[styles.glassCard, theme === 'dark' ? styles.glassCardDark : styles.glassCardLight]}>
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
                            <Text style={[styles.footerText, { color: theme === 'dark' ? '#D1D5DB' : '#4B5563' }]}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => router.push('/login')}>
                                <Text style={[styles.loginText, { color: theme === 'dark' ? '#A78BFA' : '#4F46E5' }]}>Sign In</Text>
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
    container: { paddingHorizontal: 24, paddingVertical: 40, justifyContent: 'center', flexGrow: 1 },
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
    registerBtn: { marginTop: 24, borderRadius: 16, height: 56 },
    footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24, paddingBottom: 24 },
    footerText: { fontSize: 15, fontWeight: '500' },
    loginText: { fontWeight: '800', fontSize: 15 },
});
