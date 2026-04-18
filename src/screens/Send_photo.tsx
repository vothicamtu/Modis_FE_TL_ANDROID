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
} from "react-native";
import Colors from "../styles/color";
import { useNavigation, NavigationProp} from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/Navigation";
import { optimizeCloudinaryUrl } from "../utils/cloudinary";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { friendsService } from "../services/friends.service";
import { Friend } from "../types/friend/Friend";
import AsyncStorage from "@react-native-async-storage/async-storage";
import postController from "../controller/post.controller";
import { PostRequest, PostResponse } from "../types";
import { SafeAreaView } from "react-native-safe-area-context";

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


  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      setShowInput(true);
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setShowInput(false);
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

    // Gọi thẳng service với userId đã có sẵn, không qua controller
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

  //  SAVE IMAGE 
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
      console.log("Caption đang gửi:", caption);

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
      globalThis.__NEW_POST__ = newPost;

      navigation.goBack();
    } catch (e: any) {
      console.error("Send post error:", e?.response?.status, e?.response?.data, e?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} testID="send-photo-screen">
      {/*TOP BAR*/}
      <View style={styles.send_to}>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: Colors.text_primary }}>
          Gửi đến ...
        </Text>

        <Pressable testID="send-photo-download-button" onPress={saveImage} style={styles.download_btn}>
          <Image
            source={require("../assets/image/download.png")}
            style={{ width: 22, height: 22, tintColor: Colors.text_primary }}
          />
        </Pressable>
      </View>

      {/*IMAGE PREVIEW*/}
      <View style={styles.image_area} testID="send-photo-preview-area">
        <Image testID="send-photo-preview-image" source={{ uri: photoUri }} style={styles.image} />

        <Animated.View style={[styles.saveImageNoti, { opacity }]}>
          <Text style={{ fontSize: 18, color: Colors.text_primary, fontWeight: "bold" }}>
            Đã lưu ảnh
          </Text>
        </Animated.View>

        <View style={[styles.caption_image, { bottom: showInput ? 100 : 80 }]}>
          <TextInput
            testID="send-photo-caption-input"
            ref={inputRef}
            style={{
              color: Colors.white,
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: "center",
              minWidth: 100,
            }}
            value={caption}
            onChangeText={setCaption}
            placeholder="Thêm một tin nhắn"
            placeholderTextColor="rgba(255,255,255,0.7)"
          />
        </View>
      </View>

      {/*SEND BAR*/}
      <View style={styles.send_btn_area}>
        <Pressable
          testID="send-photo-close-button"
          onPress={() => navigation.goBack()}
          style={[styles.close_btn, loading && { opacity: 0.4 }]}
          disabled={loading}
        >
          <Image
            source={require("../assets/image/close.png")}
            style={{ width: "55%", height: "55%", tintColor: Colors.white }}
            resizeMode="contain"
          />
        </Pressable>

        <Pressable
          testID="send-photo-send-button"
          onPress={sendPost}
          style={styles.send_btn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#4DA6FF" />
          ) : (
            <Image
              source={require("../assets/image/send.png")}
              style={{ width: "60%", height: "60%" }}
            />
          )}
        </Pressable>

        <Pressable
          testID="send-photo-caption-pattern-button"
          onPress={turnOnCaptionPattern}
          style={[styles.close_btn, loading && { opacity: 0.4 }]}
          disabled={loading}
        >
          <Image
            source={require("../assets/image/sparkle.png")}
            style={{ width: "55%", height: "55%", tintColor: Colors.white }}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      {/*FRIEND LIST*/}
      <View style={styles.friend_list} testID="send-photo-friend-list">
        <View style={styles.friend}>
          <Pressable
            testID="send-photo-all-friends-button"
            onPress={chooseAllFriend}
            style={[
              styles.gray_circle_border,
              { borderColor: allFriend ? Colors.accent_blue : Colors.light_gray },
            ]}
          >
            <Image
              source={require("../assets/image/image.png")}
              style={{ width: "90%", height: "90%" }}
              resizeMode="contain"
            />
          </Pressable>
          <Text style={{ fontSize: 14, color: Colors.text_primary }}>Tất cả</Text>
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
                      ? Colors.accent_blue
                      : Colors.light_gray,
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
              <Text style={{ fontSize: 14, color: Colors.text_primary }}>
                {item.username}
              </Text>
            </View>
          )}
        />
      </View>

      {/*CAPTION PATTERN OVERLAY*/}
      {onCaptionPattern && (
        <View
          onTouchEnd={() => {
            setOnCaptionPattern(false);
            setShowInput(false);
          }}
          style={styles.mask}
        />
      )}

      {onCaptionPattern && (
        <View style={styles.caption_pattern} testID="send-photo-caption-panel">
        <View
          style={{
            width: 45,
            height: 7,
            borderRadius: 5,
            backgroundColor: Colors.light_gray,
            marginTop: 10,
          }}
        />

        <Text style={[styles.general_text, { margin: 15, fontSize: 20 }]}>
          Chú thích
        </Text>

        <View style={styles.general}>
          <Text style={[styles.general_text, { color: Colors.light_gray }]}>
            General
          </Text>
          <View style={styles.box_area}>
            <Pressable
              testID="caption-text-button"
              onPress={() => {
                setOnCaptionPattern(false);
                setTimeout(() => inputRef.current?.focus(), 300);
              }}
              style={styles.box_radius}
            >
              <Text style={styles.text_caption}>Aa Văn bản</Text>
            </Pressable>

            <Pressable
              testID="caption-time-button"
              onPress={() => {
                const now = new Date();
                const time = now.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                });
                applyCaption(`⏰ ${time}`);
              }}
              style={styles.box_radius}
            >
              <Text style={styles.text_caption}>⏰ 10:27</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.decorative}>
          <Text style={[styles.general_text, { color: Colors.light_gray }]}>
            Decorative
          </Text>
          <View style={styles.box_area}>
            <Pressable
              testID="caption-party-button"
              onPress={() => applyCaption("Party Time!")}
              style={[styles.box_radius, { backgroundColor: Colors.cyan }]}
            >
              <Text style={[styles.text_caption, { color: Colors.black }]}>Party Time!</Text>
            </Pressable>

            <Pressable
              testID="caption-ootd-button"
              onPress={() => applyCaption("🕶️ OOTD")}
              style={[styles.box_radius, { backgroundColor: Colors.white }]}
            >
              <Text style={[styles.text_caption, { color: Colors.black }]}>🕶️ OOTD</Text>
            </Pressable>

            <Pressable
              testID="caption-missyou-button"
              onPress={() => applyCaption("🥰 Miss you")}
              style={[styles.box_radius, { backgroundColor: Colors.organce }]}
            >
              <Text style={styles.text_caption}>🥰 Miss you</Text>
            </Pressable>

            <Pressable
              testID="caption-iloveyou-button"
              onPress={() => applyCaption("😍 I love you")}
              style={[styles.box_radius, { backgroundColor: Colors.red }]}
            >
              <Text style={styles.text_caption}>😍 I love you</Text>
            </Pressable>
          </View>
        </View>
        </View>
      )}
    </SafeAreaView>
  );
}

export default SendPhotoScreen;