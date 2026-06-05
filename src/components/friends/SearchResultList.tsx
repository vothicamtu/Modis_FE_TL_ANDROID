import React, { useEffect, useState, useCallback, memo, useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import styles from "../../styles/FriendsScreen.styles";
import friendsController from "../../controller/friends.controller";
import { emit, on } from "../../utils/eventBus";
import { SearchUser } from "../../types/user/SearchUser";
import { FriendReq } from "../../types/friend/FriendReq";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColors } from "../../hook/useColors";
import { scale, getMinTouchArea, getFontSize } from "../../utils/responsive";

type Props = {
  users: SearchUser[];
  keyword?: string;
  onClearSearch?: () => void;
};

// Memoize SearchUserItem để tránh re-render
const SearchUserItem = memo(({ item, onAddFriend, onAcceptIncoming, onRejectIncoming, isFriend, isSent, incomingRequestId, isProcessing, C }: {
  item: SearchUser;
  onAddFriend: (id: string) => void;
  onAcceptIncoming: (requestId: string) => void;
  onRejectIncoming: (requestId: string) => void;
  isFriend: boolean;
  isSent: boolean;
  incomingRequestId?: string;
  isProcessing: boolean;
  C: any;
}) => {
  let buttonText = "Kết bạn";
  if (isFriend) buttonText = "Bạn bè";
  else if (incomingRequestId) buttonText = "Chấp nhận";
  else if (isSent) buttonText = "Đã gửi";

  const disabled = incomingRequestId ? isProcessing : isFriend || isSent || isProcessing;
  const minTouchArea = getMinTouchArea();
  const displayName = item.fullname || item.username;

  return (
    <View
      testID={`search_result_item_${item.id}`}
      style={[styles.friendItem, {
        paddingHorizontal: scale(12),
        paddingVertical: scale(12),
        marginBottom: scale(8),
        backgroundColor: C.surface,
        borderRadius: scale(12),
        borderWidth: 1,
        borderColor: C.border,
      }]}
    >
      <Image
        testID={`search_result_avatar_${item.id}`}
        accessibilityLabel={`search_result_avatar_${item.id}`}
        source={
          item.avatarUrl
            ? { uri: item.avatarUrl }
            : require("../../assets/image/avt.png")
        }
        style={[styles.avatar, { 
          borderColor: C.primary,
          width: scale(48),
          height: scale(48),
          borderRadius: scale(24),
        }]}
      />

      <View style={{ flex: 1, marginLeft: scale(12) }}>
        <Text
          testID={`search_result_name_${item.id}`}
          accessibilityLabel={`search_result_name_${item.id}`}
          style={[styles.name, {
          color: C.textPrimary,
          fontSize: getFontSize(16),
          fontWeight: '600',
        }]}
        >
          {displayName}
        </Text>
        <Text
          testID={`search_result_username_${item.id}`}
          accessibilityLabel={`search_result_username_${item.id}`}
          style={[styles.username, {
          color: C.textHint,
          fontSize: getFontSize(14),
          marginTop: scale(2),
        }]}
        >
          @{item.username}
        </Text>
      </View>

      {isProcessing ? (
        <ActivityIndicator size="small" color={C.textHint} style={{ minWidth: scale(80) }} />
      ) : incomingRequestId ? (
        <View style={styles.requestActions}>
          <TouchableOpacity
            testID={`search_result_accept_button_${item.id}`}
            accessibilityLabel={`search_result_accept_button_${item.id}`}
            accessibilityRole="button"
            accessibilityState={{ disabled }}
            disabled={disabled}
            onPress={() => onAcceptIncoming(incomingRequestId)}
            style={{
              width: 36, height: 36, borderRadius: 18,
              backgroundColor: C.primary,
              justifyContent: 'center', alignItems: 'center', elevation: 3,
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon name="check" size={20} color={C.btnPrimaryText} />
          </TouchableOpacity>
          <TouchableOpacity
            testID={`search_result_reject_button_${item.id}`}
            accessibilityLabel={`search_result_reject_button_${item.id}`}
            accessibilityRole="button"
            accessibilityState={{ disabled }}
            disabled={disabled}
            onPress={() => onRejectIncoming(incomingRequestId)}
            style={{
              width: 36, height: 36, borderRadius: 18,
              backgroundColor: C.btnGhostBg,
              borderWidth: 1.5, borderColor: C.btnGhostBorder,
              justifyContent: 'center', alignItems: 'center', elevation: 3,
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Image source={require("../../assets/image/close.png")} style={{ width: 16, height: 16, tintColor: C.btnGhostIcon }} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          testID={`search_result_add_button_${item.id}`}
          accessibilityLabel={`search_result_add_button_${item.id}`}
          disabled={disabled}
          onPress={() => onAddFriend(item.id)}
          style={[
            styles.addBtn,
            {
              backgroundColor: disabled ? C.btnDisabled : C.primary,
              paddingHorizontal: scale(16),
              paddingVertical: scale(8),
              borderRadius: scale(20),
              minWidth: scale(80),
              minHeight: minTouchArea,
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text
            testID={`search_result_status_${item.id}`}
            accessibilityLabel={`search_result_status_${item.id}`}
            style={[styles.addText, {
            color: C.btnPrimaryText,
            fontSize: getFontSize(14),
            fontWeight: '600',
          }]}
          >
            {buttonText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

export default function SearchResultList({ users, keyword }: Props) {
  const [sentIds, setSentIds] = useState<string[]>([]);
  const [friendIds, setFriendIds] = useState<string[]>([]);
  const [incomingRequestByUserId, setIncomingRequestByUserId] = useState<Record<string, string>>({});
  const [processingRequestId, setProcessingRequestId] = useState<string | null>(null);
  const C = useColors();

  useEffect(() => {
    loadAll();
    const off = on("friendsUpdated", loadAll);
    return off;
  }, []);

  const loadAll = useCallback(async () => {
    try {
      const [sent, friends, received] = await Promise.all([
        friendsController.getSentRequests(),
        friendsController.getFriends(),
        friendsController.getReceivedRequests(),
      ]);
      setSentIds(sent.map((r) => r.receiverId));
      setFriendIds(friends.map((f) => f.userId));
      setIncomingRequestByUserId(
        received.reduce((acc: Record<string, string>, request: FriendReq) => {
          acc[request.senderId] = request.id;
          return acc;
        }, {})
      );
    } catch (e) {
      console.log("Load friend state failed:", e);
    }
  }, []);

  const handleAddFriend = useCallback(async (receiverId: string) => {
    if (sentIds.includes(receiverId) || friendIds.includes(receiverId) || incomingRequestByUserId[receiverId]) return;

    const senderId = await AsyncStorage.getItem("userId");
    if (!senderId) return;

    try {
      await friendsController.sendRequest(senderId, receiverId);
      setSentIds((prev) => [...prev, receiverId]);
      emit("friendsUpdated");
    } catch (err) {
      console.log("Add friend error:", err);
    }
  }, [sentIds, friendIds, incomingRequestByUserId]);

  const handleAcceptIncoming = useCallback(async (requestId: string) => {
    if (processingRequestId) return;

    try {
      setProcessingRequestId(requestId);
      await friendsController.acceptRequest(requestId);
      setIncomingRequestByUserId((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((userId) => {
          if (next[userId] === requestId) delete next[userId];
        });
        return next;
      });
      await loadAll();
      emit("friendsUpdated");
    } catch (e) {
      console.log("Accept incoming search request failed:", e);
      Alert.alert("Lỗi", "Không thể chấp nhận lời mời. Vui lòng thử lại.");
    } finally {
      setProcessingRequestId(null);
    }
  }, [processingRequestId, loadAll]);

  const handleRejectIncoming = useCallback((requestId: string) => {
    if (processingRequestId) return;

    Alert.alert("Từ chối lời mời", "Bạn có chắc muốn từ chối?", [
      { text: "Không", style: "cancel" },
      {
        text: "Có",
        style: "destructive",
        onPress: async () => {
          try {
            setProcessingRequestId(requestId);
            await friendsController.rejectRequest(requestId);
            setIncomingRequestByUserId((prev) => {
              const next = { ...prev };
              Object.keys(next).forEach((userId) => {
                if (next[userId] === requestId) delete next[userId];
              });
              return next;
            });
            emit("friendsUpdated");
          } catch (e) {
            console.log("Reject incoming search request failed:", e);
            Alert.alert("Lỗi", "Không thể từ chối lời mời. Vui lòng thử lại.");
          } finally {
            setProcessingRequestId(null);
          }
        },
      },
    ]);
  }, [processingRequestId]);

  const renderUserItem = useCallback(({ item }: { item: SearchUser }) => {
    const isFriend = friendIds.includes(item.id);
    const isSent = sentIds.includes(item.id);
    const incomingRequestId = incomingRequestByUserId[item.id];

    return (
      <SearchUserItem
        item={item}
        onAddFriend={handleAddFriend}
        onAcceptIncoming={handleAcceptIncoming}
        onRejectIncoming={handleRejectIncoming}
        isFriend={isFriend}
        isSent={isSent}
        incomingRequestId={incomingRequestId}
        isProcessing={processingRequestId === incomingRequestId}
        C={C}
      />
    );
  }, [friendIds, sentIds, incomingRequestByUserId, processingRequestId, handleAddFriend, handleAcceptIncoming, handleRejectIncoming, C]);

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const aRank = incomingRequestByUserId[a.id] ? 0 : 1;
      const bRank = incomingRequestByUserId[b.id] ? 0 : 1;
      return aRank - bRank;
    });
  }, [users, incomingRequestByUserId]);

  const keyExtractor = useCallback((item: SearchUser) => item.id, []);

  const EmptyComponent = useCallback(() => (
    <View
      testID="search_empty_state"
      accessibilityLabel="search_empty_state"
      style={{
        alignItems: 'center',
        paddingVertical: scale(32),
      }}
    >
      <Icon name="search-off" size={48} color={C.textHint} />
      <Text style={{
        fontSize: getFontSize(16),
        color: C.textSecondary,
        marginTop: scale(12),
        textAlign: 'center',
      }}>
        Không tìm thấy người dùng nào
      </Text>
      <Text style={{
        fontSize: getFontSize(14),
        color: C.textHint,
        marginTop: scale(4),
        textAlign: 'center',
      }}>
        Thử tìm kiếm với từ khóa khác
      </Text>
    </View>
  ), [C]);

  return (
    <View style={{ paddingHorizontal: scale(16) }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: scale(12),
        paddingVertical: scale(8),
      }}>
        <Text
          testID="search_results_title"
          accessibilityLabel="search_results_title"
          style={[styles.sectionTitle, {
          color: C.primary,
          fontSize: getFontSize(16),
          flex: 1,
        }]}
        >
          {users.length > 0 
            ? `Kết quả cho "${keyword}" (${users.length})`
            : keyword 
              ? `Không tìm thấy "${keyword}"`
              : "Kết quả tìm kiếm"
          }
        </Text>
      </View>

      <FlatList
        testID="search_results_list"
        accessibilityLabel="search_results_list"
        data={sortedUsers}
        keyExtractor={keyExtractor}
        renderItem={renderUserItem}
        ListEmptyComponent={users.length === 0 && keyword ? EmptyComponent : null}
        keyboardShouldPersistTaps="always"
        scrollEnabled={false}
        removeClippedSubviews={false} // Tắt để tránh conflict
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
      />
    </View>
  );
}
