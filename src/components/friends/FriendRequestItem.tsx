import React from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import styles from "../../styles/FriendsScreen.styles";
type Props = {
  name: string;
  avatar?: string;
  disabled?: boolean;
  onAccept: () => void;
  onReject: () => void;
};

export default function FriendRequestItem({
  name,
  avatar,
  disabled,
  onAccept,
  onReject,
}: Props) {
  return (
    <View testID={`friend-request-item-${name}`} style={styles.friendItem}>
      <Image
        testID={`friend-request-avatar-${name}`}
        source={
          avatar
            ? { uri: avatar }
            : require("../../assets/image/avt.png")
        }
        style={styles.avatarSmall}
      />

      <Text testID={`friend-request-name-${name}`} style={styles.name} numberOfLines={1}>
        {name}
      </Text>

      <View style={styles.requestActions}>
        {disabled ? (
          <ActivityIndicator size="small" color="#888" style={{ marginHorizontal: 12 }} />
        ) : (
          <>
            <TouchableOpacity testID={`friend-request-accept-${name}`} style={styles.addBtn} onPress={onAccept} disabled={disabled}>
              <Text style={styles.addText}>+ Thêm</Text>
            </TouchableOpacity>

            <TouchableOpacity testID={`friend-request-reject-${name}`} style={styles.rejectBtn} onPress={onReject} disabled={disabled}>
              <Image
                source={require("../../assets/image/close.png")}
                style={styles.rejectIcon}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}
