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
            testID="messages_list"
            data={messages}
            keyExtractor={(item) => item.conversationId || Math.random().toString()}
            renderItem={({ item, index }) => (
                <MessageItem 
                    message={item} 
                    onPress={() => onItemPress(item)}
                    testID={`message_item_${index}`}
                />
            )}
            ListEmptyComponent={
                <View style={styles.centered}>
                    <Text 
                        testID="messages_list_empty" 
                        style={[styles.emptyText, { color: C.msgEmptyText }]}
                        accessibilityRole="text"
                    >
                        No conversations yet
                    </Text>
                    <Text 
                        style={[styles.emptyHint, { color: C.msgEmptyHint }]}
                        accessibilityRole="text"
                    >
                        Send a photo to start chatting!
                    </Text>
                </View>
            }
            contentContainerStyle={messages.length === 0 ? { flex: 1 } : undefined}
            accessibilityRole="list"
            accessibilityLabel="Danh sách cuộc trò chuyện"
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
