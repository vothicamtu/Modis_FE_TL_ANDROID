import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/UserStatsScreen.styles";

import StatsHeader from "../components/userStats/StatsHeader";
import MainStats from "../components/userStats/MainStats";
import SecondaryStats from "../components/userStats/SecondaryStats";
import OnlineChart from "../components/userStats/OnlineChart";
import EngagementCard from "../components/userStats/EngagementCard";
import RefreshAction from "../components/userStats/RefreshAction";

export default function UserStatsScreen() {
  return (
    <SafeAreaView testID="user-stats-screen" style={styles.container} edges={["top"]}>
      <ScrollView
        testID="user-stats-scroll"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <StatsHeader />
        <MainStats />
        <SecondaryStats />
        <OnlineChart />
        <EngagementCard />
        <RefreshAction />
      </ScrollView>
    </SafeAreaView>
  );
}
