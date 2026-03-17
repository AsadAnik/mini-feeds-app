import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Save, User, Camera } from 'lucide-react-native';
import { useProfile } from '../hooks/useProfile';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { AvatarRenderer } from '../components/AvatarRenderer';

export function EditProfile() {
    const { profile, updateProfile, isLoading } = useProfile();
    const [fullName, setFullName] = useState(profile?.fullName || '');
    const { theme } = useThemeStore();
    const colors = Colors[theme];
    const router = useRouter();

    const handleSave = async () => {
        if (!fullName.trim()) {
            Alert.alert('Error', 'Full name cannot be empty');
            return;
        }

        const result = await updateProfile({ fullName });
        if (result.success) {
            Alert.alert('Success', 'Profile updated successfully', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } else {
            Alert.alert('Error', result.message);
        }
    };

    const bgColors = theme === 'dark'
        ? (['#020617', '#0f172a'] as const)
        : (['#f8fafc', '#ffffff'] as const);

    return (
        <View style={{ flex: 1 }}>
            <LinearGradient colors={bgColors} style={StyleSheet.absoluteFill} />
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                            <ChevronLeft size={24} color={colors.text} />
                        </TouchableOpacity>
                        <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Profile</Text>
                        <View style={{ width: 44 }} />
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <View style={styles.avatarSection}>
                            <View style={[styles.avatarWrapper, { borderColor: colors.primary + '30' }]}>
                                {profile?.avatarConfig ? (
                                    <AvatarRenderer config={profile.avatarConfig} size={150} />
                                ) : (
                                    <View style={[styles.placeholderAvatar, { backgroundColor: colors.primary + '10' }]}>
                                        <User size={80} color={colors.primary} />
                                    </View>
                                )}
                                <TouchableOpacity 
                                    style={[styles.cameraBtn, { backgroundColor: colors.primary }]}
                                    onPress={() => router.push('/profile/avatar')}
                                >
                                    <Camera size={20} color="#FFFFFF" />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => router.push('/profile/avatar')}>
                                <Text style={[styles.changeAvatarText, { color: colors.primary }]}>Change Avatar</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>FULL NAME</Text>
                                <View style={[
                                    styles.inputWrapper, 
                                    { 
                                        backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', 
                                        borderColor: colors.border 
                                    }
                                ]}>
                                    <User size={20} color={colors.textSecondary} style={styles.inputIcon} />
                                    <TextInput
                                        style={[styles.input, { color: colors.text }]}
                                        value={fullName}
                                        onChangeText={setFullName}
                                        placeholder="Enter your full name"
                                        placeholderTextColor={colors.textSecondary}
                                    />
                                </View>
                            </View>

                            <View style={styles.footer}>
                                <TouchableOpacity
                                    style={[styles.saveBtn, { backgroundColor: colors.primary }]}
                                    onPress={handleSave}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="#FFF" />
                                    ) : (
                                        <>
                                            <Save size={20} color="#FFF" style={{ marginRight: 8 }} />
                                            <Text style={styles.saveBtnText}>Save Changes</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                                <Text style={[styles.hint, { color: colors.textSecondary }]}>
                                    Your full name and avatar are visible to everyone.
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerTitle: { fontSize: 20, fontWeight: '900', letterSpacing: -0.5 },
    backBtn: { width: 44, height: 44, justifyContent: 'center' },
    scrollContent: { paddingBottom: 40 },
    avatarSection: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 40,
    },
    avatarWrapper: {
        position: 'relative',
        borderRadius: 80,
        padding: 5,
        borderWidth: 2,
        borderStyle: 'dashed',
    },
    placeholderAvatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraBtn: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#FFFFFF',
    },
    changeAvatarText: { marginTop: 15, fontSize: 16, fontWeight: '800' },
    form: { paddingHorizontal: 24 },
    inputGroup: { marginBottom: 30 },
    label: { fontSize: 12, fontWeight: '800', marginBottom: 10, letterSpacing: 1.5 },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        borderWidth: 1,
        paddingHorizontal: 18,
    },
    inputIcon: { marginRight: 15 },
    input: { flex: 1, height: 60, fontSize: 16, fontWeight: '700' },
    footer: { marginTop: 10 },
    saveBtn: {
        height: 64,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    saveBtnText: { color: '#FFF', fontSize: 18, fontWeight: '900' },
    hint: { marginTop: 20, textAlign: 'center', fontSize: 13, fontWeight: '500', opacity: 0.7 },
});
