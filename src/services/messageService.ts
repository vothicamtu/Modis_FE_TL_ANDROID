import { Alert } from 'react-native';
import axiosInstance from '../api/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ConversationItem {
    conversationId: string | null;
    lastMessage: string;
    messageType: string | null;
    partnerAvatar: string | null;
    partnerId: string | null;
    partnerName: string;
    partnerUsername: string;
    timestamp: string;
}

// Server message format from /api/messages/:userId
export interface ServerMessage {
    messageId: string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: string;
}

class MessageService {
    async loadConversations(): Promise<ConversationItem[]> {
        const token = await AsyncStorage.getItem('userToken');
        console.log("token sent to server", token)

        if (!token) {
            console.error('No access token found');
            throw new Error('No access token found');
        }
        try {
            const response = await axiosInstance.get<ConversationItem[]>(`api/messages`);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                console.error('Status:', error.response.status); 
                        console.error('Data:', error.response.data);    
                        console.error('Headers:', error.response.headers);
            } else if (error.request) {
                console.error('No response received from server', error.request);
            } else {
                console.error('Error setting up request', error.message);
            }
            throw error;
        }
    }

    async getMessagesWithUser(userId: string): Promise<ServerMessage[]> {
        const response = await axiosInstance.get<ServerMessage[]>(`api/messages/${userId}`);
        return response.data;
    }
}
export default new MessageService();