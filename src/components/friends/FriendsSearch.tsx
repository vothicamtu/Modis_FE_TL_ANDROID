import React, { useState, useCallback, useEffect, useRef } from "react";
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
  
  // Track the latest search request to prevent stale results
  const latestSearchRef = useRef<string>(keyword);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Only sync from parent when it's actually different and not from our own update
  useEffect(() => {
    if (keyword !== latestSearchRef.current) {
      setSearchText(keyword);
      latestSearchRef.current = keyword;
    }
  }, [keyword]);

  const handleSearch = useCallback(async (text: string) => {
    // Update local state immediately for responsive UI
    setSearchText(text);
    latestSearchRef.current = text;
    
    // Clear any pending search timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // If search is empty, reset immediately
    if (!text.trim()) {
      onResult([], "");
      return;
    }

    // Debounce API calls to prevent excessive requests
    searchTimeoutRef.current = setTimeout(async () => {
      // Double-check this is still the latest search
      if (latestSearchRef.current !== text) {
        return; // Stale request, ignore
      }

      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        // Only update if this is still the current search
        if (latestSearchRef.current === text) {
          onResult([], text);
        }
        return;
      }

      setIsLoading(true);
      try {
        const users = await userController.searchUsers(text, userId);
        // Only update results if this is still the current search
        if (latestSearchRef.current === text) {
          onResult(users || [], text);
        }
      } catch (err) {
        console.log("Search error:", err);
        // Only update if this is still the current search
        if (latestSearchRef.current === text) {
          onResult([], text);
        }
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce
  }, [onResult]);

  const handleClear = useCallback(() => {
    setSearchText("");
    latestSearchRef.current = "";
    
    // Clear any pending search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    onResult([], "");
    onClear?.();
  }, [onResult, onClear]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <SearchInput
      testID="friends_search_input"
      value={searchText}
      onChangeText={handleSearch}
      placeholder="Tìm kiếm bạn bè"
      onClear={handleClear}
      showClearButton={true}
      leftIcon="search"
      leftIconSize={20}
      // Không dùng placeholder/text hiển thị làm accessibilityLabel; dùng ID ổn định cho automation
      accessibilityLabel="friends_search_input"
      accessibilityRole="search"
      style={{
        marginHorizontal: 16,
        marginVertical: 8,
      }}
    />
  );
}
