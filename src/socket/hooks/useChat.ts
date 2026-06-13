import { useEffect, useState, useCallback, useRef } from 'react';
import ChatService, { ChatMessage, decodeMessageContent } from '../service/ChatService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messageService, { ServerMessage } from '../../services/messageService';

interface UseChatProps {
    conversationId: string;
    receiverId: string;
    initialMessages?: ChatMessage[];
}

export const useChat = ({ conversationId, receiverId, initialMessages = [] }: UseChatProps) => {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    //  Dùng ref để giữ userId — tránh re-render không cần thiết
    const currentUserIdRef = useRef<string>('');

    const mapServerMessageToUI = useCallback((msg: ServerMessage, userId: string): ChatMessage => {
        const decoded = decodeMessageContent(msg.content);
        return {
            id: msg.messageId,
            text: decoded.text,
            sender: msg.senderId === userId ? 'user' : 'other',
            timestamp: new Date(msg.timestamp),
            type: 'text',
            imageUrl: decoded.imageUrl,
        };
    }, []);

    useEffect(() => {
        let subscriptionId: string;
        let isMounted = true; //  tránh setState sau khi unmount

        const fetchMessages = async (userId: string) => {
            try {
                const response = await messageService.getMessagesWithUser(receiverId);
                const uiMessages = response
                    .map((msg) => mapServerMessageToUI(msg, userId))
                    .sort((a, b) => 
                        new Date(a.timestamp!).getTime() - new Date(b.timestamp!).getTime()
                    );
                if (isMounted) setMessages(uiMessages);
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            }
        };

        const initialize = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                if (!userId) {
                    console.error('No userId found in storage');
                    return;
                }
                currentUserIdRef.current = userId;

                // Fetch lịch sử tin nhắn
                await fetchMessages(userId);
                if (!isMounted) return;

                // Connect WebSocket
                await ChatService.connect();

                //  Poll isConnected vì connect() không await đến khi handshake xong
                const waitForConnection = () =>
                    new Promise<void>((resolve) => {
                        if (ChatService.isConnected()) return resolve();
                        const interval = setInterval(() => {
                            if (ChatService.isConnected()) {
                                clearInterval(interval);
                                resolve();
                            }
                        }, 200);
                        // Timeout sau 8 giây để không chờ mãi
                        setTimeout(() => {
                            clearInterval(interval);
                            resolve(); // vẫn resolve để app không bị treo
                        }, 8000);
                    });

                await waitForConnection();
                if (!isMounted) return;

                setIsConnected(ChatService.isConnected());

                // Subscribe nhận tin nhắn realtime
                subscriptionId = ChatService.subscribeToMessages(userId, (message: ChatMessage) => {
                    if (message.sender === 'other' && isMounted) {
                        setMessages((prev) => {
                            if (prev.some(m => m.id === message.id)) return prev;
                            return [...prev, message];
                        });
                    }
                });

            } catch (error) {
                console.error('Failed to initialize chat:', error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        initialize();

        return () => {
            isMounted = false;
            if (subscriptionId) {
                ChatService.unsubscribeFromMessages(subscriptionId);
            }
        };
    }, [conversationId, receiverId]);

    const sendMessage = useCallback((text: string, imageUrl?: string) => {
        const userId = currentUserIdRef.current;
        if (!userId) {
            console.error('Cannot send message: User ID not found');
            return;
        }

        const newMessage: ChatMessage = {
            id: Date.now().toString(),
            text,
            sender: 'user',
            timestamp: new Date(),
            type: 'text',
            imageUrl,
        };

        setMessages((prev) => [...prev, newMessage]);
        ChatService.sendMessage(newMessage, receiverId, userId);
    }, [receiverId]);

    return { messages, sendMessage, isConnected, isLoading };
};
