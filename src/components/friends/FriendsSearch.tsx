import React, { useState } from "react";
import { TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../styles/FriendsScreen.styles";
import userController from "../../controller/user.controller";
import { SearchUser } from "../../types/user/SearchUser";
import { useColors } from "../../hook/useColors";

type Props = {
  onResult: (users: SearchUser[]) => void;
};

export default function FriendsSearch({ onResult }: Props) {
  const [keyword, setKeyword] = useState("");
  const C = useColors();

  const handleSearch = async (text: string) => {
    setKeyword(text);
    const userId = await AsyncStorage.getItem("userId");
    if (!userId || !text.trim()) { onResult([]); return; }
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
      placeholderTextColor={C.textHint}
      style={[styles.searchBox, { backgroundColor: C.surfaceStrong, color: C.textPrimary, borderColor: C.inputBorder }]}
      value={keyword}
      onChangeText={handleSearch}
    />
  );
}
