import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";

import styles from "../../styles/FriendsScreen.styles";
import friendsController from "../../controller/friends.controller";
import { Friend } from "../../types/friend/Friend";
import { emit, on } from "../../utils/eventBus";

export default function FriendsList() {
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    loadUserAndFriends();
    const off = on("friendsUpdated", loadUserAndFriends);
    return off;
  }, []);

  const loadUserAndFriends = async () => {
    await loadFriends();
  };

  const loadFriends = async () => {
    try {
      const data = await friendsController.getFriends();
      setFriends(data);
    } catch (error) {
      console.log("Lỗi load friends:", error);
    }
  };

  const handleUnfriend = (friendReqId: string) => {
    Alert.alert("Hủy kết bạn", "Bạn có chắc muốn hủy kết bạn?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đồng ý",
        style: "destructive",
        onPress: async () => {
          try {
            await friendsController.deleteRequest(friendReqId);
            setFriends(prev => prev.filter(f => f.friendReqId !== friendReqId));
            emit("friendsUpdated");
          } catch (e) {
            console.log("Unfriend failed:", e);
            Alert.alert("Lỗi", "Không thể hủy kết bạn. Vui lòng thử lại.");
          }
        },
      },
    ]);
  };

  return (
    <>
      <Text testID="friends-list-title" style={styles.sectionTitle}>Bạn bè của bạn</Text>

      <FlatList
        testID="friends-list-flatlist"
        data={friends}
        keyExtractor={(item) => item.friendReqId}
        renderItem={({ item }) => (
          <View testID={`friend-item-${item.friendReqId}`} style={styles.friendItem}>
            <Image
              testID={`friend-avatar-${item.friendReqId}`}
              source={
                item.avatarUrl
                  ? { uri: item.avatarUrl }
                  : require("../../assets/image/avt.png")
              }
              style={styles.avatar}
            />

            <Text testID={`friend-name-${item.friendReqId}`} style={styles.name}>
              {item.fullname || item.username}
            </Text>

            <TouchableOpacity testID={`friend-unfriend-${item.friendReqId}`} onPress={() => handleUnfriend(item.friendReqId)}>
              <View style={styles.iconWrapper}>
                <Image
                  source={require("../../assets/image/close.png")}
                  style={styles.icon}
                />
              </View>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text testID="friends-list-empty" style={{ color: "#888", marginLeft: 16 }}>
            Bạn chưa có bạn bè
          </Text>
        }
        scrollEnabled={false}
      />
    </>
  );
}
