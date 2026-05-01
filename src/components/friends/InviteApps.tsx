import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import styles from "../../styles/FriendsScreen.styles";
import { shareToApp, shareToAllApps } from "../../utils/shareUtils";
import { useColors } from "../../hook/useColors";

export default function InviteApps() {
  const C = useColors();
  const apps = [
    { name: "Messenger",          icon: require("../../assets/image/messenger.png"), onPress: () => shareToApp() },
    { name: "Facebook",           icon: require("../../assets/image/fb.png"),        onPress: () => shareToApp() },
    { name: "Instagram",          icon: require("../../assets/image/instagram.png"), onPress: () => shareToApp() },
    { name: "Các ứng dụng khác", icon: require("../../assets/image/share.png"),     onPress: () => shareToAllApps() },
  ];

  return (
    <>
      <Text style={[styles.sectionTitle, { color: C.primary }]}>Mời từ các ứng dụng khác</Text>
      <View style={styles.appCol}>
        {apps.map((app, i) => (
          <Pressable key={i} style={styles.inviteItem} onPress={app.onPress}>
            <Image
              source={app.icon}
              style={[styles.inviteIcon, app.name === 'Các ứng dụng khác' && { tintColor: C.textPrimary }]}
            />
            <Text style={[styles.inviteText, { color: C.textPrimary }]}>{app.name}</Text>
          </Pressable>
        ))}
      </View>
    </>
  );
}
