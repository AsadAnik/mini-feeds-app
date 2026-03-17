import { View, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Send } from 'lucide-react-native';

interface ChatInputProps {
    inputText: string;
    setInputText: (text: string) => void;
    onSend: () => void;
    isSending: boolean;
    colors: any;
    theme: string;
    insets: any;
    isKeyboardVisible: boolean;
}

// region CHAT INPUT
export function ChatInput({ inputText, setInputText, onSend, isSending, colors, theme, insets, isKeyboardVisible }: ChatInputProps) {
    return (
        <View style={[
            styles.inputWrapper,
            {
                backgroundColor: theme === 'dark' ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)',
                paddingBottom: isKeyboardVisible
                    ? (Platform.OS === 'ios' ? 10 : 15)
                    : Math.max(insets.bottom, 20),
                borderTopWidth: 1,
                borderTopColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
            }
        ]}>
            <View style={styles.inputInner}>
                <View style={[styles.textInputWrapper, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
                    <TextInput
                        style={[styles.textInput, { color: colors.text }]}
                        placeholder="Type a message..."
                        placeholderTextColor={colors.textSecondary}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                        maxLength={500}
                    />
                </View>
                {inputText.trim().length > 0 ? (
                    <TouchableOpacity
                        style={[styles.sendButton, { backgroundColor: colors.primary }]}
                        onPress={onSend}
                        disabled={isSending}
                    >
                        <Send size={18} color="#FFFFFF" strokeWidth={2.5} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={[styles.sendButton, { backgroundColor: 'transparent' }]}>
                        <Send size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

// region STYLES-SHEET
const styles = StyleSheet.create({
    inputWrapper: {
        paddingTop: 10,
    },
    inputInner: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
    },

    textInputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 24,
        paddingHorizontal: 5,
        paddingLeft: 15,
        minHeight: 46,
        maxHeight: 120,
    },
    textInput: {
        flex: 1,
        fontSize: 15,
        maxHeight: 120,
        paddingTop: 12,
        paddingBottom: 12,
    },

    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
});
