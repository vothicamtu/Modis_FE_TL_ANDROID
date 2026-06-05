import React, { useEffect, useState, useCallback, memo } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, Alert } from "react-native";
import styles from "../../styles/FriendsScreen.styles";
import friendsController from "../../controller/friends.controller";
import { Friend } from "../../types/friend/Friend";
import { emit, on } from "../../utils/eventBus";
import { useColors } from "../../hook/useColors";

// Memoize FriendItem để tránh re-render không cần thiết
const FriendItem = memo(({ item, onUnfriend, C }: { item: Friend, onUnfriend: (id: string) => void, C: any }) => (
  <View testID={`friend-item-${item.friendReqId}`} style={styles.friendItem}>
    <Image
      testID={`friend-avatar-${item.friendReqId}`}
      source={
        item.avatarUrl
          ? { uri: item.avatarUrl }
          : require("../../assets/image/avt.png")
      }
      style={[styles.avatar, { borderColor: C.primary }]}
    />

    <Text
      testID={`friend-name-${item.friendReqId}`}
      style={[styles.name, { color: C.textPrimary }]}
    >
      {item.fullname || item.username}
    </Text>

    <TouchableOpacity testID={`friend-unfriend-${item.friendReqId}`} onPress={() => onUnfriend(item.friendReqId)}>
      <View style={{
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: C.btnGhostBg,
        borderWidth: 1.5, borderColor: C.btnGhostBorder,
        justifyContent: 'center', alignItems: 'center',
        elevation: 3,
      }}>
        <Image source={require("../../assets/image/close.png")} style={{ width: 16, height: 16, tintColor: C.btnGhostIcon }} />
      </View>
    </TouchableOpacity>
  </View>
));

export default function FriendsList() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const C = useColors();

  useEffect(() => {
    loadUserAndFriends();
    const off = on("friendsUpdated", loadUserAndFriends);
    return off;
  }, []);

  const loadUserAndFriends = useCallback(async () => {
    await loadFriends();
  }, []);

  const loadFriends = useCallback(async () => {
    try {
      const data = await friendsController.getFriends();
      setFriends(data);
    } catch (error) {
      console.log("Lỗi load friends:", error);
    }
  }, []);

  const handleUnfriend = useCallback((friendReqId: string) => {
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
  }, []);

  const renderFriendItem = useCallback(({ item }: { item: Friend }) => (
    <FriendItem item={item} onUnfriend={handleUnfriend} C={C} />
  ), [handleUnfriend, C]);

  const keyExtractor = useCallback((item: Friend) => item.friendReqId, []);

  const ListEmptyComponent = useCallback(() => (
    <Text testID="friends-list-empty" style={{ color: C.textHint, marginLeft: 16 }}>
      Bạn chưa có bạn bè
    </Text>
  ), [C.textHint]);

  return (
    <>
      <Text testID="friends-list-title" style={[styles.sectionTitle, { color: C.primary }]}>Bạn bè của bạn</Text>

      <FlatList
        testID="friends-list-flatlist"
        data={friends}
        keyExtractor={keyExtractor}
        renderItem={renderFriendItem}
        ListEmptyComponent={ListEmptyComponent}
        scrollEnabled={false}
        removeClippedSubviews={false} // Tắt để tránh conflict với ScrollView
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
      />
    </>
  );
}
