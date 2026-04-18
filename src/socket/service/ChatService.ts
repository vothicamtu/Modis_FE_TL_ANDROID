import { Alert } from "react-native";
import StompService from "./StompService";
import { IMessage } from "@stomp/stompjs";

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'other';
    timestamp?: Date;
    type?: string;
}

// Backend DTO structure - matches Java MessageDTO
export interface MessageDTO {
    messageId?: string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp?: string; 
}

class ChatService {

    //send message to server - matches backend's @MessageMapping("/chat.send")
    sendMessage(message: ChatMessage, receiverId: string, currentUserId: string): void {
        const messageDTO: MessageDTO = {
            senderId: currentUserId,
            receiverId: receiverId,
            content: message.text,
            timestamp: new Date().toISOString(),
        };
        // Alert.alert('Debug', `Sending message DTO: ${JSON.stringify(messageDTO)}`);
        console.log('Sending message DTO:', messageDTO);
        StompService.send('/app/chat.send', messageDTO);
    }

    //subscribe to receive messages from server - matches backend's /queue/private
    subscribeToMessages(currentUserId: string, callback: (message: ChatMessage) => void): string {
        console.log('Subscribing to private messages for user:', currentUserId);
        return StompService.subscribe('/user/queue/private', (message: IMessage) => {
            try {
                const dto = JSON.parse(message.body) as MessageDTO;
                console.log('Received message:', dto);
                
                // Convert backend DTO to frontend ChatMessage format
                const chatMessage: ChatMessage = {
                    id: dto.messageId || Date.now().toString(),
                    text: dto.content,
                    sender: dto.senderId === currentUserId ? 'user' : 'other',
                    timestamp: dto.timestamp ? new Date(dto.timestamp) : new Date(),
                    type: 'text',
                };
                callback(chatMessage);
            } catch (error) {
                console.error('Error parsing message body:', error);
            }
        }
        );
    }


    //unsubscribe from receiving messages
    unsubscribeFromMessages(subscriptionId: string): void {
        StompService.unsubscribe(subscriptionId);
    }

    //connect
    async connect(): Promise<void> {
        await StompService.connect();
    }

    //disconnect
    async disconnect(): Promise<void> {
         StompService.disconnect();
    }

    //check connect status
    isConnected(): boolean {
        return StompService.isConnected();
    }
}

export default new ChatService();