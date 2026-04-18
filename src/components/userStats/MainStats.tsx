import React from "react";
import { View, Text } from "react-native";
import styles from "../../styles/UserStatsScreen.styles";

export default function MainStats() {
  return (
    <View testID="main-stats" style={styles.cardRow}>
      <View testID="main-stats-online" style={styles.card}>
        <Text style={styles.icon}>🟢</Text>
        <Text testID="main-stats-online-count" style={styles.number}>128</Text>
        <Text style={styles.label}>Đang online</Text>
      </View>

      <View testID="main-stats-total" style={styles.card}>
        <Text style={styles.icon}>👥</Text>
        <Text testID="main-stats-total-count" style={styles.number}>1240</Text>
        <Text style={styles.label}>Tổng người dùng</Text>
      </View>
    </View>
  );
}
