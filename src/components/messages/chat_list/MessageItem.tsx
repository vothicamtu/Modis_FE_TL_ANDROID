import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ConversationItem } from '../../../services/messageService';
import { formatTime } from '../../../utils/dateUtils';
import { optimizeCloudinaryUrl } from '../../../utils/cloudinary';
import { useColors } from '../../../hook/useColors';

interface MessageItemProps {
  message: ConversationItem;
  onPress: () => void;
}

function MessageItem({ message, onPress }: MessageItemProps) {
  const C = useColors();
  const avatarUri = message.partnerAvatar ? optimizeCloudinaryUrl(message.partnerAvatar) : null;
  const initial = (message.partnerName || '?')[0].toUpperCase();

  return (
    <TouchableOpacity
      testID={`message-item-${message.conversationId || message.partnerId}`}
      style={[styles.itemContainer, { borderBottomColor: C.msgDivider }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.avatarWrapper}>
        {avatarUri ? (
          <Image testID="message-item-avatar" source={{ uri: avatarUri }} style={[styles.avatarImage, { borderColor: C.primary }]} />
        ) : (
          <View testID="message-item-avatar-fallback" style={[styles.avatarFallback, { backgroundColor: C.msgAvatarFallBg, borderColor: C.msgAvatarFallBd }]}>
            <Text style={[styles.avatarInitial, { color: C.msgAvatarInitial }]}>{initial}</Text>
          </View>
        )}
      </View>

      <View style={styles.contentContainer}>
        <Text testID="message-item-name" style={[styles.userName, { color: C.msgName }]} numberOfLines={1}>{message.partnerName}</Text>
        <Text testID="message-item-last-message" style={[styles.lastMessage, { color: C.msgLastMsg }]} numberOfLines={1}>{message.lastMessage}</Text>
      </View>

      <Text testID="message-item-time" style={[styles.timeText, { color: C.msgTime }]}>{formatTime(message.timestamp)}</Text>
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
