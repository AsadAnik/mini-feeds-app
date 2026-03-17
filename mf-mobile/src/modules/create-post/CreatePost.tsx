import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Platform,
    KeyboardAvoidingView,
    Alert,
    Image,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../components/Button';
import { useCreatePost } from './hooks/useCreatePost';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors } from '@/constants/Colors';

import { AvatarRenderer } from '../profile/components/AvatarRenderer';

// region CREATE POST
export function CreatePost() {
    const {
        content,
        setContent,
        isSubmitting,
        error,
        canSubmit,
        charCount,
        isOverLimit,
        user,
        avatarUri,
        handleSubmit,
        handleCancel,
    } = useCreatePost();

    const { theme } = useThemeStore();
    const colors = Colors[theme];

    React.useEffect(() => {
        if (error) Alert.alert('Post Failed', error);
    }, [error]);

    // region Main UI
    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
                style={[styles.container, { backgroundColor: colors.background }]}
            >
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <TouchableOpacity onPress={handleCancel} style={styles.cancelBtn}>
                        <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>New Post</Text>
                    <Button
                        title="Publish"
                        onPress={handleSubmit}
                        disabled={!canSubmit}
                        isLoading={isSubmitting}
                        style={styles.publishBtn}
                    />
                </View>

                {/* Compose area */}
                <View style={styles.composeRow}>
                    {user?.avatarConfig ? (
                        <View style={{ marginRight: 14, marginTop: 2 }}>
                            <AvatarRenderer config={user.avatarConfig} size={46} />
                        </View>
                    ) : (
                        <Image source={{ uri: avatarUri }} style={[styles.avatar, { borderColor: colors.surface }]} />
                    )}
                    <View style={styles.inputWrapper}>
                        <Text style={[styles.authorName, { color: colors.text }]}>
                            {user?.fullName || user?.username || 'You'}
                        </Text>
                        <TextInput
                            style={[styles.input, { color: colors.text }]}
                            placeholder="What's on your mind?"
                            placeholderTextColor={colors.textSecondary}
                            multiline
                            autoFocus
                            value={content}
                            onChangeText={setContent}
                            textAlignVertical="top"
                            scrollEnabled={false}
                        />
                    </View>
                </View>

                {/* Footer with char count */}
                <View style={[styles.footer, { borderTopColor: colors.border }]}>
                    <Text style={[styles.charCount, isOverLimit ? { color: colors.danger } : { color: colors.textSecondary }]}>
                        {280 - charCount} characters left
                    </Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// region STYLES-SHEET
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    cancelBtn: { paddingVertical: 4, paddingHorizontal: 4, minWidth: 60 },
    cancelText: { fontSize: 16, color: '#6B7280', fontWeight: '500' },
    headerTitle: { fontSize: 17, fontWeight: '700', color: '#111827' },
    publishBtn: { paddingVertical: 8, paddingHorizontal: 18, borderRadius: 20, minWidth: 80 },
    composeRow: { flexDirection: 'row', padding: 20, flex: 1 },
    avatar: { width: 46, height: 46, borderRadius: 23, marginRight: 14, backgroundColor: '#E5E7EB', marginTop: 2 },
    inputWrapper: { flex: 1 },
    authorName: { fontWeight: '700', fontSize: 15, color: '#111827', marginBottom: 6 },
    input: { flex: 1, fontSize: 18, color: '#111827', lineHeight: 26, minHeight: 100 },
    footer: {
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    charCount: { fontSize: 13, color: '#9CA3AF', fontWeight: '500' },
    charCountWarning: { color: '#EF4444', fontWeight: '700' },
});
