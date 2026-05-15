import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FriendDTO } from '../../types';
import { optimizeCloudinaryUrl } from '../../utils/cloudinary';
import { useColors } from '../../hook/useColors';

interface Props {
  item: FriendDTO;
  onPress: () => void;
  testID?: string;
}

const FriendRow: React.FC<Props> = ({ item, onPress, testID }) => {
  const C = useColors();

  const getAvatarSource = () => {
    if (item._id === 'ALL') return require('../../assets/image/image.png');
    if (item.avatarUrl) return { uri: optimizeCloudinaryUrl(item.avatarUrl) };
    return require('../../assets/image/avt.png');
  };

  return (
    <TouchableOpacity
      testID={testID || `friend_row_${item._id}`}
      style={[styles.container, { borderBottomColor: C.border }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={item._id === 'ALL' ? 'Chọn tất cả bạn bè' : `Chọn ${item.fullname}`}
    >
      <View style={[styles.avatarContainer, { backgroundColor: C.surface }]}>
        <Image
          source={getAvatarSource()}
          style={item._id === 'ALL' ? [styles.smallIcon, { tintColor: C.textSecondary }] : styles.fullImage}
          resizeMode={item._id === 'ALL' ? 'contain' : 'cover'}
        />
      </View>
      <Text 
        style={[styles.name, { color: C.textPrimary }]}
        accessibilityRole="text"
      >
        {item.fullname}
      </Text>
      <Image
        source={require('../../assets/image/right_arrow.png')}
        style={[styles.arrow, { tintColor: C.textHint }]}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
  },
  avatarContainer: {
    width: 34, height: 34, borderRadius: 17,
    justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
  },
  fullImage: { width: '100%', height: '100%' },
  smallIcon: { width: 38, height: 38 },
  name: { flex: 1, marginLeft: 12, fontSize: 16, fontWeight: '500' },
  arrow: { width: 15, height: 15 },
});

export default FriendRow;
