import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import styles from "../../styles/FriendsScreen.styles";
import { shareToApp, shareToAllApps } from "../../utils/shareUtils";
import { useColors } from "../../hook/useColors";

export default function ShareAppRow() {
  const C = useColors();
  const apps = [
    { title: "Messenger", icon: require("../../assets/image/messenger.png"), onPress: () => shareToApp() },
    { title: "Facebook",  icon: require("../../assets/image/fb.png"),        onPress: () => shareToApp() },
    { title: "Instagram", icon: require("../../assets/image/instagram.png"), onPress: () => shareToApp() },
    { title: "Share",     icon: require("../../assets/image/share.png"),     onPress: () => shareToAllApps() },
  ];

  return (
    <>
      <Text style={[styles.sectionTitle, { color: C.primary }]}>Tìm bạn bè từ các ứng dụng khác</Text>
      <View style={styles.appRow}>
        {apps.map((app, i) => (
          <Pressable 
            key={i} 
            style={[
              styles.shareItem,
              { 
                paddingHorizontal: 6,
                paddingVertical: 6,
                flex: 1,
                maxWidth: '25%',
              }
            ]} 
            onPress={app.onPress}
          >
            <Image
              source={app.icon}
              style={[styles.shareIcon, app.title === 'Share' && { tintColor: C.textPrimary }]}
            />
            {/* Tạm ẩn text để tránh tràn, chỉ hiện icon */}
            {/* <Text 
              style={[styles.shareText, { color: C.textSecondary }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {app.title}
            </Text> */}
          </Pressable>
        ))}
      </View>
    </>
  );
}
