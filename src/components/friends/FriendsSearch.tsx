import React, { useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import userController from "../../controller/user.controller";
import { SearchUser } from "../../types/user/SearchUser";
import { useColors } from "../../hook/useColors";
import { SearchInput } from "../common/SearchInput";

type Props = {
  onResult: (users: SearchUser[], keyword: string) => void;
  onClear?: () => void;
  keyword?: string;
};

export default function FriendsSearch({ onResult, onClear, keyword = "" }: Props) {
  const [searchText, setSearchText] = useState(keyword);
  const [isLoading, setIsLoading] = useState(false);
  const C = useColors();

  useEffect(() => {
    setSearchText(keyword);
  }, [keyword]);

  const handleSearch = useCallback(async (text: string) => {
    setSearchText(text);
    
    // If search is empty, reset to default state
    if (!text.trim()) {
      onResult([], "");
      return;
    }

    const userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      onResult([], text);
      return;
    }

    setIsLoading(true);
    try {
      const users = await userController.searchUsers(text, userId);
      onResult(users || [], text);
    } catch (err) {
      console.log("Search error:", err);
      onResult([], text);
    } finally {
      setIsLoading(false);
    }
  }, [onResult]);

  const handleClear = useCallback(() => {
    setSearchText("");
    onResult([], "");
    onClear?.();
  }, [onResult, onClear]);

  return (
    <SearchInput
      testID="friends-search-input"
      value={searchText}
      onChangeText={handleSearch}
      placeholder="Tìm kiếm bạn bè"
      onClear={handleClear}
      showClearButton={true}
      leftIcon="search"
      leftIconSize={20}
      style={{
        marginHorizontal: 16,
        marginVertical: 8,
      }}
    />
  );
}
