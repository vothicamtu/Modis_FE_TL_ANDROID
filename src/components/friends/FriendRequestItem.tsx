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
  testID?: string;
};

export default function FriendRequestItem({ name, avatar, disabled, onAccept, onReject, testID }: Props) {
  const C = useColors();
  const baseTestID = testID || `friend_request_item_${name.replace(/\s+/g, '_').toLowerCase()}`;
  
  return (
    <View 
      testID={baseTestID} 
      style={styles.friendItem}
      accessibilityRole="none"
      accessibilityLabel={`Lời mời kết bạn từ ${name}`}
    >
      <Image
        testID={`${baseTestID}_avatar`}
        source={avatar ? { uri: avatar } : require("../../assets/image/avt.png")}
        style={[styles.avatarSmall, { borderColor: C.primary }]}
      />
      <Text 
        testID={`${baseTestID}_name`} 
        style={[styles.name, { color: C.textPrimary }]} 
        numberOfLines={1}
        accessibilityRole="text"
      >
        {name}
      </Text>
      <View style={styles.requestActions}>
        {disabled ? (
          <ActivityIndicator size="small" color={C.textHint} style={{ marginHorizontal: 12 }} />
        ) : (
          <>
            <TouchableOpacity 
              testID={`${baseTestID}_accept_button`} 
              style={[styles.addBtn, { backgroundColor: C.primary }]} 
              onPress={onAccept} 
              disabled={disabled}
              accessibilityRole="button"
              accessibilityLabel={`Chấp nhận lời mời kết bạn từ ${name}`}
              accessibilityState={{ disabled }}
            >
              <Text style={[styles.addText, { color: C.btnPrimaryText }]}>+ Thêm</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              testID={`${baseTestID}_reject_button`} 
              style={{
                width: 36, height: 36, borderRadius: 18,
                backgroundColor: C.btnGhostBg,
                borderWidth: 1.5, borderColor: C.btnGhostBorder,
                justifyContent: 'center', alignItems: 'center', elevation: 3,
              }} 
              onPress={onReject} 
              disabled={disabled}
              accessibilityRole="button"
              accessibilityLabel={`Từ chối lời mời kết bạn từ ${name}`}
              accessibilityState={{ disabled }}
            >
              <Image source={require("../../assets/image/close.png")} style={{ width: 16, height: 16, tintColor: C.btnGhostIcon }} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}
