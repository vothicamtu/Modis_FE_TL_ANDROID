import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import styles from "../../styles/FriendsScreen.styles";
import friendsController from "../../controller/friends.controller";
import { emit, on } from "../../utils/eventBus";
import { SearchUser } from "../../types/user/SearchUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColors } from "../../hook/useColors";

type Props = {
  users: SearchUser[];
};

export default function SearchResultList({ users }: Props) {
  const [sentIds, setSentIds] = useState<string[]>([]);
  const [friendIds, setFriendIds] = useState<string[]>([]);
  const C = useColors();

  useEffect(() => {
    loadAll();

    const off = on("friendsUpdated", loadAll);
    return off;
  }, []);

  const loadAll = async () => {
    try {
      const [sent, friends] = await Promise.all([
        friendsController.getSentRequests(),
        friendsController.getFriends(),
      ]);
      setSentIds(sent.map((r) => r.receiverId));
      setFriendIds(friends.map((f) => f.userId));
    } catch (e) {
      console.log("Load friend state failed:", e);
    }
  };

  const handleAddFriend = async (receiverId: string) => {
    if (sentIds.includes(receiverId) || friendIds.includes(receiverId)) return;

    const senderId = await AsyncStorage.getItem("userId");
    if (!senderId) return;

    try {
      await friendsController.sendRequest(senderId, receiverId);
      setSentIds((prev) => [...prev, receiverId]);
      emit("friendsUpdated");
    } catch (err) {
      console.log("Add friend lỗi:", err);
    }
  };

  return (
    <View>
      <Text style={[styles.sectionTitle, { color: C.primary }]}>Kết quả tìm kiếm</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isFriend = friendIds.includes(item.id);
          const isSent = sentIds.includes(item.id);

          let buttonText = "Kết bạn";
          if (isFriend) buttonText = "Bạn bè";
          else if (isSent) buttonText = "Đã gửi";

          const disabled = isFriend || isSent;

          return (
            <View style={styles.friendItem}>
              <Image
                source={
                  item.avatarUrl
                    ? { uri: item.avatarUrl }
                    : require("../../assets/image/avt.png")
                }
                style={[styles.avatar, { borderColor: C.primary }]}
              />

              <View style={{ flex: 1 }}>
                <Text style={[styles.name, { color: C.textPrimary }]}>
                  {item.fullname || item.username}
                </Text>
                <Text style={[styles.username, { color: C.textHint }]}>@{item.username}</Text>
              </View>

              <TouchableOpacity
                disabled={disabled}
                onPress={() => handleAddFriend(item.id)}
                style={[
                  styles.addBtn,
                  { backgroundColor: disabled ? C.btnDisabled : C.primary },
                ]}
              >
                <Text style={[styles.addText, { color: C.btnPrimaryText }]}>{buttonText}</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        scrollEnabled={false}
      />
    </View>
  );
}
