import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ConversationItem } from '../../../services/messageService';
import { formatTime } from '../../../utils/dateUtils';
import { optimizeCloudinaryUrl } from '../../../utils/cloudinary';
import { useColors } from '../../../hook/useColors';

interface MessageItemProps {
  message: ConversationItem;
  onPress: () => void;
  testID?: string;
}

function MessageItem({ message, onPress, testID }: MessageItemProps) {
  const C = useColors();
  const avatarUri = message.partnerAvatar ? optimizeCloudinaryUrl(message.partnerAvatar) : null;
  const initial = (message.partnerName || '?')[0].toUpperCase();

  return (
    <TouchableOpacity
      testID={testID || `message_item_${message.conversationId || message.partnerId}`}
      style={[styles.itemContainer, { borderBottomColor: C.msgDivider }]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Cuộc trò chuyện với ${message.partnerName}, tin nhắn cuối: ${message.lastMessage}, ${formatTime(message.timestamp)}`}
    >
      <View style={styles.avatarWrapper}>
        {avatarUri ? (
          <Image 
            testID={`${testID || 'message_item'}_avatar`} 
            source={{ uri: avatarUri }} 
            style={[styles.avatarImage, { borderColor: C.primary }]} 
          />
        ) : (
          <View 
            testID={`${testID || 'message_item'}_avatar_fallback`} 
            style={[styles.avatarFallback, { backgroundColor: C.msgAvatarFallBg, borderColor: C.msgAvatarFallBd }]}
          >
            <Text style={[styles.avatarInitial, { color: C.msgAvatarInitial }]}>{initial}</Text>
          </View>
        )}
      </View>

      <View style={styles.contentContainer}>
        <Text 
          testID={`${testID || 'message_item'}_name`} 
          style={[styles.userName, { color: C.msgName }]} 
          numberOfLines={1}
          accessibilityRole="text"
        >
          {message.partnerName}
        </Text>
        <Text 
          testID={`${testID || 'message_item'}_last_message`} 
          style={[styles.lastMessage, { color: C.msgLastMsg }]} 
          numberOfLines={1}
          accessibilityRole="text"
        >
          {message.lastMessage}
        </Text>
      </View>

      <Text 
        testID={`${testID || 'message_item'}_time`} 
        style={[styles.timeText, { color: C.msgTime }]}
        accessibilityRole="text"
      >
        {formatTime(message.timestamp)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderBottomWidth: 1,
    backgroundColor: 'transparent',
  },
  avatarWrapper: { marginRight: 14 },
  avatarImage: {
    width: 52, height: 52, borderRadius: 26, borderWidth: 2,
  },
  avatarFallback: {
    width: 52, height: 52, borderRadius: 26,
    justifyContent: 'center', alignItems: 'center', borderWidth: 2,
  },
  avatarInitial: { fontSize: 20, fontWeight: '700' },
  contentContainer: { flex: 1 },
  userName: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  lastMessage: { fontSize: 13, lineHeight: 18 },
  timeText: { fontSize: 11, marginLeft: 8, alignSelf: 'flex-start', marginTop: 2 },
});

export default MessageItem;
