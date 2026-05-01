import { FlatList, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import MessageItem from './MessageItem';
import { ConversationItem } from '../../../services/messageService';
import { useColors } from '../../../hook/useColors';

interface MessagesListProps {
    messages: ConversationItem[];
    onItemPress: (item: ConversationItem) => void;
    loading?: boolean;
}

function MessagesList({ messages, onItemPress, loading }: MessagesListProps) {
    const C = useColors();

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={C.primary} />
            </View>
        );
    }

    return (
        <FlatList
            testID="messages-list"
            data={messages}
            keyExtractor={(item) => item.conversationId || Math.random().toString()}
            renderItem={({ item }) => (
                <MessageItem message={item} onPress={() => onItemPress(item)} />
            )}
            ListEmptyComponent={
                <View style={styles.centered}>
                    <Text testID="messages-list-empty" style={[styles.emptyText, { color: C.msgEmptyText }]}>No conversations yet</Text>
                    <Text style={[styles.emptyHint, { color: C.msgEmptyHint }]}>Send a photo to start chatting!</Text>
                </View>
            }
            contentContainerStyle={messages.length === 0 ? { flex: 1 } : undefined}
        />
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
    },
    emptyText: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
    emptyHint: { fontSize: 13 },
});

export default MessagesList;
