export interface FriendReq {
  id: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  receiverId: string;
  receiverName?: string;
  receiverAvatar?: string;
  status: "pending" | "accepted" | "rejected";
  timestamp: string;
}
