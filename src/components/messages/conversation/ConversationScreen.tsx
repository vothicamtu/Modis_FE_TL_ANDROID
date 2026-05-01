import { View } from 'react-native';
import { useRef, useEffect } from 'react';
import Conversation from './Conversation';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useChat } from '../../../socket/hooks/useChat';
import { runOnJS } from 'react-native-reanimated';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/Navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useColors } from '../../../hook/useColors';

function ConversationScreen() {
    const route = useRoute<RouteProp<RootStackParamList, 'ConversationScreen'>>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const C = useColors();

    const { conversationId, receiverId, receiverName, receiverAvatar, initialMessage } = route.params;

    const { messages, sendMessage, isConnected, isLoading } = useChat({
        conversationId,
        receiverId,
    });

    const hasSentInitial = useRef(false);
    useEffect(() => {
        if (initialMessage && isConnected && !hasSentInitial.current) {
            hasSentInitial.current = true;
            sendMessage(initialMessage);
        }
    }, [isConnected, initialMessage]);

    const goBack = () => navigation.goBack();
    const swipeGesture = Gesture.Pan()
        .activeOffsetX([-30, 30])
        .onEnd((e) => {
            if (e.translationX > 100) runOnJS(goBack)();
        });

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: C.convBg }}>
            <GestureDetector gesture={swipeGesture}>
                <View style={{ flex: 1 }}>
                    <Conversation
                        id={conversationId}
                        userName={receiverName}
                        avatarSource={receiverAvatar ? { uri: receiverAvatar } : require('../../../assets/image/avt.png')}
                        messages={messages}
                        onSendMessage={sendMessage}
                        isConnected={isConnected}
                        isLoading={isLoading}
                    />
                </View>
            </GestureDetector>
        </GestureHandlerRootView>
    );
}

export default ConversationScreen;
