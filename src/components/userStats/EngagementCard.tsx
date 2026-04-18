import React from "react";
import { View, Text } from "react-native";
import styles from "../../styles/UserStatsScreen.styles";

export default function EngagementCard() {
  return (
    <View style={styles.engagementCard}>
      <Text style={styles.engagementTitle}>
        Mức độ tương tác hôm nay
      </Text>

      <Text style={styles.engagementPercent}>82%</Text>
      <Text style={styles.engagementStatus}>Cao</Text>

      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: "82%" }]} />
      </View>

      <Text style={styles.engagementDesc}>
        Người dùng đang hoạt động tích cực
      </Text>
    </View>
  );
}
