import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import styles from "../../styles/FriendsScreen.styles";

import { shareToApp, shareToAllApps } from "../../utils/shareUtils";

export default function ShareAppRow() {
  const apps = [
    {
      title: "Messenger",
      icon: require("../../assets/image/messenger.png"),
      onPress: () => shareToApp(),
    },
    {
      title: "Facebook",
      icon: require("../../assets/image/fb.png"),
      onPress: () => shareToApp(),
    },
    {
      title: "Instagram",
      icon: require("../../assets/image/instagram.png"),
      onPress: () => shareToApp(),
    },
    {
      title: "Share",
      icon: require("../../assets/image/share.png"),
      onPress: () => shareToAllApps(),
    },
  ];

  return (
    <>
      {/* Tiêu đề section */}
      <Text style={styles.sectionTitle}>
        Tìm bạn bè từ các ứng dụng khác
      </Text>

      {/* Hàng icon share */}
      <View style={styles.appRow}>
        {apps.map((app, i) => (
          <Pressable
            key={i}
            style={styles.shareItem}
            onPress={app.onPress}
          >
            {/* Icon app */}
            <Image source={app.icon} style={styles.shareIcon} />

            {/* Tên app */}
            <Text style={styles.shareText}>{app.title}</Text>
          </Pressable>
        ))}
      </View>
    </>
  );
}
