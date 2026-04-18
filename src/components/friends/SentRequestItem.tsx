import React from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import styles from "../../styles/FriendsScreen.styles";

type Props = {
  name: string;
  avatarUrl?: string;
  disabled?: boolean;
  onCancel?: () => void;
};

export default function SentRequestItem({ name, avatarUrl, disabled, onCancel }: Props) {
  return (
    <View style={styles.friendItem}>
      <Image
        source={
          avatarUrl
            ? { uri: avatarUrl }
            : require("../../assets/image/avt.png")
        }
        style={styles.avatarSmall}
      />

      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>

      {disabled ? (
        <ActivityIndicator size="small" color="#888" style={{ marginHorizontal: 12 }} />
      ) : (
        <TouchableOpacity onPress={onCancel} disabled={disabled}>
          <View style={styles.iconWrapper}>
            <Image
              source={require("../../assets/image/close.png")}
              style={styles.icon}
            />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}
