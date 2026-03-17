import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    StatusBar,
    Animated,
    useWindowDimensions,
    TextInput,
    RefreshControl
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Search } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '@/store/useThemeStore';
import { Colors } from '@/constants/Colors';
import { useChatList } from './hooks/useChatList';
import { ChatItem } from './components/ChatItem';
import { ChatListEmpty } from './components/ChatListEmpty';

// region CHAT LIST
export function ChatList() {
    const { width } = useWindowDimensions();
    const { theme } = useThemeStore();
    const colors = Colors[theme];
    const insets = useSafeAreaInsets();

    const {
        unifiedList,
        isLoading,
        isLoadingFriends,
        searchQuery,
        setSearchQuery,
        fadeAnim,
        handleItemPress,
        onRefresh,
        deleteConversation,
        router
    } = useChatList();

    const bgColors1 = theme === 'dark'
        ? (['#0f172a', '#1e1b4b', '#000000'] as const)
        : (['#f8fafc', '#e2e8f0', '#ffffff'] as const);

    const bgColors2 = theme === 'dark'
        ? (['#1e1b4b', '#000000', '#0f172a'] as const)
        : (['#ffffff', '#f1f5f9', '#f8fafc'] as const);

    // region Main UI
    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />

            {/* Animated Background */}
            <View style={StyleSheet.absoluteFill}>
                <LinearGradient colors={bgColors1} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
                <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}>
                    <LinearGradient colors={bgColors2} style={StyleSheet.absoluteFill} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} />
                </Animated.View>
            </View>

            <View style={styles.container}>
                {/* Premium Header */}
                <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                    <TouchableOpacity
                        style={[styles.iconButton, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}
                        onPress={() => router.back()}
                    >
                        <ChevronLeft size={28} color={colors.text} />

                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text, textAlign: 'center' }]}>Messages</Text>
                    <View style={{ width: 44 }} />
                </View>

                {/* Glassy Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={[styles.searchInputWrapper, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
                        <Search size={18} color={colors.textSecondary} style={styles.searchIcon} />
                        <TextInput
                            style={[styles.searchInput, { color: colors.text }]}
                            placeholder="Search messages or friends..."
                            placeholderTextColor={colors.textSecondary}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                {/* Conversations List */}
                <FlatList
                    data={unifiedList}
                    keyExtractor={item => item.friend.id}
                    renderItem={({ item, index }) => (
                        <ChatItem
                            item={item}
                            index={index}
                            isLast={index === unifiedList.length - 1}
                            colors={colors}
                            onPress={handleItemPress}
                            onDelete={deleteConversation}
                        />
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoading}
                            onRefresh={onRefresh}
                            tintColor={colors.primary}
                            colors={[colors.primary]}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 40 }]}
                    ListHeaderComponent={
                        <View style={styles.listHeader}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>All Chats</Text>
                        </View>
                    }
                    ListEmptyComponent={
                        !isLoadingFriends ? (
                            <ChatListEmpty
                                searchQuery={searchQuery}
                                width={width}
                                colors={colors}
                                theme={theme}
                                onAddFriends={() => router.push('/friends')}
                            />
                        ) : null
                    }
                />
            </View>
        </View>
    );
}

// region STYLES-SHEET
const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 15,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 22,
        flex: 1,
        fontWeight: '900',
        letterSpacing: -0.8,

    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    searchInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        paddingHorizontal: 15,
        height: 46,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        height: '100%',
    },
    listContent: {
        paddingTop: 10,
    },
    listHeader: {
        paddingTop: 10,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        paddingHorizontal: 25,
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
        opacity: 0.5,
    },
});