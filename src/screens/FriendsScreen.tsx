import React, { useState, useCallback } from "react";
import { View, ScrollView, TouchableOpacity, Keyboard } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
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

  const swipeDown = Gesture.Pan()
    .activeOffsetY(10)
    .hitSlop({ top: 0, height: 100 })
    .onEnd((e) => {
      if (e.translationY > 80 || e.velocityY > 800) {
        runOnJS(goBack)();
      }
    });

  const minTouchArea = getMinTouchArea();
  const iconSize = getIconSize(24);

  return (
    <SafeContainer useGradient={true}>
      <KeyboardDismissView useScrollView={false}>
        <GestureDetector gesture={swipeDown}>
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
              scrollEventThrottle={16}
              keyboardShouldPersistTaps="handled"
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
              
              {isSearching ? (
                <SearchResultList 
                  users={searchResults} 
                  keyword={searchKeyword}
                  onClearSearch={handleClearSearch}
                />
              ) : (
                <>
                  <ShareAppRow />
                  <FriendsList />
                  <FriendRequests />
                  <SentRequests />
                  <InviteApps />
                </>
              )}
            </ScrollView>
          </View>
        </GestureDetector>
      </KeyboardDismissView>
    </SafeContainer>
  );
}


