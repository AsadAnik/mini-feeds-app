import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Animated,
    useWindowDimensions,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Globe, MessageSquare, Users, Moon, ArrowRight } from 'lucide-react-native';
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
    },
    {
        id: '2',
        title: 'Share Your Voice',
        description: 'Express yourself freely without limits. Create text posts, react, and comment instantly.',
        icon: MessageSquare,
    },
    {
        id: '3',
        title: 'Connect with Friends',
        description: 'Build your following and engage in meaningful conversations with a vibrant community.',
        icon: Users,
    },
    {
        id: '4',
        title: 'Beautiful Dark Mode',
        description: 'A premium, eye-catching experience customized beautifully for both day and night.',
        icon: Moon,
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
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />

            <View style={styles.skipContainer}>
                {currentIndex < slides.length - 1 && (
                    <TouchableOpacity onPress={handleSkip}>
                        <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={{ flex: 3 }}>
                <FlatList
                    data={slides}
                    renderItem={({ item }) => {
                        const Icon = item.icon;
                        return (
                            <View style={[styles.slide, { width }]}>
                                <View style={[
                                    styles.iconContainer,
                                    {
                                        backgroundColor: colors.surface,
                                        shadowColor: colors.shadow,
                                        borderColor: colors.border
                                    }
                                ]}>
                                    <Icon size={120} color={colors.primary} strokeWidth={1} />
                                </View>
                                <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
                                <Text style={[styles.description, { color: colors.textSecondary }]}>{item.description}</Text>
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
                    scrollEventThrottle={32}
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
                            outputRange: [10, 24, 10],
                            extrapolate: 'clamp',
                        });

                        const opacity = scrollX.interpolate({
                            inputRange,
                            outputRange: [0.3, 1, 0.3],
                            extrapolate: 'clamp',
                        });

                        return (
                            <Animated.View
                                key={i.toString()}
                                style={[
                                    styles.dot,
                                    { width: dotWidth, opacity, backgroundColor: colors.primary },
                                ]}
                            />
                        );
                    })}
                </View>

                {/* Primary Action Button */}
                <Button
                    title={currentIndex === slides.length - 1 ? "Get Started" : "Next"}
                    onPress={scrollToNext}
                    style={styles.nextBtn}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    skipContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 24,
        paddingTop: 20,
        height: 50,
    },
    skipText: {
        fontSize: 16,
        fontWeight: '600',
    },
    slide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    iconContainer: {
        width: 200,
        height: 200,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 50,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
        borderWidth: 1,
    },
    title: {
        fontWeight: '800',
        fontSize: 28,
        marginBottom: 16,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    footer: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    paginator: {
        flexDirection: 'row',
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        height: 10,
        borderRadius: 5,
        marginHorizontal: 4,
    },
    nextBtn: {
        marginBottom: 10,
        width: '100%',
    },
});
