import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    SafeAreaView,
    ScrollView
} from 'react-native';
import { Mail, Lock, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { useAuthStore } from '../../../store/useAuthStore';

export function Register() {
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const { login } = useAuthStore();

    const handleRegister = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            login({
                id: '2',
                username: username || 'newuser',
                fullName: fullName || 'New User',
                avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
            });
            setIsLoading(false);
            router.replace('/(tabs)');
        }, 1500);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join MiniFeeds to connect with friends</Text>
                    </View>

                    <View style={styles.form}>
                        <Input
                            label="Full Name"
                            placeholder="John Doe"
                            value={fullName}
                            onChangeText={setFullName}
                            leftIcon={<User size={20} color="#6B7280" />}
                        />
                        <Input
                            label="Username"
                            placeholder="@johndoe"
                            autoCapitalize="none"
                            value={username}
                            onChangeText={setUsername}
                            leftIcon={<User size={20} color="#6B7280" />}
                        />
                        <Input
                            label="Email"
                            placeholder="hello@example.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                            leftIcon={<Mail size={20} color="#6B7280" />}
                        />
                        <Input
                            label="Password"
                            placeholder="Create a password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            leftIcon={<Lock size={20} color="#6B7280" />}
                        />

                        <Button
                            title="Sign Up"
                            onPress={handleRegister}
                            isLoading={isLoading}
                            style={styles.registerBtn}
                        />
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/login')}>
                            <Text style={styles.loginText}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        paddingHorizontal: 24,
        paddingVertical: 40,
        justifyContent: 'center',
        minHeight: '100%',
    },
    header: {
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
    },
    form: {
        marginBottom: 24,
    },
    registerBtn: {
        marginTop: 24,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        paddingBottom: 24,
    },
    footerText: {
        color: '#6B7280',
        fontSize: 15,
    },
    loginText: {
        color: '#4F46E5',
        fontWeight: 'bold',
        fontSize: 15,
    },
});
