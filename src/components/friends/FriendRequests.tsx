import React, { useCallback, useState, memo } from "react";
import { View, Text, FlatList, Alert, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import styles from "../../styles/FriendsScreen.styles";
import FriendRequestItem from "./FriendRequestItem";
import friendsController from "../../controller/friends.controller";
import { FriendReq } from "../../types/friend/FriendReq";
import { emit, on } from "../../utils/eventBus";
import { useColors } from "../../hook/useColors";

// Memoize FriendRequestItem wrapper để tránh re-render
const MemoizedFriendRequestItem = memo(({ item, onAccept, onReject, disabled }: {
  item: FriendReq;
  onAccept: () => void;
  onReject: () => void;
  disabled: boolean;
}) => (
  <FriendRequestItem
    name={item.senderName || "Người dùng"}
    avatar={item.senderAvatar}
    disabled={disabled}
    onAccept={onAccept}
    onReject={onReject}
  />
));

export default function FriendRequests() {
  const C = useColors();
  const [requests, setRequests] = useState<FriendReq[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadRequests = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const data = await friendsController.getReceivedRequests();
      setRequests(data);
    } catch (error) {
      console.log("Lỗi load friend requests:", error);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRequests(true);
      const off = on("friendsUpdated", () => loadRequests(false));
      return off;
    }, [loadRequests])
  );

  const handleAccept = useCallback(async (id: string) => {
    if (processingId) return;
    console.log("ACCEPT CLICK", id);
    try {
      setProcessingId(id);
      const res = await friendsController.acceptRequest(id);
      console.log("ACCEPT OK", res);

      setRequests(prev => prev.filter(r => r.id !== id));
      emit("friendsUpdated");
    } catch (e: any) {
      console.log("ACCEPT FAILED | status:", e?.response?.status, "| data:", JSON.stringify(e?.response?.data), "| msg:", e?.message);
      Alert.alert("Lỗi", "Không thể chấp nhận lời mời. Vui lòng thử lại.");
    } finally {
      setProcessingId(null);
    }
  }, [processingId]);

  const handleReject = useCallback(async (id: string) => {
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
            setRequests(prev => prev.filter(r => r.id !== id));
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
  }, [processingId]);

  const renderRequestItem = useCallback(({ item }: { item: FriendReq }) => (
    <MemoizedFriendRequestItem
      item={item}
      onAccept={() => handleAccept(item.id)}
      onReject={() => handleReject(item.id)}
      disabled={processingId === item.id}
    />
  ), [handleAccept, handleReject, processingId]);

  const keyExtractor = useCallback((item: FriendReq) => item.id, []);

  const ListEmptyComponent = useCallback(() => (
    !loading ? (
      <Text style={{ color: C.textHint, marginLeft: 16 }}>
        Chưa có lời mời kết bạn
      </Text>
    ) : null
  ), [loading, C.textHint]);

  return (
    <View>
      <Text style={[styles.sectionTitle, { color: C.primary }]}>Lời mời kết bạn</Text>

      {processingId && (
        <ActivityIndicator size="small" color={C.textHint} style={{ marginVertical: 8 }} />
      )}

      <FlatList
        data={requests}
        keyExtractor={keyExtractor}
        renderItem={renderRequestItem}
        ListEmptyComponent={ListEmptyComponent}
        scrollEnabled={false}
        removeClippedSubviews={false} // Tắt để tránh conflict
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
      />
    </View>
  );
}
