import { userService } from "../services/user.service";
import { SearchUser } from "../types/user/SearchUser";
export const userController = {

  searchUsers: async (
    keyword: string,
    currentUserId: string
  ): Promise<SearchUser[]> => {

    return userService.searchUsers(keyword, currentUserId);
  },
};

export default userController;
