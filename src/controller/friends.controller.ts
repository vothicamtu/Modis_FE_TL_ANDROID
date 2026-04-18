import AsyncStorage from "@react-native-async-storage/async-storage";
import { friendsService } from "../services/friends.service";
import { Friend } from "../types/friend/Friend";
import { FriendReq } from "../types/friend/FriendReq";

const getUserId = async (): Promise<string> => {
  const id = await AsyncStorage.getItem("userId");
  if (!id) throw new Error("User ID not found");
  return id;
};

export const friendsController = {

  getFriends: async (): Promise<Friend[]> => {
    const userId = await getUserId();
    return friendsService.getFriends(userId);
  },

  getReceivedRequests: async (): Promise<FriendReq[]> => {
    const userId = await getUserId();
    return friendsService.getReceivedRequests(userId);
  },

  getSentRequests: async (): Promise<FriendReq[]> => {
    const userId = await getUserId();
    return friendsService.getSentRequests(userId);
  },

  sendRequest: async (senderId: string, receiverId: string): Promise<FriendReq> => {
    return friendsService.sendFriendRequest(senderId, receiverId);
  },

  acceptRequest: async (requestId: string): Promise<FriendReq> => {
    return friendsService.acceptFriendRequest(requestId);
  },

  rejectRequest: async (requestId: string): Promise<FriendReq> => {
    return friendsService.rejectFriendRequest(requestId);
  },

  deleteRequest: async (requestId: string): Promise<void> => {
    return friendsService.deleteFriendRequest(requestId);
  },
};

export default friendsController;
