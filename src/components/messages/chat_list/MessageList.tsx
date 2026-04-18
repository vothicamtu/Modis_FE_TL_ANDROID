import { FlatList, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import MessageItem from './MessageItem';
import { ConversationItem } from '../../../services/messageService';
import color from '../../../styles/color';

interface MessagesListProps {
    messages: ConversationItem[];
    onItemPress: (item: ConversationItem) => void;
    loading?: boolean;
}

function MessagesList({ messages, onItemPress, loading }: MessagesListProps) {
    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={color.primary} />
            </View>
        );
    }

    return (
        <FlatList
            testID="messages-list"
            data={messages}
            keyExtractor={(item) => item.conversationId || Math.random().toString()}
            renderItem={({ item }) => (
                <MessageItem
                    message={item}
                    onPress={() => onItemPress(item)}
                />
            )}
            ListEmptyComponent={
                <View style={styles.centered}>
                    <Text testID="messages-list-empty" style={styles.emptyText}>No conversations yet</Text>
                    <Text style={styles.emptyHint}>Send a photo to start chatting!</Text>
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
    emptyText: {
        color: color.text_secondary,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 6,
    },
    emptyHint: {
        color: color.text_hint,
        fontSize: 13,
    },
});

export default MessagesList;
