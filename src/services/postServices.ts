import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/config";

import { loadTokenFromStorage } from "../utils/token";

import { PostRequest, ImagePostDTO, ReceiverRequest, PostResponse, PostFilterRequest, PostDTO, PostSimpleDTO, ReactRequest, PostUIItem, ImageFullItem } from "../types";

export type PostFilterResponse = ImagePostDTO[] | PostResponse[];
export const postService = {
    sendPost: async (req: PostRequest): Promise<PostResponse> => {
        console.log("URL đang gọi:", api.defaults.baseURL + "api/posts/create");
        const response = await api.post("api/posts/create", req)
        return response.data
    },

    deletePost: async (postId: string): Promise<void> => {
        await api.delete(`api/posts/delete/${postId}`);
    },

    filterPosts: async (filterRequest: PostFilterRequest): Promise<PostDTO[] | PostSimpleDTO[]> => {
        const response = await api.get("api/posts/filter", { params: filterRequest });
        return response.data;
    },

    reactToPost: async (reactRequest: ReactRequest): Promise<ImageFullItem> => {
        console.log("URL đang gọi:", api.defaults.baseURL + "api/posts/react");
        const response = await api.put("api/posts/react", reactRequest)
        return response.data;
    },

     uploadImage: async (photoUri: string): Promise<string> => {
        const normalizedUri = photoUri.startsWith("file://") || photoUri.startsWith("content://") ? photoUri : `file://${photoUri}`;
        let ext = normalizedUri.split('.').pop()?.toLowerCase() ?? 'jpg';
        if (!['jpg', 'jpeg', 'png', 'heic', 'webp'].includes(ext)) ext = 'jpg';
        const mimeType = ext === 'png' ? 'image/png' : ext === 'heic' ? 'image/heic' : 'image/jpeg';
        const fileName = `photo_${Date.now()}.${ext}`;

        const formData = new FormData();
        formData.append("file", {
          uri: normalizedUri,
          type: mimeType,
          name: fileName,
        } as any);

        console.log("[uploadImage] URI:", normalizedUri, "| type:", mimeType, "| name:", fileName);

        try {
          const token = await loadTokenFromStorage();
          const baseURL = api.defaults.baseURL?.endsWith("/") ? api.defaults.baseURL : `${api.defaults.baseURL}/`;

          const response = await fetch(`${baseURL}api/posts/upload/image`, {
            method: "POST",
            body: formData,
            headers: {
              "Authorization": `Bearer ${token}`,
              "Accept": "application/json",
            },
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Upload failed with status ${response.status}: ${errorText}`);
          }

          const result = await response.json();
          console.log("[uploadImage] Success:", result);
          return result.url;
        } catch (error) {
          console.error("[uploadImage] Error:", error);
          throw error;
        }
      },
};