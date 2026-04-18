import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import api from "../../api/config";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PendingSubscription {
  id: string;
  destination: string;
  callback: (message: any) => void;
  headers?: { [key: string]: string };
}

class StompService {
  private client: Client | null = null;
  private subscription: Map<string, StompSubscription> = new Map();
  private isConnecting: boolean = false;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private pendingSubscriptions: PendingSubscription[] = [];


  //connect to the server
  async connect(): Promise<void> {
    if (this.client?.connected || this.isConnecting) {
      // Reduced log level for redundant connection attempts
      return;
    }

    this.isConnecting = true;

    try {
      //here we get the token from async storage

      const token = await AsyncStorage.getItem('userToken');
      // const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2OTY3N2Q3MDY5OTczMDNmZTUzZWRhMGIiLCJpYXQiOjE3Njg1NzQ0MTUsImV4cCI6MTc2ODY2MDgxNX0.2YFvrD9KzoTcPL_pNDeZuaemyZoHTWZb_LKZT9YIQWI";
      console.log('STOMP connecting with token:', token);
      if (!token) {
        console.error('No access token found');
        this.isConnecting = false;
        return;
      }

      const baseURL = api.defaults.baseURL ?? 'http://localhost:8080/';
      // Đảm bảo baseURL kết thúc bằng / và wsUrl không bắt đầu bằng /
      const cleanBaseURL = baseURL.endsWith('/') ? baseURL : `${baseURL}/`;
      const wsUrl = `${cleanBaseURL}ws?token=${encodeURIComponent(token)}`;

      console.log('Connecting to STOMP server at:', wsUrl);

      this.client = new Client({
        webSocketFactory: () => new SockJS(wsUrl) as any,

        debug: (str) => {
          console.log('STOMP DEBUG:', str);
        },

        //reconnectDelay: 5000,
        reconnectDelay: 5000,

        onConnect: (frame) => {
          console.log('Connected to STOMP server:', frame);
          this.isConnecting = false;
          this.onConnected();
          this.processPendingSubscriptions();
        },

        onDisconnect: () => {
          console.log('Disconnected from STOMP server');
          this.isConnecting = false;
        },

        onStompError: (frame) => {
          console.error('STOMP error:', frame.headers['message']);
          console.error('Detailed error:', frame.body);
          this.isConnecting = false;
        },
        onWebSocketError: (event) => {
          console.error('WebSocket error:', event);
          this.isConnecting = false;
        }
        
      });
      this.client.activate();
    } catch (error) {
      console.error('Error during STOMP connection:', error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }
  //Called when connection is established
  private onConnected(): void {
    console.log('STOMP connection established');
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }


 private processPendingSubscriptions() {
    if (this.pendingSubscriptions.length === 0) return;

    console.log(` Đang xử lý ${this.pendingSubscriptions.length} subscriptions chờ...`);
    
    // Đã có ID, chúng ta trực tiếp gọi client.subscribe
    const pending = [...this.pendingSubscriptions];
    this.pendingSubscriptions = [];

    pending.forEach((sub) => {
      if (!this.client?.connected) return;
      const subscription = this.client.subscribe(
        sub.destination,
        (message) => {
          try {
            sub.callback(message);
          } catch (error) {
            console.error('Error in subscription callback:', error);
          }
        },
        sub.headers || {}
      );
      this.subscription.set(sub.id, subscription);
    });
  }
  //schedule reconnection
  private scheduleReconnect(): void {
    if (this.reconnectTimeout) {
      return; // Reconnection already scheduled
    }
    this.reconnectTimeout = setTimeout(() => {
      console.log('Attempting to reconnect to STOMP server...');
      this.connect();
    }, 5000); // Try to reconnect after 5 seconds
  }

 
  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    // Unsubscribe all
    this.subscription.forEach((subscription) => subscription.unsubscribe());
    this.subscription.clear();

    // Clear pending subscriptions
    this.pendingSubscriptions = [];

    // Deactivate client
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }

    this.isConnecting = false;
  }

  /**
   * Subscribe to a destination
   */
  // subscribe(destination: string, callback: (message: IMessage) => void, headers?: { [key: string]: string }): string {
  //   console.log(`[DEBUG] Đang thử subscribe vào: ${destination}`);
  //   console.log(`[DEBUG] Trạng thái Client hiện tại:`, this.client ? 'Đã khởi tạo' : 'Null');
  //   console.log(`[DEBUG] Đã kết nối (connected)?:`, this.client?.connected);
  //   if (!this.client?.connected) {
  //     console.warn('Cannot subscribe: Not connected');
  //     return '';
  //   }

  //   if (!this.client?.connected) {
  //     this.onConnected();
  //   }
  //   const subscriptionId = `sub-${Date.now()}-${Math.random()}`;

  //   const subscription = this.client.subscribe(
  //     destination,
  //     (message) => {
  //       try {
  //         callback(message);
  //       } catch (error) {
  //         console.error('Error in subscription callback:', error);
  //       }
  //     },
  //     headers || {}
  //   );

  //   this.subscription.set(subscriptionId, subscription);
  //   return subscriptionId;
  // }
subscribe(
    destination: string,
    callback: (message: any) => void, // Sửa type IMessage theo project của bạn
    headers?: { [key: string]: string }
  ): string {
    const subscriptionId = `sub-${Date.now()}-${Math.random()}`;
    
    // CASE 1: Chưa kết nối -> Lưu vào hàng đợi
    if (!this.client?.connected) {
      console.log(`🔌 Socket chưa sẵn sàng. Đang lưu hàng đợi: ${destination}`);
      
      this.pendingSubscriptions.push({
        id: subscriptionId,
        destination,
        callback,
        headers
      });

      return subscriptionId;
    }

    // CASE 2: Đã kết nối -> Thực hiện đăng ký ngay (Logic cũ của bạn)
    const subscription = this.client.subscribe(
      destination,
      (message) => {
        try {
          callback(message);
        } catch (error) {
          console.error('Error in subscription callback:', error);
        }
      },
      headers || {}
    );

    this.subscription.set(subscriptionId, subscription);
    return subscriptionId;
  }
  unsubscribe(subscriptionId: string): void {
    // Check if it's in pending and remove it
    this.pendingSubscriptions = this.pendingSubscriptions.filter(
      (sub) => sub.id !== subscriptionId
    );

    const subscription = this.subscription.get(subscriptionId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscription.delete(subscriptionId);
    }
  }

  /**
   * Send message to destination
   * Tương ứng với @MessageMapping("/chat.send")
   */
  send(destination: string, body: any, headers?: { [key: string]: string }): void {
    if (!this.client?.connected) {
      console.warn('Cannot send: Not connected');
      return;
    }

    try {
      this.client.publish({
        destination,
        body: JSON.stringify(body),
        headers: headers || {},
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.client?.connected || false;
  }

  /**
   * Get client instance
   */
  getClient(): Client | null {
    return this.client;
  }
}

export default new StompService();