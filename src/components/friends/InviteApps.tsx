import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import styles from "../../styles/FriendsScreen.styles";

import { shareToApp, shareToAllApps } from "../../utils/shareUtils";

export default function InviteApps() {

  const apps = [
    {
      name: "Messenger",
      icon: require("../../assets/image/messenger.png"),
      onPress: () => shareToApp(), // gọi hàm share sang Messenger
    },
    {
      name: "Facebook",
      icon: require("../../assets/image/fb.png"),
      onPress: () => shareToApp(), // share sang Facebook
    },
    {
      name: "Instagram",
      icon: require("../../assets/image/instagram.png"),
      onPress: () => shareToApp(), // share sang Instagram
    },
    {
      name: "Các ứng dụng khác",
      icon: require("../../assets/image/share.png"),
      onPress: () => shareToAllApps(), // mở bảng share hệ thống
    },
  ];

  return (
    <>
      <Text style={styles.sectionTitle}>Mời từ các ứng dụng khác</Text>

      <View style={styles.appCol}>
        {apps.map((app, i) => (
          <Pressable key={i} style={styles.inviteItem} onPress={app.onPress}>
            <Image source={app.icon} style={styles.inviteIcon} />
            <Text style={styles.inviteText}>{app.name}</Text>
          </Pressable>
        ))}
      </View>
    </>
  );
}
