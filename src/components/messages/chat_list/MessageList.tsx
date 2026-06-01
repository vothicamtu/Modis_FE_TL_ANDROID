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

    return (
        <View style={{ flex: 1 }}>
            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator
                        size="large"
                        color={C.primary}
                    />
                </View>
            )}

            <FlatList
                testID="messages_list"
                accessibilityLabel="messages_list"
                accessibilityRole="list"
                data={messages}
                keyExtractor={(item, index) =>
                    item.conversationId?.toString()
                    || `conversation_${index}`
                }
                renderItem={({ item, index }) => (
                    <MessageItem
                        message={item}
                        onPress={() => onItemPress(item)}
                        testID={`message_item_${index}`}
                    />
                )}
                ListEmptyComponent={
                    !loading ? (
                        <View style={styles.centered}>
                            <Text
                                testID="messages_list_empty"
                                accessibilityLabel="messages_list_empty"
                                style={[
                                    styles.emptyText,
                                    { color: C.msgEmptyText }
                                ]}
                            >
                                No conversations yet
                            </Text>

                            <Text
                                style={[
                                    styles.emptyHint,
                                    { color: C.msgEmptyHint }
                                ]}
                            >
                                Send a photo to start chatting!
                            </Text>
                        </View>
                    ) : null
                }
                contentContainerStyle={
                    messages.length === 0
                        ? { flex: 1 }
                        : undefined
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
    },
loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
},
    emptyText: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
    emptyHint: { fontSize: 13 },
});

export default MessagesList;
