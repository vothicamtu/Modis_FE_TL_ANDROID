import React from "react";
import { View, Text } from "react-native";
import styles from "../../styles/UserStatsScreen.styles";

export default function SecondaryStats() {
  return (
    <>
      <View style={styles.smallCard}>
        <Text style={styles.smallTitle}>Ảnh gửi hôm nay</Text>
        <Text style={styles.smallNumber}>342</Text>
      </View>

      <View style={styles.smallCard}>
        <Text style={styles.smallTitle}>User mới hôm nay</Text>
        <Text style={styles.smallNumber}>24</Text>
      </View>
    </>
  );
}
