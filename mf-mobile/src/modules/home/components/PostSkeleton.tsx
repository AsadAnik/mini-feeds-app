import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors } from '@/constants/Colors';

// region POST SKELETON
export function PostSkeleton() {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [opacity]);

    const { theme } = useThemeStore();
    const colors = Colors[theme];
    const pulseColor = theme === 'dark' ? '#374151' : '#E5E7EB';

    // region Main UI
    return (
        <View style={[styles.card, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
            <View style={styles.header}>
                <Animated.View style={[styles.avatar, { opacity, backgroundColor: pulseColor }]} />
                <View style={styles.authorInfo}>
                    <Animated.View style={[styles.titleLine, { opacity, backgroundColor: pulseColor }]} />
                    <Animated.View style={[styles.metaLine, { opacity, backgroundColor: pulseColor }]} />
                </View>
            </View>
            <View style={styles.content}>
                <Animated.View style={[styles.contentLine, { width: '90%', opacity, backgroundColor: pulseColor }]} />
                <Animated.View style={[styles.contentLine, { width: '100%', opacity, backgroundColor: pulseColor }]} />
                <Animated.View style={[styles.contentLine, { width: '40%', opacity, backgroundColor: pulseColor }]} />
            </View>
            <View style={styles.actionsBox}>
                <Animated.View style={[styles.actionBtn, { opacity, backgroundColor: pulseColor }]} />
                <Animated.View style={[styles.actionBtn, { opacity, backgroundColor: pulseColor }]} />
            </View>
        </View>
    );
}

// region STYLES-SHEET
const styles = StyleSheet.create({
    card: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12,
    },
    authorInfo: {
        flex: 1,
        gap: 6,
    },
    titleLine: {
        height: 12,
        width: '40%',
        borderRadius: 4,
    },
    metaLine: {
        height: 10,
        width: '25%',
        borderRadius: 4,
    },
    content: {
        marginBottom: 16,
        gap: 8,
    },
    contentLine: {
        height: 12,
        borderRadius: 4,
    },
    actionsBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 28,
    },
    actionBtn: {
        height: 20,
        width: 40,
        borderRadius: 4,
    },
});
