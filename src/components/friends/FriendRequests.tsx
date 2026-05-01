import React, { useCallback, useState } from "react";
import { View, Text, FlatList, Alert, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import styles from "../../styles/FriendsScreen.styles";
import FriendRequestItem from "./FriendRequestItem";
import friendsController from "../../controller/friends.controller";
import { FriendReq } from "../../types/friend/FriendReq";
import { emit, on } from "../../utils/eventBus";
import { useColors } from "../../hook/useColors";

export default function FriendRequests() {
  const C = useColors();
  const [requests, setRequests] = useState<FriendReq[]>([]);

  // State dùng để biết đang loading hay không
  const [loading, setLoading] = useState(true);

  // Track id đang xử lý để disable button tránh double-tap
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadRequests = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const data = await friendsController.getReceivedRequests();
      setRequests(data);
    } catch (error) {
      console.log("Lỗi load friend requests:", error);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRequests(true); // load ngay khi vào màn hình

      // Subscribe event: khi có event friendsUpdated → reload lại data background
      const off = on("friendsUpdated", () => loadRequests(false));

      // Cleanup khi rời màn hình → unsubscribe
      return off;
    }, [])
  );

  const handleAccept = async (id: string) => {
    if (processingId) return; // tránh double-tap
    console.log("ACCEPT CLICK", id);
    try {
      setProcessingId(id);
      const res = await friendsController.acceptRequest(id);
      console.log("ACCEPT OK", res);

      // Xóa request khỏi danh sách → UI render lại
      setRequests(prev => prev.filter(r => r.id !== id));

      // Phát sự kiện cho màn hình khác biết
      emit("friendsUpdated");
    } catch (e: any) {
      console.log("ACCEPT FAILED | status:", e?.response?.status, "| data:", JSON.stringify(e?.response?.data), "| msg:", e?.message);
      Alert.alert("Lỗi", "Không thể chấp nhận lời mời. Vui lòng thử lại.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (processingId) return;
    Alert.alert("Từ chối lời mời", "Bạn có chắc muốn từ chối?", [
      { text: "Không", style: "cancel" },
      {
        text: "Có",
        style: "destructive",
        onPress: async () => {
          try {
            setProcessingId(id);
            await friendsController.rejectRequest(id);

            // Update UI ngay, không cần reload API
            setRequests(prev => prev.filter(r => r.id !== id));

            // Báo cho màn hình khác cập nhật
            emit("friendsUpdated");
          } catch (e) {
            console.log("Reject failed:", e);
            Alert.alert("Lỗi", "Không thể từ chối lời mời. Vui lòng thử lại.");
          } finally {
            setProcessingId(null);
          }
        },
      },
    ]);
  };

  return (
    <View>
      <Text style={[styles.sectionTitle, { color: C.primary }]}>Lời mời kết bạn</Text>

      {processingId && (
        <ActivityIndicator size="small" color={C.textHint} style={{ marginVertical: 8 }} />
      )}

      <FlatList
        data={requests} // danh sách lời mời
        keyExtractor={(item) => item.id} // key cho React render
        renderItem={({ item }) => (
          <FriendRequestItem
            name={item.senderName || "Người dùng"}
            avatar={item.senderAvatar}
            disabled={processingId === item.id}
            onAccept={() => handleAccept(item.id)}
            onReject={() => handleReject(item.id)}
          />
        )}
        ListEmptyComponent={
          !loading ? (
            <Text style={{ color: C.textHint, marginLeft: 16 }}>
              Chưa có lời mời kết bạn
            </Text>
          ) : null
        }
        scrollEnabled={false}
      />
    </View>
  );
}
