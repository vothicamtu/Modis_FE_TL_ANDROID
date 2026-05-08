import React, { useRef, useState, useEffect } from "react";
import { styles } from "../styles/Send_photo.styles";
import { on } from "../utils/eventBus";
import {
  Image,
  Pressable,
  Text,
  TextInput,
  View,
  Keyboard,
  Animated,
  FlatList,
  ActivityIndicator,
  Platform,
} from "react-native";
import Colors from "../styles/color";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/types";
import { optimizeCloudinaryUrl } from "../utils/cloudinary";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { friendsService } from "../services/friends.service";
import { Friend } from "../types/friend/Friend";
import AsyncStorage from "@react-native-async-storage/async-storage";
import postController from "../controller/post.controller";
import { PostRequest } from "../types";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColors } from "../hook/useColors";
import { KeyboardDismissView } from "../components/common/KeyboardDismissView";
import { CaptionText, CaptionOverlay } from "../components/common/CaptionText";
import { 
  scale, 
  verticalScale, 
  getMinTouchArea, 
  getFontSize, 
  getIconSize,
  getLayoutDimensions,
  getKeyboardHeight,
  isSmallDevice 
} from "../utils/responsive";

type SendPhotoScreenProps = {
  route: {
    params: {
      photoUri: string;
    };
  };
};

