import React from "react";
import { Text } from "react-native";
import styles from "../../styles/UserStatsScreen.styles";

export default function StatsHeader() {
  return (
    <>
      <Text style={styles.title}>Thống kê người dùng</Text>
      <Text style={styles.updatedAt}>
        Cập nhật lần cuối: 10:32 • Hôm nay
      </Text>
    </>
  );
}
