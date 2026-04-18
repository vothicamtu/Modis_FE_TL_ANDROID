import { useState, useRef, useEffect } from 'react'; 
 import { styles } from './Conversation.styles'; 
 import { SafeAreaView } from 'react-native-safe-area-context'; 
 import color from '../../../styles/color'; 
 import { 
     Image, View, Text, ActivityIndicator, FlatList, 
     Pressable, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, 
 } from 'react-native'; 
 import { useNavigation } from '@react-navigation/native'; 
 
 interface Message { 
     id: string; 
     text: string; 
     sender: 'user' | 'other'; 
 } 
 
 interface ConversationProps { 
     id: string; 
     userName: string; 
     avatarUrl?: string; 
     avatarSource?: any; 
     messages: Message[]; 
     onSendMessage?: (text: string) => void; 
     isConnected?: boolean; 
     isLoading?: boolean; 
 } 
 
 function Conversation({ userName, avatarUrl, avatarSource, messages, onSendMessage, isConnected, isLoading }: ConversationProps) { 
     const [inputText, setInputText] = useState(''); 
     const flatListRef = useRef<FlatList>(null); 
     const imageSource = avatarSource ? avatarSource : { uri: avatarUrl }; 
     const [isNearBottom, setIsNearBottom] = useState(true); 
     const navigation = useNavigation(); 
 
     useEffect(() => { 
         if (isNearBottom) { 
             setTimeout(() => { 
                 flatListRef.current?.scrollToEnd({ animated: true }); 
             }, 100); 
         } 
     }, [messages]); 
 
     const handleSend = () => { 
         if (inputText.trim()) { 
             if (onSendMessage) onSendMessage(inputText); 
             setInputText(''); 
         } 
     }; 
 
     const renderMessageItem = ({ item }: { item: Message }) => { 
         const isUser = item.sender === 'user'; 
         return ( 
             <View 
                 testID={isUser ? 'message-sent' : 'message-received'} 
                 style={isUser ? styles.messageContainerRight : styles.messageContainer} 
             > 
                 {!isUser && <Image source={imageSource} style={styles.smallAvatar} />} 
                 <View style={isUser ? styles.messageBubbleRight : styles.messageBubble}> 
                     <Text style={isUser ? styles.messageTextRight : styles.messageText}>{item.text}</Text> 
                 </View> 
             </View> 
         ); 
     }; 
 
     return ( 
         <SafeAreaView style={{ flex: 1, backgroundColor: '#f0eeff' }} edges={['top']}> 
             <KeyboardAvoidingView 
                 style={{ flex: 1 }} 
                 behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                 keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24} 
             > 
                 {/* Header — đồng bộ với TopBar: paddingTop:4 bên ngoài + paddingBottom:12 bên trong */} 
                 <View style={{ paddingTop: 4 }}>
                 <View testID="conversation-header" style={styles.headerContainer}> 
                     <Pressable testID="conversation-back-button" onPress={() => navigation.goBack()} hitSlop={8}
                         style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', marginRight: 8, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}
                     > 
                         <Image 
                             style={{ width: 22, height: 22, tintColor: color.text_primary }}
                             source={require('../../../assets/image/left_arrow.png')} 
                         /> 
                     </Pressable> 
                     {avatarUrl || avatarSource ? ( 
                         <Image testID="conversation-avatar" source={imageSource} style={styles.avatar} /> 
                     ) : ( 
                         <View testID="conversation-avatar-fallback" style={[styles.avatar, styles.avatarFallback]}> 
                             <Text style={styles.avatarInitial}> 
                                 {(userName || '?')[0].toUpperCase()} 
                             </Text> 
                         </View> 
                     )} 
                     <View style={styles.headerText}> 
                         <Text testID="conversation-username" style={styles.userName}>{userName}</Text> 
                         {isConnected !== undefined && ( 
                             <Text testID="conversation-online-status" style={styles.onlineStatus}> 
                                 {isConnected ? '● Online' : 'Offline'} 
                             </Text> 
                         )} 
                     </View> 
                 </View> 
                 </View>{/* end paddingTop:4 */}
 
                 {/* Message list */} 
                 {isLoading ? ( 
                     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}> 
                         <ActivityIndicator size="large" color={color.primary} /> 
                         <Text style={{ marginTop: 12, color: color.text_hint, fontSize: 14 }}> 
                             Đang tải tin nhắn... 
                         </Text> 
                     </View> 
                 ) : ( 
                     <FlatList 
                         ref={flatListRef} 
                         data={messages} 
                         renderItem={renderMessageItem} 
                         keyExtractor={(item) => item.id} 
                         style={{ flex: 1 }} 
                         contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16, gap: 2 }} 
                         onScroll={(event) => { 
                             const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent; 
                             setIsNearBottom( 
                                 layoutMeasurement.height + contentOffset.y >= contentSize.height - 50 
                             ); 
                         }} 
                         scrollEventThrottle={16} 
                         ListEmptyComponent={ 
                             <View style={{ alignItems: 'center', paddingTop: 60 }}> 
                                 <Text style={{ color: color.text_hint, fontSize: 14 }}> 
                                     Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện! 
                                 </Text> 
                             </View> 
                         } 
                     /> 
                 )} 
 
                 {/* Input bar */} 
                 <View style={styles.inputContainer}> 
                     <View style={styles.textInputWrapper}> 
                         <TextInput 
                             testID="chat-input" 
                             style={styles.textInput} 
                             value={inputText} 
                             onChangeText={setInputText} 
                             placeholder="Nhắn tin..." 
                             placeholderTextColor={color.neutral_light1} 
                             multiline 
                             returnKeyType="send" 
                             onSubmitEditing={handleSend} 
                         /> 
                     </View> 
                     <TouchableOpacity 
                         testID="send-button" 
                         style={[styles.sendButton, !inputText.trim() && { opacity: 0.5 }]} 
                         onPress={handleSend} 
                         disabled={!inputText.trim()} 
                     > 
                         <Image 
                             source={require('../../../assets/image/send.png')} 
                             style={{ width: 20, height: 20, tintColor: color.white }} 
                         /> 
                     </TouchableOpacity> 
                 </View> 
             </KeyboardAvoidingView> 
         </SafeAreaView> 
     ); 
 } 
 
 export default Conversation;
