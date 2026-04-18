import React from 'react';
import MessagesHeader from "./MessageHeader";
import MessageItem from "./MessageItem";
import MessagesList from "./MessageList";
import { View, StyleSheet } from "react-native";
import MessageService, { ConversationItem } from "../../../services/messageService";
import { useState } from "react";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/Navigation';
import StompService from "../../../socket/service/StompService";
import color from "../../../styles/color";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0eeff',
    }
});

type ReactEmojiCommentProps = {
    goToHome: () => void;
};

function MessageScreen({ goToHome }: ReactEmojiCommentProps) {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [conversation, setConversation] = useState<ConversationItem[]>([]);
    const [loading, setLoading] = useState(false);

    const handleConversationPress = (item: ConversationItem) => {
        navigation.navigate('ConversationScreen', {
            conversationId: item.conversationId || 'new',
            receiverId: item.partnerId || '',
            receiverName: item.partnerName,
            receiverAvatar: item.partnerAvatar,
        });
    };

    // useFocusEffect tự reload khi quay lại tab này
    useFocusEffect(
        React.useCallback(() => {
            const fetchConversations = async () => {
                try {
                    setLoading(true);
                    const data = await MessageService.loadConversations();
                    setConversation(data);
                    await StompService.connect();
                } catch (error) {
                    console.error('Error loading conversations:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchConversations();
        }, [])
    );

    return (
        <View style={styles.container}>
            <MessagesHeader goToHome={goToHome} />
            <MessagesList
                messages={conversation}
                onItemPress={handleConversationPress}
                loading={loading}
            />
        </View>
    );
}

export default MessageScreen;