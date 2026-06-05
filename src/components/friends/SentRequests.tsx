import React, { useEffect, useState, useCallback, memo } from "react";
import { View, Text, FlatList, Alert, ActivityIndicator } from "react-native";

import styles from "../../styles/FriendsScreen.styles";
import SentRequestItem from "./SentRequestItem";
import friendsController from "../../controller/friends.controller";
import { FriendReq } from "../../types/friend/FriendReq";
import { emit, on } from "../../utils/eventBus";
import { useColors } from "../../hook/useColors";

// Memoize SentRequestItem wrapper
const MemoizedSentRequestItem = memo(({ item, onCancel, disabled }: {
  item: FriendReq;
  onCancel: () => void;
  disabled: boolean;
}) => (
  <SentRequestItem
    name={item.receiverName || "Người dùng"}
    avatarUrl={item.receiverAvatar}
    disabled={disabled}
    onCancel={onCancel}
    testID={`sent_request_item_${item.id}`}
  />
));

export default function SentRequests() {
  const C = useColors();
  const [requests, setRequests] = useState<FriendReq[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadSentRequests = useCallback(async (isInitial = false) => {
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
  }, []);

  useEffect(() => {
    loadSentRequests(true);
    const off = on("friendsUpdated", () => loadSentRequests(false));
    return off;
  }, [loadSentRequests]);

  const handleCancel = useCallback((requestId: string) => {
    if (processingId) return;
    Alert.alert("Hủy lời mời đã gửi", "Bạn có chắc muốn hủy lời mời đã gửi này?", [
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
  }, [processingId]);

  const renderRequestItem = useCallback(({ item }: { item: FriendReq }) => (
    <MemoizedSentRequestItem
      item={item}
      onCancel={() => handleCancel(item.id)}
      disabled={processingId === item.id}
    />
  ), [handleCancel, processingId]);

  const keyExtractor = useCallback((item: FriendReq) => item.id, []);

  const ListEmptyComponent = useCallback(() => (
    !loading ? (
      <Text
        testID="sent_requests_empty"
        accessibilityLabel="sent_requests_empty"
        style={{ color: C.textHint, marginLeft: 16 }}
      >
        Bạn chưa gửi lời mời nào
      </Text>
    ) : null
  ), [loading, C.textHint]);

  return (
    <View
      testID="sent_requests_section"
      accessibilityLabel="sent_requests_section"
    >
      <Text style={[styles.sectionTitle, { color: C.primary }]}>Lời mời đã gửi</Text>

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
