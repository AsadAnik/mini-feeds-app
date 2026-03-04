import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, SafeAreaView, Platform, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useFeedStore } from '../../store/useFeedStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/Button';
import { X } from 'lucide-react-native';

export function CreatePost() {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();
    const addPost = useFeedStore((state) => state.addPost);
    const user = useAuthStore((state) => state.user);

    const handleSubmit = () => {
        if (!content.trim()) return;

        setIsSubmitting(true);
        setTimeout(() => {
            addPost({
                content,
                author: {
                    id: user?.id || '999',
                    username: user?.username || 'new_user',
                    fullName: user?.fullName || 'New User',
                    avatarUrl: user?.avatarUrl || 'https://i.pravatar.cc/150?u=e042581f4e29026704d'
                }
            });
            setIsSubmitting(false);
            setContent('');
            router.push('/(tabs)');
        }, 1000);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Create Post</Text>
                    <Button
                        title="Publish"
                        onPress={handleSubmit}
                        disabled={!content.trim()}
                        isLoading={isSubmitting}
                        style={styles.publishBtn}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="What's happening?"
                        placeholderTextColor="#9CA3AF"
                        multiline
                        autoFocus
                        maxLength={280}
                        value={content}
                        onChangeText={setContent}
                        textAlignVertical="top"
                    />
                </View>

                <View style={styles.footer}>
                    <Text style={[styles.charCount, content.length > 250 && styles.charCountWarning]}>
                        {content.length}/280
                    </Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: Platform.OS === 'android' ? 30 : 0
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    publishBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    inputContainer: {
        flex: 1,
        padding: 20,
    },
    input: {
        flex: 1,
        fontSize: 18,
        color: '#111827',
        lineHeight: 26,
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    charCount: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    charCountWarning: {
        color: '#EF4444',
    }
});
