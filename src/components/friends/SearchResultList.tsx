import React, { useEffect, useState } from "react";
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

export default function SearchResultList({ users, keyword, onClearSearch }: Props) {
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
      console.log("Add friend error:", err);
    }
  };

  const minTouchArea = getMinTouchArea();
  const iconSize = getIconSize(20);

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
              backgroundColor: C.surface,
              borderRadius: minTouchArea / 2,
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon name="close" size={iconSize} color={C.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {users.length === 0 && keyword ? (
        <View style={{
          alignItems: 'center',
          paddingVertical: scale(32),
        }}>
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
      ) : (
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
              <View style={[styles.friendItem, {
                paddingHorizontal: scale(12),
                paddingVertical: scale(12),
                marginBottom: scale(8),
                backgroundColor: C.surface,
                borderRadius: scale(12),
                borderWidth: 1,
                borderColor: C.border,
              }]}>
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
                  disabled={disabled}
                  onPress={() => handleAddFriend(item.id)}
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
          }}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
