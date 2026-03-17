import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Animated,
    useWindowDimensions,
    StatusBar,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRouter } from 'expo-router';
import { Globe, MessageSquare, Users, Moon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors } from '@/constants/Colors';
import { Button } from '@/components/Button';

const slides = [
    {
        id: '1',
        title: 'Welcome to MiniFeeds',
        description: 'Your premium space for sharing thoughts and discovering content from people worldwide.',
        icon: Globe,
        colors: {
            light: ['#6366F1', '#A855F7', '#EC4899'],
            dark: ['#312E81', '#581C87', '#701A75']
        }
    },
    {
        id: '2',
        title: 'Share Your Voice',
        description: 'Express yourself freely without limits. Create text posts, react, and comment instantly.',
        icon: MessageSquare,
        colors: {
            light: ['#F97316', '#EF4444', '#EC4899'],
            dark: ['#7C2D12', '#7F1D1D', '#701A75']
        }
    },
    {
        id: '3',
        title: 'Connect with Friends',
        description: 'Build your following and engage in meaningful conversations with a vibrant community.',
        icon: Users,
        colors: {
            light: ['#10B981', '#3B82F6', '#6366F1'],
            dark: ['#064E3B', '#1E3A8A', '#312E81']
        }
    },
    {
        id: '4',
        title: 'Beautiful Dark Mode',
        description: 'A premium, eye-catching experience customized beautifully for both day and night.',
        icon: Moon,
        colors: {
            light: ['#1F2937', '#111827', '#000000'],
            dark: ['#111827', '#030712', '#000000']
        }
    },
];

export function Onboarding() {
    const { width, height } = useWindowDimensions();
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const router = useRouter();

    const { completeOnboarding } = useAuthStore();
    const { theme } = useThemeStore();
    const colors = Colors[theme];

    const viewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems && viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const scrollToNext = async () => {
        if (currentIndex < slides.length - 1) {
            slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            await completeOnboarding();
            router.replace('/');
        }
    };

    const handleSkip = async () => {
        await completeOnboarding();
        router.replace('/');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Dynamic Background Gradients */}
            {slides.map((slide, index) => {
                const opacity = scrollX.interpolate({
                    inputRange: [(index - 1) * width, index * width, (index + 1) * width],
                    outputRange: [0, 1, 0],
                    extrapolate: 'clamp'
                });

                return (
                    <Animated.View
                        key={`bg-${slide.id}`}
                        style={[StyleSheet.absoluteFill, { opacity }]}
                    >
                        <LinearGradient
                            colors={slide.colors[theme] as any}
                            style={StyleSheet.absoluteFill}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        />
                    </Animated.View>
                );
            })}

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.skipContainer}>
                    {currentIndex < slides.length - 1 && (
                        <TouchableOpacity onPress={handleSkip} activeOpacity={0.7}>
                            <Text style={styles.skipText}>Skip</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={{ flex: 3 }}>
                    <FlatList
                        data={slides}
                        renderItem={({ item, index }) => {
                            const Icon = item.icon;

                            // Animate content as we scroll
                            const contentOpacity = scrollX.interpolate({
                                inputRange: [(index - 0.5) * width, index * width, (index + 0.5) * width],
                                outputRange: [0, 1, 0],
                                extrapolate: 'clamp'
                            });

                            const scale = scrollX.interpolate({
                                inputRange: [(index - 0.5) * width, index * width, (index + 0.5) * width],
                                outputRange: [0.8, 1, 0.8],
                                extrapolate: 'clamp'
                            });

                            return (
                                <View style={[styles.slide, { width }]}>
                                    <Animated.View style={{ opacity: contentOpacity, transform: [{ scale }], alignItems: 'center' }}>
                                        <View style={styles.glassIconContainer}>
                                            <View style={styles.iconInner}>
                                                <Icon size={80} color="#FFFFFF" strokeWidth={1.5} />
                                            </View>
                                        </View>
                                        <Text style={styles.title}>{item.title}</Text>
                                        <Text style={styles.description}>{item.description}</Text>
                                    </Animated.View>
                                </View>
                            );
                        }}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled
                        bounces={false}
                        keyExtractor={(item) => item.id}
                        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                            useNativeDriver: false,
                        })}
                        scrollEventThrottle={16}
                        onViewableItemsChanged={viewableItemsChanged}
                        viewabilityConfig={viewConfig}
                        ref={slidesRef}
                    />
                </View>

                {/* Pagination & Next Button */}
                <View style={[styles.footer, { paddingBottom: height * 0.05 }]}>
                    {/* Dots */}
                    <View style={styles.paginator}>
                        {slides.map((_, i) => {
                            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

                            const dotWidth = scrollX.interpolate({
                                inputRange,
                                outputRange: [8, 20, 8],
                                extrapolate: 'clamp',
                            });

                            const opacity = scrollX.interpolate({
                                inputRange,
                                outputRange: [0.5, 1, 0.5],
                                extrapolate: 'clamp',
                            });

                            return (
                                <Animated.View
                                    key={i.toString()}
                                    style={[
                                        styles.dot,
                                        { width: dotWidth, opacity, backgroundColor: '#FFFFFF' },
                                    ]}
                                />
                            );
                        })}
                    </View>

                    {/* Primary Action Button */}
                    <TouchableOpacity
                        style={styles.nextBtnContainer}
                        onPress={scrollToNext}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                            style={styles.nextBtnGradient}
                        >
                            <Text style={styles.nextBtnText}>
                                {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    safeArea: {
        flex: 1,
    },
    skipContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 24,
        paddingTop: 16,
        height: 60,
    },
    skipText: {
        fontSize: 16,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.8)',
        letterSpacing: 0.5,
    },
    slide: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 40,
        justifyContent: 'center',
    },
    glassIconContainer: {
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.25)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 60,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 15,
            },
            android: {
                elevation: 10,
            }
        })
    },
    iconInner: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    title: {
        fontWeight: '900',
        fontSize: 32,
        marginBottom: 20,
        textAlign: 'center',
        color: '#FFFFFF',
        letterSpacing: -0.5,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    description: {
        fontSize: 18,
        textAlign: 'center',
        lineHeight: 28,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '500',
        paddingHorizontal: 10,
    },
    footer: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingTop: 20,
    },
    paginator: {
        flexDirection: 'row',
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    nextBtnContainer: {
        width: '100%',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        marginBottom: 10,
    },
    nextBtnGradient: {
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextBtnText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 1,
    },
});
