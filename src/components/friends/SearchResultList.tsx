import React, { useEffect, useState, useCallback, memo } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import styles from "../../styles/FriendsScreen.styles";
import friendsController from "../../controller/friends.controller";
import { emit, on } from "../../utils/eventBus";
import { SearchUser } from "../../types/user/SearchUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColors } from "../../hook/useColors";
import { scale, getMinTouchArea, getFontSize, getIconSize } from "../../utils/responsive";

type Props = {
  users: SearchUser[];
  keyword?: string;
  onClearSearch?: () => void;
};

// Memoize SearchUserItem để tránh re-render
const SearchUserItem = memo(({ item, onAddFriend, isFriend, isSent, C }: {
  item: SearchUser;
  onAddFriend: (id: string) => void;
  isFriend: boolean;
  isSent: boolean;
  C: any;
}) => {
  let buttonText = "Kết bạn";
  if (isFriend) buttonText = "Bạn bè";
  else if (isSent) buttonText = "Đã gửi";

  const disabled = isFriend || isSent;
  const minTouchArea = getMinTouchArea();

  return (
    <View
      testID={`search_result_item_${item.id}`}
      accessibilityLabel={`search_result_item_${item.id}`}
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
        <Text style={[styles.name, { 
          color: C.textPrimary,
          fontSize: getFontSize(16),
          fontWeight: '600',
        }]}>
          {item.fullname || item.username}
        </Text>
        <Text style={[styles.username, { 
          color: C.textHint,
          fontSize: getFontSize(14),
          marginTop: scale(2),
        }]}>
          @{item.username}
        </Text>
      </View>

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
        <Text style={[styles.addText, { 
          color: C.btnPrimaryText,
          fontSize: getFontSize(14),
          fontWeight: '600',
        }]}>
          {buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

export default function SearchResultList({ users, keyword, onClearSearch }: Props) {
  const [sentIds, setSentIds] = useState<string[]>([]);
  const [friendIds, setFriendIds] = useState<string[]>([]);
  const C = useColors();

  useEffect(() => {
    loadAll();
    const off = on("friendsUpdated", loadAll);
    return off;
  }, []);

  const loadAll = useCallback(async () => {
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
  }, []);

  const handleAddFriend = useCallback(async (receiverId: string) => {
    if (sentIds.includes(receiverId) || friendIds.includes(receiverId)) return;

    const senderId = await AsyncStorage.getItem("userId");
    if (!senderId) return;

    try {
      await friendsController.sendRequest(senderId, receiverId);
      setSentIds((prev) => [...prev, receiverId]);
      emit("friendsUpdated");
    } catch (err) {
      console.log("Add friend error:", err);
    }
  }, [sentIds, friendIds]);

  const renderUserItem = useCallback(({ item }: { item: SearchUser }) => {
    const isFriend = friendIds.includes(item.id);
    const isSent = sentIds.includes(item.id);

    return (
      <SearchUserItem
        item={item}
        onAddFriend={handleAddFriend}
        isFriend={isFriend}
        isSent={isSent}
        C={C}
      />
    );
  }, [friendIds, sentIds, handleAddFriend, C]);

  const keyExtractor = useCallback((item: SearchUser) => item.id, []);

  const minTouchArea = getMinTouchArea();
  const iconSize = getIconSize(20);

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
      {/* Search header with clear button */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: scale(12),
        paddingVertical: scale(8),
      }}>
        <Text style={[styles.sectionTitle, { 
          color: C.primary,
          fontSize: getFontSize(16),
          flex: 1,
        }]}>
          {users.length > 0 
            ? `Kết quả cho "${keyword}" (${users.length})`
            : keyword 
              ? `Không tìm thấy "${keyword}"`
              : "Kết quả tìm kiếm"
          }
        </Text>
        
        {onClearSearch && (
          <TouchableOpacity
            onPress={onClearSearch}
            style={{
              width: minTouchArea,
              height: minTouchArea,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: minTouchArea / 2,
              borderWidth: 1,
              borderColor: C.border,
              shadowColor: C.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.7}
          >
            <Icon name="close" size={iconSize} color="#000000" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        testID="search_results_list"
        accessibilityLabel="search_results_list"
        data={users}
        keyExtractor={keyExtractor}
        renderItem={renderUserItem}
        ListEmptyComponent={users.length === 0 && keyword ? EmptyComponent : null}
        scrollEnabled={false}
        removeClippedSubviews={false} // Tắt để tránh conflict
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
      />
    </View>
  );
}
