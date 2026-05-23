import React from 'react';
import MessagesHeader from "./MessageHeader";
import MessageItem from "./MessageItem";
import MessagesList from "./MessageList";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MessageService, { ConversationItem } from "../../../services/messageService";
import { useState } from "react";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import StompService from "../../../socket/service/StompService";
import LinearGradient from 'react-native-linear-gradient';
import { useColors } from '../../../hook/useColors';

const styles = StyleSheet.create({
    container: { flex: 1 }
});

type MessageScreenProps = {
    goToHome?: () => void;
};

function MessageScreen({ goToHome }: MessageScreenProps) {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [conversation, setConversation] = useState<ConversationItem[]>([]);
    const [loading, setLoading] = useState(false);
    const C = useColors();

    const handleGoBack = () => {
        if (goToHome) goToHome();
        else navigation.goBack();
    };

    const handleConversationPress = (item: ConversationItem) => {
        navigation.navigate('ConversationScreen', {
            conversationId: item.conversationId || 'new',
            receiverId: item.partnerId || '',
            receiverName: item.partnerName,
            receiverAvatar: item.partnerAvatar,
        });
    };

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
        <LinearGradient 
            colors={C.msgBgGradient} 
            style={styles.container}
            testID="message_screen"
            accessibilityLabel="message_screen"
        >
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                <View style={{ paddingTop: 4 }}>
                    <MessagesHeader goToHome={handleGoBack} />
                </View>
                <View style={{ flex: 1 }}>
                    <MessagesList messages={conversation} onItemPress={handleConversationPress} loading={loading} />
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

export default MessageScreen;
