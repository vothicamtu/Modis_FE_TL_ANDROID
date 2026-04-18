import { useEffect, useRef, useState } from "react"
import ChatService from "../service/ChatService"

export const useWebSocket = () => {

    const [isConnected, setIsConnected] = useState<boolean>(false);
    const isConnecting = useRef<boolean>(false);

    useEffect(() => {
        const connect = async () => {
            if (isConnecting.current) return;

            isConnecting.current = true;

            try {
                await ChatService.connect();
                setIsConnected(ChatService.isConnected());
            } catch (error) {
                console.error('WebSocket connection failed:', error);
            } finally {
                isConnecting.current = false;
            }
        };

        connect();

        return () => {
            ChatService.disconnect();
        }
    }, []);

    return { isConnected, chatService: ChatService };
}