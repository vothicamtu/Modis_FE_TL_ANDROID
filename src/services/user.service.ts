import apiClient from "../api/config";
import { SearchUser } from "../types/user/SearchUser";
export const userService = {
  searchUsers: async (
    keyword: string,
    currentUserId: string
  ): Promise<SearchUser[]> => {
    const res = await apiClient.get("users/search", {
      params: { q: keyword, currentUserId },
    });
    return res.data.data;
  },
};
