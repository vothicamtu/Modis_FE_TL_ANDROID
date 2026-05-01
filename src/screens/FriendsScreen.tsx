import React, { useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, Dimensions, StatusBar } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
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
import LinearGradient from "react-native-linear-gradient";
import { useColors } from "../hook/useColors";

export default function FriendsScreen() {
  const navigation = useNavigation();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const insets = useSafeAreaInsets();
  const C = useColors();
  console.log('[FriendsScreen] insets.top =', insets.top);

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // If no back history, we might want to close the screen if it's a modal or navigate elsewhere
      // For now, let's just log or do nothing to avoid the error
      console.warn('FriendsScreen: Cannot go back');
    }
  };

  const swipeDown = Gesture.Pan()
    .activeOffsetY(10)           // chỉ kích hoạt khi vuốt xuống
    .hitSlop({ top: 0, height: 100 }) // Chỉ nhận diện cử chỉ trong vùng 100px đầu trang (gần dấu gạch)
    .onEnd((e) => {
      if (e.translationY > 80 || e.velocityY > 800) {
        runOnJS(goBack)();
      }
    });

  return (
      <LinearGradient colors={C.bgGradient} style={styles.container}>
        <StatusBar barStyle={C.statusBar} translucent backgroundColor="transparent" />
        <View style={{ height: insets.top, backgroundColor: C.bgGradient[0] }} />
        <View style={{ flex: 1, paddingTop: 28 }}>
          <View style={styles.headerBarModern}>
              <TouchableOpacity
                testID="friends-back-button"
                onPress={goBack}
                style={[styles.backButtonModern, { backgroundColor: C.backBtn, shadowColor: C.backBtnShadow }]}
              >
                <Icon name="arrow-back" size={24} color={C.textPrimary} />
              </TouchableOpacity>
              <View style={{ width: 44, marginRight: 12 }} />
            </View>
          <ScrollView
            testID="friends-scroll"
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            contentContainerStyle={styles.scrollContent}
          >
            <FriendsHeader />
            <FriendsSearch onResult={setSearchResults} />
            {searchResults.length > 0 && searchResults[0] !== null ? (
              <SearchResultList users={searchResults} />
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
      </LinearGradient>
  );
}


