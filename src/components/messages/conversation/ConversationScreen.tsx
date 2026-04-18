import { View, StyleSheet } from 'react-native'; 
 import { useRef, useEffect } from 'react'; 
 import Conversation from './Conversation'; 
 import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler'; 
 import { useChat } from '../../../socket/hooks/useChat'; 
 import { runOnJS } from 'react-native-reanimated'; 
 import { RouteProp, useRoute, useNavigation } from '@react-navigation/native'; 
 import { RootStackParamList } from '../../../navigation/Navigation'; 
 import { NativeStackNavigationProp } from '@react-navigation/native-stack'; 
 import color from '../../../styles/color'; 
 
 const styles = StyleSheet.create({ 
     container: { flex: 1, backgroundColor: color.neutral_dark1 }, 
 }); 
 
 function ConversationScreen() { 
     const route = useRoute<RouteProp<RootStackParamList, 'ConversationScreen'>>(); 
     const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>(); 
 
     // thêm initialMessage vào destructure 
     const { conversationId, receiverId, receiverName, receiverAvatar, initialMessage } = route.params; 
 
     const { messages, sendMessage, isConnected, isLoading } = useChat({ 
         conversationId, 
         receiverId, 
     }); 
 
     // tự gửi initialMessage khi WebSocket connect xong 
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
         <GestureHandlerRootView style={{ flex: 1 }}> 
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
