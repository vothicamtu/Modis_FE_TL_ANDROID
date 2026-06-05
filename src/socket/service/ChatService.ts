import { Alert } from "react-native";
import StompService from "./StompService";
import { IMessage } from "@stomp/stompjs";

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'other';
    timestamp?: Date;
    type?: string;
    imageUrl?: string;
}

// Backend DTO structure - matches Java MessageDTO
export interface MessageDTO {
    messageId?: string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp?: string; 
}

const IMAGE_COMMENT_PREFIX = '__MODIS_IMAGE_COMMENT__';

export const encodeMessageContent = (text: string, imageUrl?: string): string => {
    if (!imageUrl) return text;
    return `${IMAGE_COMMENT_PREFIX}${JSON.stringify({ text, imageUrl })}`;
};

export const decodeMessageContent = (content: string): { text: string; imageUrl?: string } => {
    if (!content.startsWith(IMAGE_COMMENT_PREFIX)) {
        return { text: content };
    }

    try {
        const payload = JSON.parse(content.slice(IMAGE_COMMENT_PREFIX.length));
        return {
            text: typeof payload.text === 'string' ? payload.text : '',
            imageUrl: typeof payload.imageUrl === 'string' ? payload.imageUrl : undefined,
        };
    } catch {
        return { text: content };
    }
};

class ChatService {

    //send message to server - matches backend's @MessageMapping("/chat.send")
    sendMessage(message: ChatMessage, receiverId: string, currentUserId: string): void {
        const messageDTO: MessageDTO = {
            senderId: currentUserId,
            receiverId: receiverId,
            content: encodeMessageContent(message.text, message.imageUrl),
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
                const decoded = decodeMessageContent(dto.content);
                
                const chatMessage: ChatMessage = {
                    id: dto.messageId || Date.now().toString(),
                    text: decoded.text,
                    sender: dto.senderId === currentUserId ? 'user' : 'other',
                    timestamp: dto.timestamp ? new Date(dto.timestamp) : new Date(),
                    type: 'text',
                    imageUrl: decoded.imageUrl,
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
