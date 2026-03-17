import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Check, Dices } from 'lucide-react-native';
import { useProfile } from '../hooks/useProfile';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { AvatarRenderer } from '../components/AvatarRenderer';
import { AVATAR_OPTIONS, DEFAULT_AVATAR_CONFIG, AvatarConfig, PRESET_CHARACTERS } from '../constants/avatar.constants';

const { width } = Dimensions.get('window');

type Category = 'Characters' | 'Face' | 'Hair' | 'Shape' | 'Skin' | 'Color';

export function AvatarMaker() {
    const { profile, updateProfile, isLoading } = useProfile();
    const [config, setConfig] = useState<AvatarConfig>(profile?.avatarConfig || DEFAULT_AVATAR_CONFIG);
    const [activeCategory, setActiveCategory] = useState<Category>('Characters');
    const { theme } = useThemeStore();
    const colors = Colors[theme];
    const router = useRouter();

    const handleSave = async () => {
        const result = await updateProfile({ avatarConfig: config });
        if (result.success) {
            Alert.alert('Success', 'Avatar updated successfully', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } else {
            Alert.alert('Error', result.message);
        }
    };

    const updateConfig = (key: keyof AvatarConfig, value: string) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const randomize = () => {
        const randomConfig: AvatarConfig = {
            face: AVATAR_OPTIONS.faces[Math.floor(Math.random() * AVATAR_OPTIONS.faces.length)].id,
            hair: AVATAR_OPTIONS.hairs[Math.floor(Math.random() * AVATAR_OPTIONS.hairs.length)].id,
            shape: AVATAR_OPTIONS.shapes[Math.floor(Math.random() * AVATAR_OPTIONS.shapes.length)].id,
            skinColor: AVATAR_OPTIONS.skinColors[Math.floor(Math.random() * AVATAR_OPTIONS.skinColors.length)],
            hairColor: AVATAR_OPTIONS.hairColors[Math.floor(Math.random() * AVATAR_OPTIONS.hairColors.length)],
        };
        setConfig(randomConfig);
    };

    const bgColors = theme === 'dark'
        ? (['#020617', '#0f172a'] as const)
        : (['#f8fafc', '#ffffff'] as const);

    const categories: Category[] = ['Characters', 'Face', 'Hair', 'Shape', 'Skin', 'Color'];

    const renderCategoryOptions = () => {
        switch (activeCategory) {
            case 'Characters':
                return (
                    <View style={styles.gridContainer}>
                        {PRESET_CHARACTERS.map(char => {
                            const isSelected = 
                                config.face === char.config.face && 
                                config.hair === char.config.hair && 
                                config.shape === char.config.shape && 
                                config.skinColor === char.config.skinColor && 
                                config.hairColor === char.config.hairColor;

                            return (
                                <TouchableOpacity
                                    key={char.id}
                                    style={[
                                        styles.gridItem,
                                        { borderColor: isSelected ? colors.primary : colors.border },
                                        isSelected && { backgroundColor: colors.primary + '15' }
                                    ]}
                                    onPress={() => setConfig(char.config)}
                                >
                                    <View style={styles.miniPreview}>
                                        <AvatarRenderer config={char.config} size={50} />
                                    </View>
                                    <Text style={[styles.optionLabel, { color: colors.text }]}>{char.label}</Text>
                                    {isSelected && <View style={[styles.selectionDot, { backgroundColor: colors.primary }]} />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                );
            case 'Face':
                return (
                    <View style={styles.gridContainer}>
                        {AVATAR_OPTIONS.faces.map(face => (
                            <TouchableOpacity
                                key={face.id}
                                style={[
                                    styles.gridItem,
                                    { borderColor: config.face === face.id ? colors.primary : colors.border },
                                    config.face === face.id && { backgroundColor: colors.primary + '15' }
                                ]}
                                onPress={() => updateConfig('face', face.id)}
                            >
                                <View style={styles.miniPreview}>
                                    <AvatarRenderer config={{ ...config, face: face.id }} size={50} />
                                </View>
                                <Text style={[styles.optionLabel, { color: colors.text }]}>{face.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                );
            case 'Hair':
                return (
                    <View style={styles.gridContainer}>
                        {AVATAR_OPTIONS.hairs.map(hair => (
                            <TouchableOpacity
                                key={hair.id}
                                style={[
                                    styles.gridItem,
                                    { borderColor: config.hair === hair.id ? colors.primary : colors.border },
                                    config.hair === hair.id && { backgroundColor: colors.primary + '15' }
                                ]}
                                onPress={() => updateConfig('hair', hair.id)}
                            >
                                <View style={styles.miniPreview}>
                                    <AvatarRenderer config={{ ...config, hair: hair.id }} size={50} />
                                </View>
                                <Text style={[styles.optionLabel, { color: colors.text }]}>{hair.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                );
            case 'Shape':
                return (
                    <View style={styles.gridContainer}>
                        {AVATAR_OPTIONS.shapes.map(shape => (
                            <TouchableOpacity
                                key={shape.id}
                                style={[
                                    styles.gridItem,
                                    { borderColor: config.shape === shape.id ? colors.primary : colors.border },
                                    config.shape === shape.id && { backgroundColor: colors.primary + '15' }
                                ]}
                                onPress={() => updateConfig('shape', shape.id)}
                            >
                                <View style={styles.miniPreview}>
                                    <AvatarRenderer config={{ ...config, shape: shape.id }} size={50} />
                                </View>
                                <Text style={[styles.optionLabel, { color: colors.text }]}>{shape.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                );
            case 'Skin':
                return (
                    <View style={styles.gridContainer}>
                        {AVATAR_OPTIONS.skinColors.map(color => (
                            <TouchableOpacity
                                key={color}
                                style={[
                                    styles.gridItem,
                                    { borderColor: config.skinColor === color ? colors.primary : colors.border },
                                    config.skinColor === color && { backgroundColor: colors.primary + '15' }
                                ]}
                                onPress={() => updateConfig('skinColor', color)}
                            >
                                <View style={[styles.colorBubble, { backgroundColor: color }]} />
                                {config.skinColor === color && <View style={[styles.selectionDot, { backgroundColor: colors.primary }]} />}
                            </TouchableOpacity>
                        ))}
                    </View>
                );
            case 'Color':
                return (
                    <View style={styles.gridContainer}>
                        {AVATAR_OPTIONS.hairColors.map(color => (
                            <TouchableOpacity
                                key={color}
                                style={[
                                    styles.gridItem,
                                    { borderColor: config.hairColor === color ? colors.primary : colors.border },
                                    config.hairColor === color && { backgroundColor: colors.primary + '15' }
                                ]}
                                onPress={() => updateConfig('hairColor', color)}
                            >
                                <View style={[styles.colorBubble, { backgroundColor: color }]} />
                                {config.hairColor === color && <View style={[styles.selectionDot, { backgroundColor: colors.primary }]} />}
                            </TouchableOpacity>
                        ))}
                    </View>
                );
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <LinearGradient colors={bgColors} style={StyleSheet.absoluteFill} />
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <ChevronLeft size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Avatar Maker</Text>
                    <TouchableOpacity onPress={handleSave} disabled={isLoading} style={styles.saveBtnTop}>
                        {isLoading ? <ActivityIndicator size="small" color={colors.primary} /> : <Check size={24} color={colors.primary} />}
                    </TouchableOpacity>
                </View>

                <View style={styles.previewSection}>
                    <View style={[styles.previewWrapper, { shadowColor: colors.primary }]}>
                        <AvatarRenderer config={config} size={200} />
                    </View>
                    <TouchableOpacity style={styles.randomizeBtn} onPress={randomize}>
                        <Dices size={20} color={colors.text} />
                        <Text style={[styles.randomizeText, { color: colors.text }]}>Randomize</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.editorContainer, { backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : '#FFFFFF' }]}>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false} 
                        style={[styles.categoryScroll, { borderBottomColor: colors.border }]}
                        contentContainerStyle={styles.categoryContent}
                    >
                        {categories.map(cat => (
                            <TouchableOpacity
                                key={cat}
                                onPress={() => setActiveCategory(cat)}
                                style={[
                                    styles.categoryItem,
                                    activeCategory === cat && { borderBottomColor: colors.primary }
                                ]}
                            >
                                <Text style={[
                                    styles.categoryText, 
                                    { color: activeCategory === cat ? colors.primary : colors.textSecondary }
                                ]}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <ScrollView style={styles.optionsScroll} showsVerticalScrollIndicator={false}>
                        {renderCategoryOptions()}
                        <View style={{ height: 40 }} />
                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerTitle: { fontSize: 20, fontWeight: '900', letterSpacing: -0.5 },
    backBtn: { width: 44, height: 44, justifyContent: 'center' },
    saveBtnTop: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
    previewSection: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    previewWrapper: {
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        backgroundColor: 'transparent',
        borderRadius: 100,
    },
    randomizeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    randomizeText: { marginLeft: 8, fontWeight: '700', fontSize: 13 },
    editorContainer: {
        flex: 1,
        marginTop: 10,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 20,
    },
    categoryScroll: {
        maxHeight: 60,
        borderBottomWidth: 1,
    },
    categoryContent: {
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    categoryItem: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    categoryText: { fontSize: 14, fontWeight: '800', letterSpacing: 0.5 },
    optionsScroll: { flex: 1, padding: 20 },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridItem: {
        width: (width - 60) / 3,
        aspectRatio: 1,
        borderRadius: 20,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        position: 'relative',
    },
    miniPreview: { marginBottom: 4 },
    optionLabel: { fontSize: 10, fontWeight: '800' },
    colorBubble: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)' },
    selectionDot: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
    }
});
