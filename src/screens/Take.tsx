import React, { useRef, useEffect, useState } from "react";
import { View, Dimensions, Image, Pressable, StatusBar, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCameraDevices, Camera } from "react-native-vision-camera";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/types";
import { styles } from "../styles/Take.styles";
import TopBar from "../components/topBar/TopBar";
import { useColors } from "../hook/useColors";

const { height } = Dimensions.get("window");

type TakeScreenProps = {
  goToProfile: () => void;
  goToMessage: () => void;
};

export default function TakeScreen({ goToProfile, goToMessage }: TakeScreenProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const C = useColors();
  const [hasPermission, setHasPermission] = useState(false);
  const devices = useCameraDevices();
  const [cameraPosition, setCameraPosition] = useState<"back" | "front">("back");
  const cameraRef = useRef<Camera>(null);
  const [flash, setFlash] = useState<"off" | "on" | "auto">("off");

  const device = devices.find((d) => d.position === cameraPosition);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (!device) {
    return <Text>Đang khởi tạo camera...</Text>;
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePhoto({ flash });
    // vision-camera v4: photo.path là absolute path, không có "file://"
    const uri = photo.path.startsWith("file://") ? photo.path : `file://${photo.path}`;
    console.log("[Take] photo.path:", photo.path, "| uri:", uri);
    navigation.navigate("SendPhotoScreen", {
      photoUri: uri,
    });
  };

  const toggleCamera = () => {
    setCameraPosition((prev) => (prev === "back" ? "front" : "back"));
  };

  return (
    <LinearGradient colors={C.bgGradient} style={{ flex: 1 }}>
      <SafeAreaView 
        style={styles.container} 
        testID="take_screen" 
        edges={['top']}
        accessibilityLabel="take_screen"
      >
        <StatusBar barStyle={C.statusBar} translucent backgroundColor="transparent" />

        <View style={{ paddingTop: 4 }}>
          <TopBar variant="home" goToMessage={goToMessage} goToProfile={goToProfile} canTransform />
        </View>

        <View 
          style={styles.camera_area} 
          testID="take_camera_area"
          accessibilityRole="none"
          accessibilityLabel="take_camera_area"
        >
          <View style={styles.camera}>
            {device && hasPermission && (
              <Camera
                ref={cameraRef}
                style={{ flex: 1 }}
                device={device}
                isActive={true}
                photo={true}
              />
            )}
          </View>

          <View style={styles.take_area}>
            <Pressable
              testID="take_flash_button"
              onPress={() => setFlash((prev) => (prev === "off" ? "on" : "off"))}
              style={[styles.flash_btn, { backgroundColor: C.btnGhostBg, borderWidth: 1.5, borderColor: C.btnGhostBorder }]}
              accessibilityRole="button"
              accessibilityLabel="take_flash_button"
              accessibilityState={{ selected: flash === "on" }}
              accessible={true}
            >
              <Image
                source={flash === "on" ? require("../assets/image/flash.png") : require("../assets/image/no_flash.png")}
                style={{ width: "70%", height: "70%", tintColor: C.btnGhostIcon }}
                resizeMode="cover"
              />
            </Pressable>

            <Pressable 
              testID="take_capture_button" 
              onPress={takePicture} 
              style={styles.take_btn}
              accessibilityRole="button"
              accessibilityLabel="take_capture_button"
              accessible={true}
            >
              <View style={[styles.outerCircle, { borderColor: C.primary, shadowColor: C.primary }]}>
                <View style={[styles.innerCircle, { backgroundColor: C.surfaceStrong }]} />
              </View>
            </Pressable>

            <Pressable 
              testID="take_toggle_camera_button" 
              onPress={toggleCamera} 
              style={[styles.flash_btn, { backgroundColor: C.btnGhostBg, borderWidth: 1.5, borderColor: C.btnGhostBorder }]}
              accessibilityRole="button"
              accessibilityLabel="take_toggle_camera_button"
              accessible={true}
            >
              <Image
                source={require("../assets/image/cached.png")}
                style={{ width: "70%", height: "70%", tintColor: C.btnGhostIcon }}
                resizeMode="cover"
              />
            </Pressable>
          </View>
        </View>

        <Pressable 
          style={styles.history} 
          testID="take_history"
          onPress={() => navigation.navigate("AllImagesScreen")}
          accessibilityRole="button"
          accessibilityLabel="take_history"
          accessible={true}
        >
          <View style={{ width: 70, height: 40, alignItems: "center" }}>
            <Text 
              style={[styles.general_text, { fontWeight: "bold", fontSize: 19, color: C.textPrimary }]}
              accessibilityRole="text"
              accessible={false}
            >
              Lịch sử
            </Text>
            <Image source={require("../assets/image/down_toggle.png")} style={{ tintColor: C.textPrimary }} />
          </View>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
}
