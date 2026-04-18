import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import styles from "../../styles/UserStatsScreen.styles";

export default function RefreshAction() {
  return (
    <View style={styles.actionRow}>
      <Pressable testID="stats-refresh-button" style={styles.refreshBtn}>
        <Image
          source={require("../../assets/image/cached.png")}
          style={styles.refreshIcon}
        />
        <Text style={styles.refreshText}>Làm mới</Text>
      </Pressable>
    </View>
  );
}
