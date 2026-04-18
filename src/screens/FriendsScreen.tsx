import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import styles from "../styles/FriendsScreen.styles";
import Colors from "../styles/color";
import FriendsHeader from "../components/friends/FriendsHeader";
import FriendsSearch from "../components/friends/FriendsSearch";
import FriendsList from "../components/friends/FriendsList";
import FriendRequests from "../components/friends/FriendRequests";
import SentRequests from "../components/friends/SentRequests";
import ShareAppRow from "../components/friends/ShareAppRow";
import InviteApps from "../components/friends/InviteApps";
import SearchResultList from "../components/friends/SearchResultList";

export default function FriendsScreen() {
  const navigation = useNavigation();
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const goBack = () => navigation.goBack();

  const swipeDown = Gesture.Pan()
    .activeOffsetY(10)           // chỉ kích hoạt khi vuốt xuống
    .onEnd((e) => {
      if (e.translationY > 80 || e.velocityY > 800) {
        runOnJS(goBack)();
      }
    });

  return (
    <GestureDetector gesture={swipeDown}>
      <SafeAreaView testID="friends-screen" style={styles.container} edges={["top"]}>

        <View testID="friends-drag-handle" style={localStyles.dragHandle} />

        <ScrollView
          testID="friends-scroll"
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
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

      </SafeAreaView>
    </GestureDetector>
  );
}

const localStyles = StyleSheet.create({
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.neutral_light1,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
});
