import api from "../api/config";
import { Friend } from "../types/friend/Friend";
import { FriendReq } from "../types/friend/FriendReq";

export const friendsService = {

  // Danh sách bạn bè

  getFriends: async (userId: string): Promise<Friend[]> => {
    const res = await api.get("api/friends/list", {
      params: { userId },
    });
    return res.data;
  },

  // Lời mời nhận được
  getReceivedRequests: async (userId: string): Promise<FriendReq[]> => {
      const res = await api.get("api/friends/requests/received", {
        params: { userId },
      });
      return res.data;
    },

  // Lời mời đã gửi
  getSentRequests: async (userId: string): Promise<FriendReq[]> => {
      const res = await api.get("api/friends/requests/sent", {
        params: { userId },
      });
      return res.data;
    },

  // Gửi lời mời
  sendFriendRequest: async (
    senderId: string,
    receiverId: string
  ): Promise<FriendReq> => {
    const res = await api.post("api/friends/request", null, {
      params: { senderId, receiverId },
    });
    return res.data;
  },

  // Chấp nhận
  acceptFriendRequest: async (id: string): Promise<FriendReq> => {
    const res = await api.put(`api/friends/request/${id}/accept`);
    return res.data;
  },

  // Từ chối
  rejectFriendRequest: async (id: string): Promise<FriendReq> => {
    const res = await api.put(`api/friends/request/${id}/reject`);
    return res.data;
  },

  // Hủy / xóa kết bạn
  deleteFriendRequest: async (id: string): Promise<void> => {
    await api.delete(`api/friends/request/${id}`);
  },
};
