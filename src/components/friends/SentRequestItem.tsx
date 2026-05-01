import React from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import styles from "../../styles/FriendsScreen.styles";
import { useColors } from "../../hook/useColors";

type Props = {
  name: string;
  avatarUrl?: string;
  disabled?: boolean;
  onCancel?: () => void;
};

export default function SentRequestItem({ name, avatarUrl, disabled, onCancel }: Props) {
  const C = useColors();
  return (
    <View style={styles.friendItem}>
      <Image
        source={avatarUrl ? { uri: avatarUrl } : require("../../assets/image/avt.png")}
        style={[styles.avatarSmall, { borderColor: C.primary }]}
      />
      <Text style={[styles.name, { color: C.textPrimary }]} numberOfLines={1}>{name}</Text>
      {disabled ? (
        <ActivityIndicator size="small" color={C.textHint} style={{ marginHorizontal: 12 }} />
      ) : (
        <TouchableOpacity onPress={onCancel} disabled={disabled}>
          <View style={{
            width: 36, height: 36, borderRadius: 18,
            backgroundColor: C.btnGhostBg,
            borderWidth: 1.5, borderColor: C.btnGhostBorder,
            justifyContent: 'center', alignItems: 'center', elevation: 3,
          }}>
            <Image source={require("../../assets/image/close.png")} style={{ width: 16, height: 16, tintColor: C.btnGhostIcon }} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}
