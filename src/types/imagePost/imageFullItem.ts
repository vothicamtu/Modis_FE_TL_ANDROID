import { ReceiverUI } from "./receiverUI";

export interface ImageFullItem {
  _id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string; 
  receivers: ReceiverUI[];
  caption: string;
  urlImage: string;
  created_at: string;
}