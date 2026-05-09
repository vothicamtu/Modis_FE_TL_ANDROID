import React, { useState, useCallback, useMemo } from "react";
import { View, ScrollView, TouchableOpacity, Keyboard, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/FriendsScreen.styles.js";
import FriendsHeader from "../components/friends/FriendsHeader";
import FriendsSearch from "../components/friends/FriendsSearch";
import FriendsList from "../components/friends/FriendsList";
import FriendRequests from "../components/friends/FriendRequests";
import SentRequests from "../components/friends/SentRequests";
import ShareAppRow from "../components/friends/ShareAppRow";
import InviteApps from "../components/friends/InviteApps";
import SearchResultList from "../components/friends/SearchResultList";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useColors } from "../hook/useColors";
import { SafeContainer } from "../components/common/SafeContainer";
import { KeyboardDismissView } from "../components/common/KeyboardDismissView";
import { scale, getIconSize, getMinTouchArea } from "../utils/responsive";

export default function FriendsScreen() {
  const navigation = useNavigation();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const C = useColors();

  const goBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      console.warn('FriendsScreen: Cannot go back');
    }
  }, [navigation]);

  const handleSearchResult = useCallback((users: any[], keyword: string) => {
    setSearchResults(users);
    setSearchKeyword(keyword);
    setIsSearching(keyword.trim().length > 0);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchResults([]);
    setSearchKeyword("");
    setIsSearching(false);
    Keyboard.dismiss();
  }, []);

  const minTouchArea = getMinTouchArea();
  const iconSize = getIconSize(24);

  // Memoize content để tránh re-render không cần thiết
  const mainContent = useMemo(() => {
    if (isSearching) {
      return (
        <SearchResultList 
          users={searchResults} 
          keyword={searchKeyword}
          onClearSearch={handleClearSearch}
        />
      );
    }
    
    return (
      <>
        <ShareAppRow />
        <FriendsList />
        <FriendRequests />
        <SentRequests />
        <InviteApps />
      </>
    );
  }, [isSearching, searchResults, searchKeyword, handleClearSearch]);

  return (
    <SafeContainer useGradient={true}>
      <View style={{ flex: 1, paddingTop: scale(28) }}>
        {/* Header with back button */}
        <View style={[styles.headerBarModern, { 
          paddingHorizontal: scale(16),
          marginBottom: scale(8)
        }]}>
          <TouchableOpacity
            testID="friends-back-button"
            onPress={goBack}
            style={[
              styles.backButtonModern, 
              { 
                backgroundColor: C.backBtn, 
                shadowColor: C.backBtnShadow,
                width: minTouchArea,
                height: minTouchArea,
                borderRadius: minTouchArea / 2,
              }
            ]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon name="arrow-back" size={iconSize} color={C.textPrimary} />
          </TouchableOpacity>
          <View style={{ width: minTouchArea, marginRight: scale(12) }} />
        </View>

        <ScrollView
          testID="friends-scroll"
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={1} // Giảm xuống 1 để responsive nhất
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true} // Quan trọng cho nested FlatLists
          bounces={true} // Enable bouncing cho iOS
          overScrollMode="auto" // Enable over-scroll cho Android
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: scale(20) }
          ]}
        >
          <FriendsHeader />
          
          <FriendsSearch 
            onResult={handleSearchResult}
            onClear={handleClearSearch}
            keyword={searchKeyword}
          />
          
          {mainContent}
        </ScrollView>
      </View>
    </SafeContainer>
  );
}


