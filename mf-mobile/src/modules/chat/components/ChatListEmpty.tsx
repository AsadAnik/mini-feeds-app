import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Search, UserPlus } from 'lucide-react-native';

interface ChatListEmptyProps {
    searchQuery: string;
    width: number;
    colors: any;
    theme: string;
    onAddFriends: () => void;
}

// region CHAT LIST EMPTY
export function ChatListEmpty({ searchQuery, width, colors, theme, onAddFriends }: ChatListEmptyProps) {
    return (
        <View style={[styles.emptyContainer, { width: width - 40 }]}>
            <View style={[styles.emptyIconContainer, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
                <Search size={40} color={colors.textSecondary} />
            </View>
            <Text style={[styles.emptyText, { color: colors.text }]}>
                {searchQuery ? 'No results found' : 'No connected friends yet'}
            </Text>
            <Text style={[styles.emptySubText, { color: colors.textSecondary }]}>
                {searchQuery
                    ? `We couldn't find anyone matching "${searchQuery}"`
                    : 'Add some friends to start chatting and sharing moments.'}
            </Text>
            {!searchQuery && (
                <TouchableOpacity
                    style={[styles.addFriendsBtn, { backgroundColor: colors.primary }]}
                    onPress={onAddFriends}
                >
                    <UserPlus size={18} color="#fff" strokeWidth={2.5} />
                    <Text style={styles.addFriendsBtnText}>Find and Add Friends</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

// region STYLES-SHEET
const styles = StyleSheet.create({
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        paddingVertical: 80,
        alignSelf: 'center',
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubText: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 20,
        opacity: 0.7,
    },
    addFriendsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 25,
        shadowColor: '#4f46e5',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    addFriendsBtnText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
        marginLeft: 10,
    },
});
