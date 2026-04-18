import React from "react";
import { View, Text } from "react-native";
import styles from "../../styles/UserStatsScreen.styles";

const data = [40, 70, 100, 60, 90, 120];

export default function OnlineChart() {
  return (
    <View style={styles.chart}>
      <Text style={styles.chartTitle}>Online trong 6 giờ gần nhất</Text>

      <View style={styles.barRow}>
        {data.map((value, i) => (
          <View key={i} style={styles.barContainer}>
            <Text style={styles.barValue}>{value}</Text>
            <View style={[styles.bar, { height: value }]} />
          </View>
        ))}
      </View>
    </View>
  );
}