function SendPhotoScreen({ route }: SendPhotoScreenProps) {
  const { photoUri } = route.params;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const C = useColors();

  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const [onCaptionPattern, setOnCaptionPattern] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;

  const [receivers, setReceivers] = useState<string[]>([]);
  const [allFriend, setAllFriend] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const { screenHeight, isLandscape } = getLayoutDimensions();
  const minTouchArea = getMinTouchArea();
  const iconSize = getIconSize(22);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      setShowInput(true);
      setKeyboardHeight(e.endCoordinates.height);
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setShowInput(false);
      setKeyboardHeight(0);
      inputRef.current?.blur();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("userId").then(setUserId);
  }, []);

  useEffect(() => {
    if (!userId) return;

    friendsService.getFriends(userId).then(setFriends).catch(console.error);

    const off = on("friendsUpdated", () => {
      friendsService.getFriends(userId).then(setFriends).catch(console.error);
    });

    return off;
  }, [userId]);

  useEffect(() => {
    if (friends.length > 0) {
      chooseAllFriend();
    }
  }, [friends]);

  const chooseAllFriend = () => {
    setAllFriend(true);
    setReceivers(friends.map((f) => f.userId));
  };

  const toggleSingleFriend = (uid: string) => {
    if (allFriend) {
      setAllFriend(false);
      setReceivers([uid]);
      return;
    }

    setReceivers((prev) => {
      if (prev.includes(uid)) {
        return prev.length > 1 ? prev.filter((id) => id !== uid) : prev;
      }
      return [...prev, uid];
    });
  };

  const checkReceiver = (uid: string) => {
    return receivers.includes(uid) && !allFriend;
  };

  const turnOnCaptionPattern = () => {
    setOnCaptionPattern((prev) => !prev);
  };

  const applyCaption = (text: string) => {
    setCaption(text);
    setOnCaptionPattern(false);
  };

  const saveImage = async () => {
    try {
      await CameraRoll.save(photoUri, { type: "photo" });
      show();
    } catch (e) {
      console.log("Save error", e);
    }
  };

  const show = () => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(1500),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const sendPost = async () => {
    if (!userId || receivers.length === 0) return;

    try {
      setLoading(true);

      const urlImage = await postController.uploadImage(photoUri);
      
      const postRequest: PostRequest = {
        senderId: userId,
        receivers: receivers.map((id) => ({
          receiverId: id,
          icon: null,
          timestamp: null,
        })),
        caption,
        urlImage,
      };

      const newPost = await postController.sendPost(postRequest);
      //  realtime: phát event toàn app
      (globalThis as any).__NEW_POST__ = newPost;

      navigation.goBack();
    } catch (e: any) {
      console.error("Send post error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.containerBg }]} testID="send-photo-screen">
      <View style={styles.send_to}>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: C.textPrimary }}>
          Gửi đến ...
        </Text>

        <Pressable testID="send-photo-download-button" onPress={saveImage} style={[styles.download_btn, { backgroundColor: C.primary, shadowColor: C.primary }]}>
          <Image source={require("../assets/image/download.png")} style={{ width: 22, height: 22, tintColor: C.btnPrimaryText }} />
        </Pressable>
      </View>

      <View style={styles.image_area} testID="send-photo-preview-area">
        <Image testID="send-photo-preview-image" source={{ uri: photoUri }} style={styles.image} />

        <Animated.View style={[styles.saveImageNoti, { opacity, backgroundColor: C.toastBg }]}>
          <Text style={{ fontSize: 18, color: C.textPrimary, fontWeight: "bold" }}>
            Đã lưu ảnh
          </Text>
        </Animated.View>

        <View style={[styles.caption_image, { bottom: showInput ? 100 : 80, backgroundColor: C.captionOverlay }]}>
          <TextInput
            testID="send-photo-caption-input"
            ref={inputRef}
            style={{
              color: C.textPrimary,
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: "center",
              minWidth: 100,
            }}
            value={caption}
            onChangeText={setCaption}
            placeholder="Thêm một tin nhắn"
            placeholderTextColor={C.textHint}
            keyboardAppearance={C.statusBar === 'dark-content' ? 'light' : 'dark'}
          />
        </View>
      </View>

      <View style={styles.send_btn_area}>
        <Pressable
          testID="send-photo-close-button"
          onPress={() => navigation.goBack()}
          style={[styles.close_btn, { backgroundColor: C.btnGhostBg, borderWidth: 1.5, borderColor: C.btnGhostBorder }, loading && { opacity: 0.4 }]}
          disabled={loading}
        >
          <Image source={require("../assets/image/close.png")} style={{ width: "55%", height: "55%", tintColor: C.btnGhostIcon }} resizeMode="contain" />
        </Pressable>

        <Pressable testID="send-photo-send-button" onPress={sendPost} style={[styles.send_btn, { backgroundColor: C.primary, shadowColor: C.primary }]} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="large" color={C.secondary} />
          ) : (
            <Image source={require("../assets/image/send.png")} style={{ width: "60%", height: "60%" }} />
          )}
        </Pressable>

        <Pressable
          testID="send-photo-caption-pattern-button"
          onPress={turnOnCaptionPattern}
          style={[styles.close_btn, { backgroundColor: C.btnGhostBg, borderWidth: 1.5, borderColor: C.btnGhostBorder }, loading && { opacity: 0.4 }]}
          disabled={loading}
        >
          <Image source={require("../assets/image/sparkle.png")} style={{ width: "55%", height: "55%", tintColor: C.btnGhostIcon }} resizeMode="contain" />
        </Pressable>
      </View>

      <View style={styles.friend_list} testID="send-photo-friend-list">
        <View style={styles.friend}>
          <Pressable
            testID="send-photo-all-friends-button"
            onPress={chooseAllFriend}
            style={[
              styles.gray_circle_border,
              { borderColor: allFriend ? C.primary : C.border },
            ]}
          >
            <Image
              source={require("../assets/image/image.png")}
              style={{ width: "90%", height: "90%" }}
              resizeMode="contain"
            />
          </Pressable>
              <Text style={{ fontSize: 14, color: C.textPrimary }}>Tất cả</Text>
        </View>

        <FlatList
          testID="send-photo-friends-flatlist"
          horizontal
          showsHorizontalScrollIndicator={false}
          data={friends}
          keyExtractor={(item) => item.friendReqId}
          renderItem={({ item }) => (
            <View style={styles.friend}>
              <Pressable
                testID={`send-photo-friend-${item.userId}`}
                onPress={() => toggleSingleFriend(item.userId)}
                style={[
                  styles.gray_circle_border,
                  {
                    borderColor: !allFriend && checkReceiver(item.userId)
                      ? C.primary
                      : C.border,
                  },
                ]}
              >
                <Image
                  source={
                    item.avatarUrl
                      ? { uri: optimizeCloudinaryUrl(item.avatarUrl) }
                      : require("../assets/image/avt.png")
                  }
                  style={{ width: "100%", height: "100%", borderRadius: 100 }}
                />
              </Pressable>
              <Text style={{ fontSize: 14, color: C.textPrimary }}>
                {item.username}
              </Text>
            </View>
          )}
        />
      </View>

      {onCaptionPattern && (
        <View
          onTouchEnd={() => {
            setOnCaptionPattern(false);
            setShowInput(false);
          }}
          style={[styles.mask, { backgroundColor: C.modalOverlay }]}
        />
      )}

      {onCaptionPattern && (
        <View style={[styles.caption_pattern, { backgroundColor: C.panelBg, borderColor: C.panelBorder }]} testID="send-photo-caption-panel">
          <View style={{ width: 45, height: 7, borderRadius: 5, backgroundColor: C.dragHandle, marginTop: 10 }} />
          <Text style={[styles.general_text, { margin: 15, fontSize: 20, color: C.textPrimary }]}>Chú thích</Text>
          <View style={styles.general}>
            <Text style={[styles.general_text, { color: C.textSecondary }]}>General</Text>
            <View style={styles.box_area}>
              <Pressable testID="caption-text-button" onPress={() => { setOnCaptionPattern(false); setTimeout(() => inputRef.current?.focus(), 300); }}
                style={[styles.box_radius, { backgroundColor: C.captionBoxBg, borderColor: C.captionBoxBorder }]}>
                <Text style={[styles.text_caption, { color: C.captionBoxText }]}>Aa Văn bản</Text>
              </Pressable>
              <Pressable testID="caption-time-button" onPress={() => { const now = new Date(); applyCaption(`⏰ ${now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", hour12: false })}`); }}
                style={[styles.box_radius, { backgroundColor: C.captionBoxBg, borderColor: C.captionBoxBorder }]}>
                <Text style={[styles.text_caption, { color: C.captionBoxText }]}>⏰ 10:27</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.decorative}>
            <Text style={[styles.general_text, { color: C.textSecondary }]}>Decorative</Text>
            <View style={styles.box_area}>
              <Pressable testID="caption-party-button" onPress={() => applyCaption("Party Time!")} style={[styles.box_radius, { backgroundColor: Colors.cyan }]}>
                <Text style={[styles.text_caption, { color: Colors.black }]}>Party Time!</Text>
              </Pressable>
              <Pressable testID="caption-ootd-button" onPress={() => applyCaption("🕶️ OOTD")} style={[styles.box_radius, { backgroundColor: Colors.white }]}>
                <Text style={[styles.text_caption, { color: Colors.black }]}>🕶️ OOTD</Text>
              </Pressable>
              <Pressable testID="caption-missyou-button" onPress={() => applyCaption("🥰 Miss you")} style={[styles.box_radius, { backgroundColor: Colors.organce }]}>
                <Text style={[styles.text_caption, { color: C.textPrimary }]}>🥰 Miss you</Text>
              </Pressable>
              <Pressable testID="caption-iloveyou-button" onPress={() => applyCaption("😍 I love you")} style={[styles.box_radius, { backgroundColor: Colors.red }]}>
                <Text style={[styles.text_caption, { color: '#ffffff' }]}>😍 I love you</Text> {/* White text for contrast on red background */}
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

export default SendPhotoScreen;
