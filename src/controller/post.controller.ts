import AsyncStorage from "@react-native-async-storage/async-storage";
import { postService } from "../services/postServices";
import {
  ImageFullItem,
  ImageItem,
  ImagePostDTO,
  PostFilterRequest,
  PostRequest,
  ReactRequest,
  PostUIItem,
} from "../types";

const PAGE_SIZE = 20;

const mapToGridItem = (item: any): ImageItem => ({
  _id: item.id || item._id,
  uri: item.urlImage,
});

const mapToListItem = (item: any): ImageFullItem => ({
  _id: item.id || item._id,
  senderId: item.senderId,
  senderName: item.senderName || "Unknown",
  senderAvatar: item.senderAvatar || "",
  receivers: (item.receivers || []).map((r: any) => ({
    receiverId: r.receiverId,
    name: r.name || "Người dùng",
    avatar: r.avatar || "",
    icon: r.icon,
    timestamp: r.timestamp,
  })),
  caption: item.caption,
  urlImage: item.urlImage,
  created_at: item.created_at,
});

const postController = {
  sendPost: async (req: PostRequest): Promise<ImageFullItem> => {
    const res = await postService.sendPost(req);
    return mapToListItem(res);
  },

  deletePost: async (postId: string): Promise<void> => {
    return postService.deletePost(postId);
  },

  reactToPost: async (reactRequest: ReactRequest): Promise<ImageFullItem> => {
    const res = await postService.reactToPost(reactRequest);
    return mapToListItem(res);
  },

  uploadImage: async (photoUri: string): Promise<string> => {
    return postService.uploadImage(photoUri);
  },

  filterPosts: async (filter: PostFilterRequest) => {
    const rawData = await postService.filterPosts(filter);
    const mapped = rawData.map(mapToListItem);
    return { success: true, data: mapped, hasMore: mapped.length >= PAGE_SIZE };
  },

  filterPostsGrid: async (
    type: "ALL" | "MINE" | "FROM_SENDER",
    viewMode: "GRID" | "LIST",
    senderId?: string,
    page: number = 0
  ): Promise<{ success: boolean; data: PostUIItem[]; hasMore: boolean }> => {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) return { success: false, data: [], hasMore: false };

    const filter: PostFilterRequest = {
      userId,
      page,
      size: PAGE_SIZE,
      viewMode,
      type,
      senderId,
    };

    const rawData = await postService.filterPosts(filter);

    let mapped: PostUIItem[] = [];
    if (viewMode === "GRID") mapped = rawData.map(mapToGridItem);
    else mapped = rawData.map(mapToListItem);

    return { success: true, data: mapped, hasMore: mapped.length >= PAGE_SIZE };
  },
};

export default postController;