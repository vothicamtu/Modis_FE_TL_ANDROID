import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ConversationItem } from '../../../services/messageService';
import { formatTime } from '../../../utils/dateUtils';
import color from '../../../styles/color';
import { optimizeCloudinaryUrl } from '../../../utils/cloudinary';

interface MessageItemProps {
  message: ConversationItem;
  onPress: () => void;
}

function MessageItem({ message, onPress }: MessageItemProps) {
  const avatarUri = message.partnerAvatar
    ? optimizeCloudinaryUrl(message.partnerAvatar)
    : null;
  const initial = (message.partnerName || '?')[0].toUpperCase();

  return (
    <TouchableOpacity testID={`message-item-${message.conversationId || message.partnerId}`} style={styles.itemContainer} onPress={onPress} activeOpacity={0.7}>

      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        {avatarUri ? (
          <Image testID="message-item-avatar" source={{ uri: avatarUri }} style={styles.avatarImage} />
        ) : (
          <View testID="message-item-avatar-fallback" style={styles.avatarFallback}>
            <Text style={styles.avatarInitial}>{initial}</Text>
          </View>
        )}
      </View>

      {/* Name + last message */}
      <View style={styles.contentContainer}>
        <Text testID="message-item-name" style={styles.userName} numberOfLines={1}>{message.partnerName}</Text>
        <Text testID="message-item-last-message" style={styles.lastMessage} numberOfLines={1}>{message.lastMessage}</Text>
      </View>

      {/* Timestamp */}
      <Text testID="message-item-time" style={styles.timeText}>{formatTime(message.timestamp)}</Text>

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
    borderBottomColor: 'rgba(159,165,174,0.2)',
    backgroundColor: 'transparent',
  },

  avatarWrapper: {
    marginRight: 14,
  },
  avatarImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: color.primary,
  },
  avatarFallback: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(124,111,171,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(124,111,171,0.3)',
  },
  avatarInitial: {
    color: color.accent,
    fontSize: 20,
    fontWeight: '700',
  },

  contentContainer: {
    flex: 1,
  },
  userName: {
    color: color.text_primary,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  lastMessage: {
    color: color.text_hint,
    fontSize: 13,
    lineHeight: 18,
  },

  timeText: {
    color: color.text_hint,
    fontSize: 11,
    marginLeft: 8,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
});

export default MessageItem;
