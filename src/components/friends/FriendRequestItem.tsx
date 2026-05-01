import React from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import styles from "../../styles/FriendsScreen.styles";
import { useColors } from "../../hook/useColors";

type Props = {
  name: string;
  avatar?: string;
  disabled?: boolean;
  onAccept: () => void;
  onReject: () => void;
};

export default function FriendRequestItem({ name, avatar, disabled, onAccept, onReject }: Props) {
  const C = useColors();
  return (
    <View testID={`friend-request-item-${name}`} style={styles.friendItem}>
      <Image
        testID={`friend-request-avatar-${name}`}
        source={avatar ? { uri: avatar } : require("../../assets/image/avt.png")}
        style={[styles.avatarSmall, { borderColor: C.primary }]}
      />
      <Text testID={`friend-request-name-${name}`} style={[styles.name, { color: C.textPrimary }]} numberOfLines={1}>{name}</Text>
      <View style={styles.requestActions}>
        {disabled ? (
          <ActivityIndicator size="small" color={C.textHint} style={{ marginHorizontal: 12 }} />
        ) : (
          <>
            <TouchableOpacity testID={`friend-request-accept-${name}`} style={[styles.addBtn, { backgroundColor: C.primary }]} onPress={onAccept} disabled={disabled}>
              <Text style={[styles.addText, { color: C.btnPrimaryText }]}>+ Thêm</Text>
            </TouchableOpacity>
            <TouchableOpacity testID={`friend-request-reject-${name}`} style={{
                width: 36, height: 36, borderRadius: 18,
                backgroundColor: C.btnGhostBg,
                borderWidth: 1.5, borderColor: C.btnGhostBorder,
                justifyContent: 'center', alignItems: 'center', elevation: 3,
              }} onPress={onReject} disabled={disabled}>
              <Image source={require("../../assets/image/close.png")} style={{ width: 16, height: 16, tintColor: C.btnGhostIcon }} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}
