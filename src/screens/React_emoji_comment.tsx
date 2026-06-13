import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { styles } from "../styles/React_emoji_comment.styles";
import {
  View, StatusBar, Text, Image, Pressable, TextInput,
  Keyboard, Animated, Dimensions, Modal, TouchableOpacity, Alert,
  KeyboardEvent, Platform, PermissionsAndroid,
} from "react-native";
import EmojiPicker from "rn-emoji-keyboard";
import { useNavigation, NavigationProp, useFocusEffect } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { RootStackParamList } from "../navigation/types";
import TopBar from "../components/topBar/TopBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ImageFullItem } from "../types";
import postController from "../controller/post.controller";
import { FlatList } from "react-native-gesture-handler";
import { optimizeCloudinaryUrl } from "../utils/cloudinary";
import friendsController from "../controller/friends.controller";
import { on } from "../utils/eventBus";
import MessageService from "../services/messageService";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import RNFS from "react-native-fs";
import LinearGradient from "react-native-linear-gradient";
import { useColors } from "../hook/useColors";

const { height } = Dimensions.get("window");

type Props = {
  goToHome: () => void;
  goToMessage: () => void;
  goToProfile: () => void;
  panGesture: any;
};

function React_emoji_comment({ goToHome, goToMessage, goToProfile }: Props) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const C = useColors();

  const topBarHeight = 60; // paddingTop:4 + icon:44 + paddingBottom:12
  const imageHeight  = Math.floor(height * 0.55);

  const [userId, setUserId]               = useState<string | null>(null);
  const [friends, setFriends]             = useState<any[]>([]);
  const [postList, setPostList]           = useState<ImageFullItem[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [listActive, setListActive]       = useState(false);
  const [visiblePostId, setVisiblePostId] = useState<string | null>(null);

  const currentVisibleItem = useMemo(
    () => postList.find((p) => p._id === visiblePostId),
    [postList, visiblePostId]
  );
  const isMe = currentVisibleItem
    ? currentVisibleItem.senderId === userId
    : postList.length > 0 ? postList[0].senderId === userId : true;
  const reactedByUser = currentVisibleItem?.receivers?.filter((r: any) => r.icon !== null) || [];

  const currentIndexRef  = useRef(0);
  const visiblePostIdRef = useRef<string | null>(null);
  const postListRef      = useRef<ImageFullItem[]>([]);
  const userIdRef        = useRef<string | null>(null);
  const commentTextRef   = useRef("");

  const [showInput, setShowInput]         = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [commentText, setCommentText]     = useState("");
  const [isPickerOpen, setIsPickerOpen]   = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [reactedEmoji, setReactedEmoji]   = useState(0);
  const [showMenu, setShowMenu]           = useState(false);
  const [focused, setFocused]             = useState(false);

  const inputRef    = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList>(null);
  const opacity     = useRef(new Animated.Value(0)).current;
  const saveOpacity = useRef(new Animated.Value(0)).current;
  const AnimatedImage = Animated.createAnimatedComponent(Image);

  const reactions = useRef(
    Array.from({ length: 15 }).map(() => ({
      translateY: new Animated.Value(0),
      opacity: new Animated.Value(1),
    }))
  ).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 80 }).current;

  useEffect(() => { postListRef.current = postList; }, [postList]);
  useEffect(() => { visiblePostIdRef.current = visiblePostId; }, [visiblePostId]);
  useEffect(() => { userIdRef.current = userId; }, [userId]);

  useFocusEffect(
    React.useCallback(() => {
      setListActive(true);
      const newPost = (globalThis as any).__NEW_POST__;
      (globalThis as any).__NEW_POST__ = null;
      if (newPost?._id) setPostList((prev) => [newPost, ...prev]);
      return () => setListActive(false);
    }, [])
  );

  useEffect(() => { AsyncStorage.getItem("userId").then(setUserId); }, []);

  useEffect(() => {
    if (!userId) return;
    friendsController.getFriends().then(setFriends).catch(console.error);
    const off = on("friendsUpdated", () => {
      friendsController.getFriends().then(setFriends).catch(console.error);
    });
    return off;
  }, [userId]);

  useEffect(() => { if (userId) fetchPosts(); }, [userId]);

  useEffect(() => {
    if (!selectedUserId) return;
    if (selectedUserId === "MINE") { fetchMyPosts(); return; }
    if (selectedUserId === "ALL")  { fetchPosts();   return; }
    fetchPostsByUserId(selectedUserId);
  }, [selectedUserId]);

  const friendMap = useMemo(
    () => Object.fromEntries(friends.map((f: any) => [f.userId || f._id, f])),
    [friends]
  );

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e: KeyboardEvent) => {
      setKeyboardHeight(e.endCoordinates.height);
      setShowInput(true);
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
      setTimeout(() => setShowInput(false), 100);
    });
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  const fetchPosts = async () => {
    if (!userId) return;
    const res = await postController.filterPosts({ userId, type: "ALL", senderId: null, viewMode: "LIST", page: 0, size: 20 });
    setPostList(res.data);
  };
  const fetchMyPosts = async () => {
    if (!userId) return;
    const res = await postController.filterPosts({ userId, type: "MINE", senderId: null, viewMode: "LIST", page: 0, size: 20 });
    setPostList(res.data as ImageFullItem[]);
  };
  const fetchPostsByUserId = async (senderId: string | null) => {
    if (!userId) return;
    const res = await postController.filterPosts({ userId, type: "FROM_SENDER", senderId, viewMode: "LIST", page: 0, size: 20 });
    setPostList(res.data as ImageFullItem[]);
  };
  const reactToPost = async (postId: string | null, reaction: string) => {
    if (!postId || !userId) return;
    const updated = await postController.reactToPost({ postId, senderId: userId, reaction });
    setPostList((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
  };

  const handlePress = () => {
    setShowInput(true);
    setKeyboardHeight(0); 
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };
  const handleCommentChange = (text: string) => {
    commentTextRef.current = text;
    setCommentText(text);
  };

  const handleSendComment = useCallback(async () => {
    const text   = commentTextRef.current.trim();
    const uid    = userIdRef.current;
    const postId = visiblePostIdRef.current;
    const list   = postListRef.current;
    if (!text || !uid) return;
    const currentPost = list.find((p) => p._id === postId);
    if (!currentPost || currentPost.senderId === uid) return;
    commentTextRef.current = "";
    setCommentText("");
    Keyboard.dismiss();
    let conversationId = "new";
    try {
      const conversations = await MessageService.loadConversations();
      const existing = conversations.find((c) => c.partnerId === currentPost.senderId);
      if (existing?.conversationId) conversationId = existing.conversationId;
    } catch (e) { console.error("Không load được conversations:", e); }
    navigation.navigate("ConversationScreen", {
      conversationId,
      receiverId: currentPost.senderId,
      receiverName: currentPost.senderName,
      receiverAvatar: currentPost.senderAvatar,
      initialMessage: text,
      initialImageUrl: currentPost.urlImage,
    });
  }, [navigation]);

  const handleSaveImage = async () => {
    const post = postListRef.current.find((p) => p._id === visiblePostIdRef.current);
    if (!post?.urlImage) return;
    try {
      if (Platform.OS === 'android' && Platform.Version < 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Cần quyền truy cập', 'Vui lòng cấp quyền lưu ảnh trong cài đặt');
          return;
        }
      }

      const filename = `modis_${Date.now()}.jpg`;
      const destPath = `${RNFS.PicturesDirectoryPath}/Modis/${filename}`;
      await RNFS.mkdir(`${RNFS.PicturesDirectoryPath}/Modis`);

      const result = await RNFS.downloadFile({
        fromUrl: post.urlImage,
        toFile: destPath,
        background: false,
      }).promise;

      if (result.statusCode !== 200) {
        throw new Error(`Download failed: ${result.statusCode}`);
      }
      await RNFS.scanFile(destPath);

      Animated.sequence([
        Animated.timing(saveOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.delay(1500),
        Animated.timing(saveOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    } catch (e) {
      console.error('Save image error:', e);
      Alert.alert('Lưu ảnh thất bại', 'Không thể lưu ảnh vào thư viện');
    }
  };

  const handleDeleteImage = () => {
    Alert.alert("Xóa ảnh", "Bạn có chắc muốn xóa ảnh này không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa", style: "destructive",
        onPress: async () => {
          const postId = visiblePostIdRef.current;
          const uid    = userIdRef.current;
          if (!postId || !uid) return;
          try {
            await (postController as any).deletePost(postId, uid);
            setPostList((prev) => prev.filter((p) => p._id !== postId));
          } catch { Alert.alert("Xóa thất bại"); }
        },
      },
    ]);
  };

  const handleReact = (emoji: string) => {
    setSelectedEmoji(emoji);
    setReactedEmoji((prev) => prev + 1);
    runReactionAnimation();
    reactToPost(visiblePostIdRef.current, emoji);
  };
  const handleEmojiSelected = (emoji: any) => { setIsPickerOpen(false); handleReact(emoji.emoji); };

  const runReactionAnimation = () => {
    reactions.forEach((anim, i) => {
      anim.translateY.setValue(0);
      anim.opacity.setValue(1);
      Animated.parallel([
        Animated.timing(anim.translateY, { toValue: -400 - Math.random() * 100, duration: 1000, delay: i * 60, useNativeDriver: true }),
        Animated.timing(anim.opacity,    { toValue: 0, duration: 1000, delay: i * 120, useNativeDriver: true }),
      ]).start();
    });
  };

  const timeAgo = (dateString: string): string => {
    if (!dateString) return "";
    const created = new Date(dateString);
    if (isNaN(created.getTime())) return "";
    const diffMs      = Math.max(0, Date.now() - created.getTime());
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours   = Math.floor(diffMinutes / 60);
    const diffDays    = Math.floor(diffHours / 24);
    if (diffSeconds < 60) return "vừa xong";
    if (diffMinutes < 60) return `${diffMinutes}p`;
    if (diffHours   < 24) return `${diffHours}h`;
    if (diffDays    <  7) return `${diffDays}d`;
    return created.toLocaleDateString("vi-VN");
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems.length === 0) return;
      const first = viewableItems[0];
      if (!first?.item) return;
      currentIndexRef.current  = first.index ?? 0;
      visiblePostIdRef.current = first.item._id;
      setVisiblePostId(first.item._id);
    }
  ).current;

  return (
    <View 
      style={{ flex: 1, backgroundColor: C.bgGradient[0] }} 
      testID="home_feed_screen"
      accessibilityLabel="home_feed_screen"
    >
      <LinearGradient colors={C.bgGradient} style={styles.container}>
        <StatusBar backgroundColor={C.bgGradient[0]} barStyle={C.statusBar} translucent />

        <SafeAreaView edges={['top']} style={{ backgroundColor: C.bgGradient[0] }}>
          <View style={{ paddingTop: 4 }}>
            <TopBar
                variant="filter"
                goToMessage={goToMessage}
                goToProfile={goToProfile}
                onSelectedUserId={setSelectedUserId}
                canTransform={true}
                showBackButton={true}
                onBackPress={goToHome}
              />
          </View>
        </SafeAreaView>

        <FlatList
          ref={flatListRef}
          testID="feed_flatlist"
          extraData={postList}
          style={styles.post_list}
          data={listActive ? postList.filter((p) => p?._id) : []}
          keyExtractor={(item) => item?._id ?? Math.random().toString()}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={false}
          pagingEnabled
          snapToAlignment="start"
          decelerationRate="fast"
          keyboardShouldPersistTaps="handled"
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
          windowSize={5}
          maxToRenderPerBatch={2}
          initialNumToRender={1}
          getItemLayout={(_, index) => ({ length: height, offset: height * index, index })}
          onScrollToIndexFailed={(info) => {
            flatListRef.current?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: false });
          }}
          accessibilityRole="list"
          accessibilityLabel="feed_flatlist"
          renderItem={({ item }) => (
            <View 
              testID={`feed_post_item_${item._id}`} 
              style={[styles.post_item, { height }]}
              accessibilityRole="none"
              accessibilityLabel={`feed_post_item_${item._id}`}
            >
              <View style={{ flex: 1, flexDirection: 'column', paddingBottom: 32, paddingTop: 12 }}>

                <View style={{ height: 0 }} />

                <View style={styles.image_area}>
                  <AnimatedImage
                    testID={`feed_post_image_${item._id}`}
                    source={{ uri: optimizeCloudinaryUrl(item.urlImage) }}
                    style={[styles.image, { height: imageHeight, opacity }]}
                    resizeMode="cover"
                    accessibilityLabel={`feed_post_image_${item._id}`}
                    onLoadEnd={() => {
                      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
                    }}
                  />
                  <View style={styles.caption_image}>
                    <View style={{
                      backgroundColor: 'rgba(0,0,0,0.4)', // Dark translucent overlay for both modes
                      borderRadius: 12,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      maxWidth: '90%',
                    }}>
                      <Text 
                        testID={`feed_post_caption_${item._id}`} 
                        style={[styles.general_text, { 
                          fontSize: 16, 
                          textAlign: "center", 
                          color: '#FFFFFF' // Always white text for readability
                        }]}
                        accessibilityRole="text"
                        accessibilityLabel={`feed_post_caption_${item._id}`}
                      >
                        {item.caption}
                      </Text>
                    </View>
                  </View>
                  <Pressable 
                    testID={`feed_menu_button_${item._id}`} 
                    onPress={() => setShowMenu(true)} 
                    style={[styles.menu_btn_overlay, { backgroundColor: 'rgba(0,0,0,0.4)' }]}
                    accessibilityRole="button"
                    accessibilityLabel={`feed_menu_button_${item._id}`}
                  >
                    <Image
                      source={require("../assets/image/pending.png")}
                      style={{ width: "55%", height: "55%", tintColor: '#FFFFFF' }} // Always white icon
                      resizeMode="contain"
                    />
                  </Pressable>
                </View>

                <View style={styles.infoImage}>
                  <View style={styles.gray_circle_border}>
                    <Image 
                      testID={`feed_sender_avatar_${item._id}`} 
                      source={{ uri: optimizeCloudinaryUrl(item.senderAvatar) }} 
                      style={{ width: "100%", height: "100%" }} 
                      accessibilityLabel={`feed_sender_avatar_${item._id}`}
                    />
                  </View>
                  <Text 
                    testID={`feed_sender_name_${item._id}`} 
                    style={[styles.general_text, { marginLeft: 5, color: C.textPrimary }]}
                    accessibilityRole="text"
                    accessibilityLabel={`feed_sender_name_${item._id}`}
                  >
                    {(() => {
                      const name = item.senderId === userId ? "Tôi" : item.senderName;
                      if (!name) return name;
                      const words = name.trim().split(/\s+/);
                      return words.length >= 3 ? words.slice(-2).join(' ') : name;
                    })()}
                  </Text>
                  <Text 
                    testID={`feed_post_time_${item._id}`} 
                    style={{ fontSize: 12, fontWeight: "600", color: C.textHint, marginLeft: 8 }}
                    accessibilityRole="text"
                    accessibilityLabel={`feed_post_time_${item._id}`}
                  >
                    {timeAgo(item.created_at)}
                  </Text>
                  <Pressable 
                    testID="feed_grid_view_button" 
                    onPress={() => navigation.navigate("AllImagesScreen")} 
                    style={[styles.grid_btn, { backgroundColor: C.btnGhostBg, borderColor: C.btnGhostBorder }]}
                    accessibilityRole="button"
                    accessibilityLabel="feed_grid_view_button"
                  >
                    <Image
                      source={require("../assets/image/grid_view.png")}
                      style={{ width: 18, height: 18, tintColor: C.btnGhostIcon }}
                      resizeMode="contain"
                    />
                    <Text style={{ color: C.btnGhostIcon, fontSize: 14, fontWeight: "600", marginLeft: 6 }}>Xem tất cả</Text>
                  </Pressable>
                </View>

                <View style={styles.action_row}>
                  {isMe ? (
                    <View 
                      testID={`feed_reactions_received_${item._id}`} 
                      style={[styles.reacted_for_me_box, { backgroundColor: C.surfaceStrong, borderColor: C.primary, shadowColor: C.primary }]}
                      accessibilityRole="none"
                      accessibilityLabel={`feed_reactions_received_${item._id}`}
                    >
                      {reactedByUser.length === 0 ? (
                        <Text 
                          style={{ color: C.textSecondary, fontSize: 14, fontWeight: "600" }}
                          accessibilityRole="text"
                        >
                          Chưa có hoạt động nào
                        </Text>
                      ) : (
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          {reactedByUser.map((user: any, index: number) => {
                            const friendInfo = friendMap[user.receiverId];
                            const avatarUri = friendInfo?.avatarUrl
                              ? optimizeCloudinaryUrl(friendInfo.avatarUrl)
                              : "https://res.cloudinary.com/dfz0xsh2d/image/upload/v1714207865/avatar-default_yom2p1.png";
                            return (
                              <View key={index} style={{
                                width: 36, height: 36, borderRadius: 18,
                                borderWidth: 2, borderColor: C.surfaceStrong,
                                marginLeft: index > 0 ? -10 : 0,
                                backgroundColor: C.border,
                                overflow: "hidden",
                              }}>
                                <Image source={{ uri: avatarUri }} style={{ width: "100%", height: "100%" }} />
                              </View>
                            );
                          })}
                        </View>
                      )}
                    </View>
                  ) : (
                    <View 
                      testID={`feed_react_comment_box_${item._id}`} 
                      style={[styles.react_comment_box, { backgroundColor: C.surfaceStrong, borderColor: C.primary, shadowColor: C.primary }]}
                      accessibilityRole="none"
                      accessibilityLabel={`feed_react_comment_box_${item._id}`}
                    >
                      <Pressable 
                        testID={`feed_comment_button_${item._id}`} 
                        onPress={handlePress} 
                        style={styles.comment}
                        accessibilityRole="button"
                        accessibilityLabel={`feed_comment_button_${item._id}`}
                      >
                        <Text style={{ color: C.textHint, fontSize: 15 }}>Gửi tin nhắn...</Text>
                      </Pressable>
                      {["❤️", "😊", "🤩"].map((emoji) => (
                        <Pressable 
                          testID={`feed_emoji_${emoji}_${item._id}`} 
                          key={emoji} 
                          onPress={() => handleReact(emoji)} 
                          style={styles.emoji_box}
                          accessibilityRole="button"
                          accessibilityLabel={`feed_emoji_${emoji}_${item._id}`}
                        >
                          <Text style={styles.emoji}>{emoji}</Text>
                        </Pressable>
                      ))}
                      <Pressable 
                        testID={`feed_more_emoji_button_${item._id}`} 
                        onPress={() => setIsPickerOpen(true)} 
                        style={styles.emoji_box_icon}
                        accessibilityRole="button"
                        accessibilityLabel={`feed_more_emoji_button_${item._id}`}
                      >
                        <Image
                          source={require("../assets/image/add_reaction.png")}
                          style={{ width: 22, height: 22, tintColor: C.textSecondary }}
                        />
                      </Pressable>
                    </View>
                  )}
                </View>

              </View>
            </View>
          )}
        />

        <View style={[
          styles.react_comment_box_hidden,
          { 
            bottom: showInput && keyboardHeight > 0 ? keyboardHeight + insets.bottom + 16 : (Platform.OS === 'ios' ? insets.bottom + 40 : insets.bottom + 60),
            backgroundColor: C.surfaceStrong,
            borderColor: C.secondary,
            shadowColor: C.secondary,
            zIndex: 1000,
            elevation: 15,
          },
          !showInput && { opacity: 0, pointerEvents: 'none' },
          focused && { 
            borderColor: C.primary, 
            backgroundColor: C.surfaceStrong, 
            shadowColor: C.primary, 
            shadowOpacity: 0.4, 
            shadowRadius: 10, 
            elevation: 12 
          }
        ]}>
            <TextInput
              testID="feed_comment_input"
              ref={inputRef}
              style={[styles.comment_input, { color: C.textPrimary }]}
              value={commentText}
              onChangeText={handleCommentChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Gửi tin nhắn..."
              placeholderTextColor={C.textHint}
              keyboardAppearance={C.statusBar === 'dark-content' ? 'light' : 'dark'}
              returnKeyType="send"
              blurOnSubmit={false}
              onSubmitEditing={handleSendComment}
              accessibilityRole="text"
              accessibilityLabel="feed_comment_input"
              accessible={true}
            />
            <Pressable 
              testID="feed_send_comment_button" 
              style={[
                styles.send_icon_wrapper, 
                { 
                  backgroundColor: C.primary,
                  zIndex: 1001,
                  pointerEvents: 'auto',
                }
              ]} 
              onPress={handleSendComment}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="feed_send_comment_button"
            >
              <Image
                source={require("../assets/image/send_message.png")}
                style={{ width: 20, height: 20, tintColor: C.btnPrimaryText }}
              />
            </Pressable>
          </View>

        <EmojiPicker onEmojiSelected={handleEmojiSelected} open={isPickerOpen} onClose={() => setIsPickerOpen(false)} />

        {reactedEmoji > 0 && reactions.map((anim, i) => (
          <Animated.View key={i} style={[styles.reacted_emoji, {
            right: Math.random() * 400,
            opacity: anim.opacity,
            transform: [{ translateY: anim.translateY }],
          }]}>
            <Text style={{ fontSize: 30 }}>{selectedEmoji}</Text>
          </Animated.View>
        ))}

        <Modal 
          testID="feed_menu_modal" 
          visible={showMenu} 
          transparent 
          animationType="slide" 
          onRequestClose={() => setShowMenu(false)}
          accessibilityViewIsModal={true}
        >
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <TouchableOpacity
              style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
              activeOpacity={1}
              onPress={() => setShowMenu(false)}
            >
              <View style={{ flex: 1, backgroundColor: C.modalOverlay }} />
            </TouchableOpacity>
            <View style={{
              backgroundColor: C.surfaceStrong,
              borderTopLeftRadius: 20, borderTopRightRadius: 20,
              paddingBottom: insets.bottom + 24, paddingTop: 8,
              borderTopWidth: 1, borderColor: C.border,
            }}>
              <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: C.dragHandle, alignSelf: "center", marginBottom: 16 }} />
              <TouchableOpacity
                testID="feed_menu_save_image"
                onPress={() => { setShowMenu(false); setTimeout(handleSaveImage, 300); }}
                style={{ paddingVertical: 16, paddingHorizontal: 24 }}
                accessibilityRole="button"
                accessibilityLabel="feed_menu_save_image"
              >
                <Text style={{ color: C.textPrimary, fontSize: 17 }}>Lưu ảnh</Text>
              </TouchableOpacity>
              {isMe && (
                <TouchableOpacity
                  testID="feed_menu_delete_image"
                  onPress={() => { setShowMenu(false); setTimeout(handleDeleteImage, 300); }}
                  style={{ paddingVertical: 16, paddingHorizontal: 24 }}
                  accessibilityRole="button"
                  accessibilityLabel="feed_menu_delete_image"
                >
                  <Text style={{ color: C.danger, fontSize: 17 }}>Xóa ảnh</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                testID="feed_menu_cancel"
                onPress={() => setShowMenu(false)}
                style={{ paddingVertical: 16, paddingHorizontal: 24, marginTop: 4 }}
                accessibilityRole="button"
                accessibilityLabel="feed_menu_cancel"
              >
                <Text style={{ color: C.textHint, fontSize: 17, textAlign: "center" }}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </LinearGradient>

      <Animated.View pointerEvents="none" style={{
        position: "absolute", alignSelf: "center", bottom: 160,
        backgroundColor: C.toastBg, borderRadius: 24,
        paddingHorizontal: 24, paddingVertical: 12, opacity: saveOpacity,
        flexDirection: 'row', alignItems: 'center',
        shadowColor: C.primary, shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 8, elevation: 12, zIndex: 999,
      }}>
        <Text style={{ fontSize: 15, color: C.textPrimary, fontWeight: "700" }}>Lưu ảnh thành công</Text>
      </Animated.View>
    </View>
  );
}

export default React_emoji_comment;
