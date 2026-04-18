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
    //fetch messages with a specific user
    //this function will be handled get list user messaged with current user

    async loadConversations(): Promise<ConversationItem[]> {
        const token = await AsyncStorage.getItem('userToken');
        // const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2OTY3N2Q3MDY5OTczMDNmZTUzZWRhMGIiLCJpYXQiOjE3Njg1NzQ0MTUsImV4cCI6MTc2ODY2MDgxNX0.2YFvrD9KzoTcPL_pNDeZuaemyZoHTWZb_LKZT9YIQWI"
        console.log("token sent to server", token)

        if (!token) {
            console.error('No access token found');
            throw new Error('No access token found');
        }
        try {
            const response = await axiosInstance.get<ConversationItem[]>(`/api/messages`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Response from /api/messages:', response.data);
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


    // Get all messages in a conversation (returns individual messages)
    async getMessagesWithUser(userId: string): Promise<ServerMessage[]> {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
            throw new Error('No access token found');
        }

        const response = await axiosInstance.get<ServerMessage[]>(`/api/messages/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    }
}
export default new MessageService();