import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Pressable,
    Dimensions,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { LucideIcon } from 'lucide-react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors } from '@/constants/Colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ActionOption {
    label: string;
    icon: LucideIcon;
    onPress: () => void;
    variant?: 'default' | 'danger';
}

interface ActionSheetProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    options: ActionOption[];
}

export function ActionSheet({ visible, onClose, title, options }: ActionSheetProps) {
    const { theme } = useThemeStore();
    const colors = Colors[theme];
    
    // Animation values
    const translateY = useSharedValue(SCREEN_HEIGHT);
    const opacity = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            opacity.value = withTiming(1, { duration: 300 });
            translateY.value = withTiming(0, {
                duration: 350,
            });
        } else {
            opacity.value = withTiming(0, { duration: 250 });
            translateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 });
        }
    }, [visible]);

    const animatedBackdropStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const animatedSheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    if (!visible && opacity.value === 0) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <Pressable style={styles.flex} onPress={onClose}>
                    <Animated.View 
                        style={[
                            styles.backdrop, 
                            { backgroundColor: 'rgba(0,0,0,0.6)' },
                            animatedBackdropStyle
                        ]} 
                    />
                </Pressable>

                <Animated.View 
                    style={[
                        styles.sheet, 
                        { backgroundColor: colors.card || (theme === 'dark' ? '#121212' : '#ffffff') },
                        animatedSheetStyle
                    ]}
                >
                    <View style={styles.header}>
                        <View style={styles.dragIndicator} />
                        {title && (
                            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                        )}
                    </View>

                    <View style={styles.optionsContainer}>
                        {options.map((option, index) => {
                            const isDanger = option.variant === 'danger';
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.option}
                                    onPress={option.onPress}
                                    activeOpacity={0.6}
                                >
                                    <View style={[
                                        styles.iconWrapper, 
                                        { backgroundColor: isDanger ? 'rgba(239, 68, 68, 0.1)' : 'rgba(128, 128, 128, 0.1)' }
                                    ]}>
                                        <option.icon 
                                            size={20} 
                                            color={isDanger ? '#EF4444' : colors.text} 
                                        />
                                    </View>
                                    <Text style={[
                                        styles.optionText, 
                                        { color: isDanger ? '#EF4444' : colors.text }
                                    ]}>
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <TouchableOpacity 
                        style={[styles.cancelButton, { borderTopColor: colors.border }]} 
                        onPress={onClose}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    flex: {
        flex: 1,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    sheet: {
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingBottom: 34,
        paddingTop: 8,
        width: '100%',
        maxHeight: SCREEN_HEIGHT * 0.8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 20,
    },
    header: {
        alignItems: 'center',
        paddingBottom: 8,
    },
    dragIndicator: {
        width: 38,
        height: 5,
        borderRadius: 3,
        backgroundColor: 'rgba(128,128,128,0.25)',
        marginTop: 8,
        marginBottom: 12,
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        opacity: 0.6,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    optionsContainer: {
        paddingHorizontal: 16,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 16,
    },
    iconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    optionText: {
        fontSize: 17,
        fontWeight: '600',
    },
    cancelButton: {
        borderTopWidth: 1,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 12,
    },
    cancelText: {
        fontSize: 17,
        fontWeight: '700',
    },
});
