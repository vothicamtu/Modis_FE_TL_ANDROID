import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Alert, ActivityIndicator } from "react-native";

import styles from "../../styles/FriendsScreen.styles";
import SentRequestItem from "./SentRequestItem";
import friendsController from "../../controller/friends.controller";
import { FriendReq } from "../../types/friend/FriendReq";
import { emit, on } from "../../utils/eventBus";

export default function SentRequests() {
  const [requests, setRequests] = useState<FriendReq[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadSentRequests(true);
    const off = on("friendsUpdated", () => loadSentRequests(false));
    return off;
  }, []);

  const loadSentRequests = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const data = await friendsController.getSentRequests();
      const pending = data.filter((r) => r.status === "pending");
      setRequests(pending);
    } catch (error) {
      console.log("Lỗi load sent requests:", error);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  const handleCancel = (requestId: string) => {
    if (processingId) return;
    Alert.alert("Hủy lời mời", "Bạn có chắc muốn hủy lời mời kết bạn?", [
      { text: "Không", style: "cancel" },
      {
        text: "Có",
        style: "destructive",
        onPress: async () => {
          try {
            setProcessingId(requestId);
            await friendsController.deleteRequest(requestId);
            setRequests((prev) => prev.filter((r) => r.id !== requestId));
            emit("friendsUpdated");
          } catch (e) {
            console.log("Cancel request failed:", e);
            Alert.alert("Lỗi", "Không thể hủy lời mời. Vui lòng thử lại.");
          } finally {
            setProcessingId(null);
          }
        },
      },
    ]);
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>Lời mời đã gửi</Text>

      {processingId && (
        <ActivityIndicator size="small" color="#888" style={{ marginVertical: 8 }} />
      )}

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SentRequestItem
            name={item.receiverName || "Người dùng"}
            avatarUrl={item.receiverAvatar}
            disabled={processingId === item.id}
            onCancel={() => handleCancel(item.id)}
          />
        )}
        ListEmptyComponent={
          !loading ? (
            <Text style={{ color: "#888", marginLeft: 16 }}>
              Bạn chưa gửi lời mời nào
            </Text>
          ) : null
        }
        scrollEnabled={false}
      />
    </View>
  );
}
