import React from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import styles from "../../styles/FriendsScreen.styles";
import { useColors } from "../../hook/useColors";

type Props = {
  name: string;
  avatarUrl?: string;
  disabled?: boolean;
  onCancel?: () => void;
  testID?: string;
};

export default function SentRequestItem({ name, avatarUrl, disabled, onCancel, testID }: Props) {
  const C = useColors();
  const baseTestID = testID || `sent_request_item_${name.replace(/\s+/g, '_').toLowerCase()}`;
  return (
    <View testID={baseTestID} style={styles.friendItem}>
      <Image
        testID={`${baseTestID}_avatar`}
        source={avatarUrl ? { uri: avatarUrl } : require("../../assets/image/avt.png")}
        style={[styles.avatarSmall, { borderColor: C.primary }]}
      />
      <Text testID={`${baseTestID}_name`} style={[styles.name, { color: C.textPrimary }]} numberOfLines={1}>{name}</Text>
      {disabled ? (
        <ActivityIndicator size="small" color={C.textHint} style={{ marginHorizontal: 12 }} />
      ) : (
        <TouchableOpacity testID={`${baseTestID}_cancel_button`} onPress={onCancel} disabled={disabled}>
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
