import React, { useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import styles from "../styles/FriendsScreen.styles.js";
import Colors from "../styles/color";
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

export default function FriendsScreen() {
  const navigation = useNavigation();
  const [searchResults, setSearchResults] = useState<any[]>([]);

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
    <GestureDetector gesture={swipeDown}>
      <LinearGradient colors={['#ede8ff', '#e8f4ff', '#e8fff8']} style={styles.container}>
        <SafeAreaView style={styles.safeAreaAbsolute} edges={["top"]}>
          <View style={{ paddingTop: 4 }}>
            <View style={styles.headerBarModern}>
              <TouchableOpacity
                testID="friends-back-button"
                onPress={goBack}
                style={styles.backButtonModern}
              >
                <Icon name="arrow-back" size={24} color={Colors.text_primary} />
              </TouchableOpacity>
              <View style={{ width: 44, marginRight: 12 }} />
            </View>
          </View>
        </SafeAreaView>

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
      </LinearGradient>
    </GestureDetector>
  );
}


