import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AvatarConfig } from '../constants/avatar.constants';

interface AvatarRendererProps {
    config: AvatarConfig;
    size?: number;
}

export const AvatarRenderer: React.FC<AvatarRendererProps> = ({ config: rawConfig, size = 100 }) => {
    // Robust parsing if config comes as a string from DB
    const config = React.useMemo(() => {
        if (typeof rawConfig === 'string') {
            try {
                return JSON.parse(rawConfig) as AvatarConfig;
            } catch (e) {
                console.error('Error parsing avatar config:', e);
                return {} as AvatarConfig;
            }
        }
        return rawConfig;
    }, [rawConfig]);

    if (!config) return null;

    const scale = size / 100;
    const eyeColor = '#1e293b';
    const skinColor = config.skinColor;
    const hairColor = config.hairColor;

    const getBorderRadius = () => {
        if (config.shape === 'round') return size / 2;
        if (config.shape === 'square') return size * 0.22;
        if (config.shape === 'heart') return size * 0.4;
        return size * 0.48; // Oval
    };

    const renderHair = () => {
        if (config.hair === 'none') return null;

        if (config.hair === 'short') {
            return (
                <View style={[styles.hairBase, { 
                    backgroundColor: hairColor, 
                    width: size * 1.05, 
                    height: size * 0.45, 
                    top: -size * 0.1,
                    borderTopLeftRadius: size * 0.5,
                    borderTopRightRadius: size * 0.5,
                }]} />
            );
        }

        if (config.hair === 'long') {
            return (
                <>
                    <View style={[styles.hairBase, { 
                        backgroundColor: hairColor, 
                        width: size * 1.1, 
                        height: size * 0.8, 
                        top: -size * 0.1,
                        borderRadius: size * 0.45,
                    }]} />
                    <View style={[styles.hairBase, { 
                        backgroundColor: hairColor, 
                        width: size * 1.0, 
                        height: size * 0.6, 
                        bottom: -size * 0.25,
                        borderRadius: size * 0.3,
                    }]} />
                </>
            );
        }

        if (config.hair === 'spiky') {
            return (
                <View style={[styles.hairBase, { top: -size * 0.2, flexDirection: 'row' }]}>
                    {[0, 1, 2, 3, 4, 5].map(i => (
                        <View key={i} style={{
                            width: size * 0.2,
                            height: size * 0.45,
                            backgroundColor: hairColor,
                            transform: [{ rotate: `${(i - 2.5) * 18}deg` }],
                            borderRadius: size * 0.08,
                            marginHorizontal: -size * 0.05,
                        }} />
                    ))}
                </View>
            );
        }

        if (config.hair === 'curly') {
            return (
                <View style={[styles.hairBase, { top: -size * 0.12, flexWrap: 'wrap', width: size * 1.15, justifyContent: 'center' }]}>
                    {Array.from({ length: 15 }).map((_, i) => (
                        <View key={i} style={{
                            width: size * 0.28,
                            height: size * 0.28,
                            backgroundColor: hairColor,
                            borderRadius: size * 0.14,
                            margin: -size * 0.06,
                        }} />
                    ))}
                </View>
            );
        }

        if (config.hair === 'bob') {
            return (
                <View style={[styles.hairBase, { 
                    backgroundColor: hairColor, 
                    width: size * 1.2, 
                    height: size * 0.7, 
                    top: -size * 0.1,
                    borderTopLeftRadius: size * 0.5,
                    borderTopRightRadius: size * 0.5,
                }]} />
            );
        }

        if (config.hair === 'mohawk') {
            return (
                <View style={[styles.hairBase, { top: -size * 0.3, alignItems: 'center' }]}>
                    <View style={{
                        width: size * 0.3,
                        height: size * 0.6,
                        backgroundColor: hairColor,
                        borderRadius: size * 0.15,
                    }} />
                </View>
            );
        }

        if (config.hair === 'pixie') {
            return (
                 <View style={[styles.hairBase, { 
                    backgroundColor: hairColor, 
                    width: size * 1.0, 
                    height: size * 0.35, 
                    top: -size * 0.05,
                    borderTopLeftRadius: size * 0.6,
                    borderTopRightRadius: size * 0.6,
                    borderBottomLeftRadius: size * 0.1,
                    borderBottomRightRadius: size * 0.1,
                }]} />
            );
        }

        return null;
    };

    const renderFace = () => {
        return (
            <View style={styles.faceFeatures}>
                {/* Eyebrows */}
                <View style={[styles.eyebrowRow, { top: size * 0.28 }]}>
                    <View style={[styles.eyebrow, { 
                        width: size * 0.15, 
                        height: size * 0.03, 
                        backgroundColor: hairColor, 
                        opacity: 0.8,
                        transform: [{ rotate: config.face === 'surprised' ? '-10deg' : '0deg' }],
                        borderRadius: 2
                    }]} />
                    <View style={[styles.eyebrow, { 
                        width: size * 0.15, 
                        height: size * 0.03, 
                        backgroundColor: hairColor, 
                        opacity: 0.8,
                        transform: [{ rotate: config.face === 'surprised' ? '10deg' : '0deg' }],
                        borderRadius: 2
                    }]} />
                </View>

                {/* Eyes Container */}
                <View style={[styles.eyesRow, { top: size * 0.36 }]}>
                    {/* Left Eye */}
                    <View style={[styles.eye, { 
                        width: size * 0.08, 
                        height: config.face === 'surprised' ? size * 0.12 : (config.face === 'sleepy' ? size * 0.02 : size * 0.08),
                        backgroundColor: eyeColor,
                        borderRadius: size * 0.04,
                    }]} />
                    
                    {/* Right Eye */}
                    {config.face === 'wink' ? (
                        <View style={[styles.eye, { 
                            width: size * 0.1, 
                            height: 2 * scale,
                            backgroundColor: eyeColor,
                            marginTop: size * 0.04,
                            transform: [{rotate: '10deg'}]
                        }]} />
                    ) : (
                        <View style={[styles.eye, { 
                            width: size * 0.08, 
                            height: config.face === 'surprised' ? size * 0.12 : (config.face === 'sleepy' ? size * 0.02 : size * 0.08),
                            backgroundColor: eyeColor,
                            borderRadius: size * 0.04,
                        }]} />
                    )}
                </View>

                {/* Glasses if 'cool' */}
                {config.face === 'cool' && (
                    <View style={[styles.glasses, { top: size * 0.34 }]}>
                        <View style={[styles.glassLens, { width: size * 0.25, height: size * 0.14, backgroundColor: '#000', borderRadius: size * 0.04 }]} />
                        <View style={[styles.glassBridge, { width: size * 0.1, height: 2, backgroundColor: '#000' }]}>
                             <View style={{width: '100%', height: 1, backgroundColor: 'rgba(255,255,255,0.3)', top: 0}} />
                        </View>
                        <View style={[styles.glassLens, { width: size * 0.25, height: size * 0.14, backgroundColor: '#000', borderRadius: size * 0.04 }]} />
                    </View>
                )}

                {/* Mouth Container */}
                <View style={[styles.mouthContainer, { top: size * 0.62 }]}>
                    {config.face === 'smiling' && (
                        <View style={[styles.smile, { 
                            width: size * 0.25, 
                            height: size * 0.12, 
                            borderBottomWidth: 3 * scale,
                            borderColor: '#334155',
                            borderRadius: size * 0.12,
                        }]} />
                    )}
                    {(config.face === 'neutral' || config.face === 'cool' || config.face === 'wink') && (
                        <View style={[styles.neutral, { 
                            width: size * 0.15, 
                            height: 2 * scale, 
                            backgroundColor: '#334155',
                            borderRadius: 1
                        }]} />
                    )}
                    {config.face === 'surprised' && (
                        <View style={[styles.surprised, { 
                            width: size * 0.12, 
                            height: size * 0.12, 
                            borderWidth: 2 * scale,
                            borderColor: '#334155',
                            borderRadius: size * 0.06,
                        }]} />
                    )}
                    {config.face === 'sleepy' && (
                        <View style={[styles.neutral, { 
                            width: size * 0.1, 
                            height: 2 * scale, 
                            backgroundColor: '#334155',
                            opacity: 0.6
                        }]} />
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={[
            styles.container, 
            { 
                width: size, 
                height: size, 
                borderRadius: getBorderRadius(), 
                backgroundColor: skinColor 
            }
        ]}>
            {renderHair()}
            {renderFace()}
            {/* Subtle Blush for 'Smiling' */}
            {config.face === 'smiling' && (
                <View style={[styles.blushRow, { top: size * 0.5 }]}>
                    <View style={[styles.blush, { width: size * 0.12, height: size * 0.05, backgroundColor: 'rgba(255,0,0,0.1)', borderRadius: size * 0.03 }]} />
                    <View style={[styles.blush, { width: size * 0.12, height: size * 0.05, backgroundColor: 'rgba(255,0,0,0.1)', borderRadius: size * 0.03 }]} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.08)',
    },
    hairBase: {
        position: 'absolute',
        zIndex: 5,
        justifyContent: 'center',
    },
    faceFeatures: {
        zIndex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    eyebrowRow: {
        flexDirection: 'row',
        gap: 12,
        position: 'absolute',
    },
    eyebrow: {},
    eyesRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 18,
        position: 'absolute',
    },
    eye: {},
    mouthContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    smile: {},
    neutral: {},
    surprised: {},
    glasses: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    glassLens: {},
    glassBridge: {
        justifyContent: 'center',
    },
    blushRow: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 40,
        zIndex: 1,
    },
    blush: {},
});
