import { useState, useRef, useEffect } from 'react';
import { styles } from './Conversation.styles';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    Image, View, Text, ActivityIndicator, FlatList,
    Pressable, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useColors } from '../../../hook/useColors';
import { optimizeCloudinaryUrl } from '../../../utils/cloudinary';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'other';
    imageUrl?: string;
}

interface ConversationProps {
    id: string;
    userName: string;
    avatarUrl?: string;
    avatarSource?: any;
    messages: Message[];
    onSendMessage?: (text: string, imageUrl?: string) => void;
    isConnected?: boolean;
    isLoading?: boolean;
}

function Conversation({ userName, avatarUrl, avatarSource, messages, onSendMessage, isLoading }: ConversationProps) {
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);
    const inputRef = useRef<TextInput>(null);
    const previousMessageCountRef = useRef(0);
    const pendingAutoScrollRef = useRef(false);
    const initialAutoScrollDoneRef = useRef(false);
    const imageSource = avatarSource ? avatarSource : { uri: avatarUrl };
    const [isNearBottom, setIsNearBottom] = useState(true);
    const navigation = useNavigation();
    const C = useColors();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        previousMessageCountRef.current = 0;
        pendingAutoScrollRef.current = false;
        initialAutoScrollDoneRef.current = false;
    }, [userName]);

    const scrollToLatestMessage = () => {
        [80, 240, 600, 1000].forEach((delay) => {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: delay > 80 });
            }, delay);
        });
    };

    useEffect(() => {
        const hasNewMessage = messages.length > previousMessageCountRef.current;
        const isInitialLoad = messages.length > 0 && !initialAutoScrollDoneRef.current;
        const shouldScrollToEnd = isInitialLoad || (hasNewMessage && (isNearBottom || messages[messages.length - 1]?.sender === 'user'));

        previousMessageCountRef.current = messages.length;

        if (shouldScrollToEnd) {
            pendingAutoScrollRef.current = true;
            initialAutoScrollDoneRef.current = true;
            scrollToLatestMessage();
            setTimeout(() => {
                pendingAutoScrollRef.current = false;
            }, 1200);
        }
    }, [messages]);

    const handleSend = () => {
        if (inputText.trim()) {
            if (onSendMessage) onSendMessage(inputText);
            setInputText('');
        }
    };

    const renderMessageItem = ({ item, index }: { item: Message; index: number }) => {
        const isUser = item.sender === 'user';
        return (
            <View
                testID={`conversation_message_${index}_${isUser ? 'sent' : 'received'}`}
                style={isUser ? styles.messageContainerRight : styles.messageContainer}
                accessibilityRole="text"
                accessibilityLabel={`conversation_message_${index}_${isUser ? 'sent' : 'received'}`}
            >
                {!isUser && (
                    <Image source={imageSource} style={[styles.smallAvatar, { borderColor: C.smallAvatarBd }]} />
                )}
                {isUser ? (
                    <View style={[styles.messageBubbleRight, { backgroundColor: C.bubbleSentBg, shadowColor: C.bubbleSentShadow }]}>
                        <Text style={[styles.messageTextRight, { color: C.bubbleSentText }]}>{item.text}</Text>
                        {item.imageUrl && (
                            <Image
                                testID={`conversation_message_${index}_sent_image`}
                                accessibilityLabel={`conversation_message_${index}_sent_image`}
                                source={{ uri: optimizeCloudinaryUrl(item.imageUrl) }}
                                style={styles.messageImage}
                                resizeMode="cover"
                            />
                        )}
                    </View>
                ) : (
                    <View style={[styles.messageBubble, { backgroundColor: C.bubbleRecvBg, borderColor: C.bubbleRecvBorder, shadowColor: C.bubbleRecvShadow }]}>
                        <Text style={[styles.messageText, { color: C.bubbleRecvText }]}>{item.text}</Text>
                        {item.imageUrl && (
                            <Image
                                testID={`conversation_message_${index}_received_image`}
                                accessibilityLabel={`conversation_message_${index}_received_image`}
                                source={{ uri: optimizeCloudinaryUrl(item.imageUrl) }}
                                style={styles.messageImage}
                                resizeMode="cover"
                            />
                        )}
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: C.convBg }} edges={['top']}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <View style={{ paddingTop: 4 }}>
                    <View 
                        testID="conversation_header" 
                        style={styles.headerContainer}
                        accessibilityRole="header"
                        accessibilityLabel="conversation_header"
                    >
                        <Pressable
                            testID="conversation_back_button"
                            onPress={() => navigation.goBack()}
                            hitSlop={8}
                            style={[styles.backButtonModern, { backgroundColor: C.msgBackBtn, shadowColor: C.msgBackBtnShadow }]}
                            accessibilityRole="button"
                            accessibilityLabel="conversation_back_button"
                        >
                            <Image
                                style={{ width: 22, height: 22, tintColor: C.msgIcon }}
                                source={require('../../../assets/image/left_arrow.png')}
                            />
                        </Pressable>
                        {avatarUrl || avatarSource ? (
                            <Image 
                                testID="conversation_avatar" 
                                source={imageSource} 
                                style={styles.avatar} 
                                accessibilityLabel="conversation_avatar"
                            />
                        ) : (
                            <View 
                                testID="conversation_avatar_fallback" 
                                style={[styles.avatar, styles.avatarFallback, { backgroundColor: C.msgAvatarFallBg }]}
                                accessibilityLabel="conversation_avatar_fallback"
                            >
                                <Text style={[styles.avatarInitial, { color: C.msgAvatarInitial }]}>
                                    {(userName || '?')[0].toUpperCase()}
                                </Text>
                            </View>
                        )}
                        <View style={styles.headerText}>
                            <Text 
                                testID="conversation_username" 
                                style={[styles.userName, { color: C.msgName }]}
                                accessibilityRole="text"
                                accessibilityLabel="conversation_username"
                            >
                                {userName}
                            </Text>
                        </View>
                    </View>
                </View>

                {isLoading ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={C.primary} />
                        <Text style={{ marginTop: 12, color: C.msgLastMsg, fontSize: 14 }}>
                            Đang tải tin nhắn...
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        ref={flatListRef}
                        testID="conversation_messages_list"
                        accessibilityLabel="conversation_messages_list"
                        data={messages}
                        renderItem={renderMessageItem}
                        keyExtractor={(item) => item.id}
                        style={{ flex: 1 }}
                        contentContainerStyle={{ 
                            paddingHorizontal: 16, 
                            paddingVertical: 16, 
                            gap: 2,
                            paddingBottom: Math.max(16, insets.bottom)
                        }}
                        onScroll={(event) => {
                            const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
                            setIsNearBottom(layoutMeasurement.height + contentOffset.y >= contentSize.height - 50);
                        }}
                        scrollEventThrottle={16}
                        accessibilityRole="list"
                        onContentSizeChange={() => {
                            if (pendingAutoScrollRef.current) {
                                flatListRef.current?.scrollToEnd({ animated: true });
                            }
                        }}
                        ListEmptyComponent={
                            <View style={{ alignItems: 'center', paddingTop: 60 }}>
                                <Text 
                                    style={{ color: C.msgEmptyHint, fontSize: 14 }}
                                    accessibilityRole="text"
                                >
                                    Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!
                                </Text>
                            </View>
                        }
                    />
                )}

                <View style={[
                    styles.inputContainer,
                    {
                        paddingBottom: Math.max(10, insets.bottom),
                        backgroundColor: C.convBg,
                        zIndex: 1000,
                        elevation: 10,
                    }
                ]}>
                    <View style={[styles.textInputWrapper, {
                        backgroundColor: C.inputWrapBg,
                        borderColor: C.inputWrapBorder,
                        shadowColor: C.inputWrapShadow,
                        shadowOpacity: 0.15,
                        zIndex: 1001,
                    }]}>
                        <TextInput
                            ref={inputRef}
                            testID="chat_input"
                            style={[styles.textInput, { color: C.textPrimary }]}
                            value={inputText}
                            onChangeText={setInputText}
                            placeholder="Nhắn tin..."
                            placeholderTextColor={C.textHint}
                            keyboardAppearance={C.statusBar === 'dark-content' ? 'light' : 'dark'}
                            multiline
                            returnKeyType="send"
                            blurOnSubmit={false}
                            onSubmitEditing={handleSend}
                            accessibilityRole="text"
                            accessibilityLabel="chat_input"
                            accessible={true}
                        />
                    </View>
                    <TouchableOpacity
                        testID="chat_send_button"
                        style={[
                            styles.sendButton, 
                            { 
                                backgroundColor: C.sendBtnBg, 
                                shadowColor: C.sendBtnShadow,
                                zIndex: 1002,
                                pointerEvents: 'auto',
                            }, 
                            !inputText.trim() && { 
                                opacity: 0.5,
                                backgroundColor: C.btnDisabled,
                                shadowOpacity: 0,
                                elevation: 0
                            }
                        ]}
                        onPress={handleSend}
                        disabled={!inputText.trim()}
                        activeOpacity={0.7}
                        accessibilityRole="button"
                        accessibilityLabel="chat_send_button"
                        accessibilityState={{ disabled: !inputText.trim() }}
                    >
                        <Image
                            source={require('../../../assets/image/send_message.png')}
                            style={{ width: 20, height: 20, tintColor: C.sendBtnIcon }}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default Conversation;
