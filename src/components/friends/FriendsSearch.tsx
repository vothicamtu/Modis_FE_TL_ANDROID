import React, { useState } from "react";
import { TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../styles/FriendsScreen.styles";
import userController from "../../controller/user.controller";
import { SearchUser } from "../../types/user/SearchUser";

type Props = {
  // Callback gửi kết quả search lên component cha
  onResult: (users: SearchUser[]) => void;
};

export default function FriendsSearch({ onResult }: Props) {
  // State lưu text input hiện tại
  const [keyword, setKeyword] = useState("");

  /**
   * Hàm xử lý khi user nhập chữ
   */
  const handleSearch = async (text: string) => {
    setKeyword(text);

    const userId = await AsyncStorage.getItem("userId");
    if (!userId || !text.trim()) {
      onResult([]);
      return;
    }

    try {
      const users = await userController.searchUsers(text, userId);
      onResult(users);
    } catch (err) {
      console.log("Search lỗi:", err);
    }
  };

  return (
    <TextInput
      testID="friends-search-input"
      placeholder="Tìm kiếm bạn bè"
      placeholderTextColor="#888"
      style={styles.searchBox}
      value={keyword}
      onChangeText={handleSearch}
    />
  );
}
