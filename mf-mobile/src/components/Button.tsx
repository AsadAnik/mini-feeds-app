import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacityProps
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    isLoading?: boolean;
}

export function Button({
    title,
    variant = 'primary',
    isLoading = false,
    style,
    ...props
}: ButtonProps) {
    const isPrimary = variant === 'primary';
    const isSecondary = variant === 'secondary';
    const isOutline = variant === 'outline';
    const isGhost = variant === 'ghost';

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={[
                styles.button,
                isPrimary && styles.primaryBtn,
                isSecondary && styles.secondaryBtn,
                isOutline && styles.outlineBtn,
                isGhost && styles.ghostBtn,
                props.disabled && styles.disabledBtn,
                style,
            ]}
            {...props}
        >
            {isLoading ? (
                <ActivityIndicator color={isPrimary ? '#fff' : '#4F46E5'} />
            ) : (
                <Text
                    style={[
                        styles.text,
                        isPrimary && styles.primaryText,
                        isSecondary && styles.secondaryText,
                        isOutline && styles.outlineText,
                        isGhost && styles.ghostText,
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    primaryBtn: {
        backgroundColor: '#4F46E5', // Indigo-600
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    secondaryBtn: {
        backgroundColor: '#EEF2FF', // Indigo-50
    },
    outlineBtn: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#4F46E5',
    },
    ghostBtn: {
        backgroundColor: 'transparent',
    },
    disabledBtn: {
        opacity: 0.6,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
    primaryText: {
        color: '#FFFFFF',
    },
    secondaryText: {
        color: '#4F46E5',
    },
    outlineText: {
        color: '#4F46E5',
    },
    ghostText: {
        color: '#6B7280', // Gray-500
    },
});
