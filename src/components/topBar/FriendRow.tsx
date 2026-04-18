import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FriendDTO } from '../../types';
import Colors from '../../styles/color';
import { optimizeCloudinaryUrl } from '../../utils/cloudinary';

interface Props {
  item: FriendDTO;
  onPress: () => void;
}

const FriendRow: React.FC<Props> = ({ item, onPress }) => {

  // Hàm xử lý hiển thị Avatar
  const getAvatarSource = () => {
    if (item._id === 'ALL') {
       return require('../../assets/image/image.png'); 
    }
    if (item.avatarUrl) return { uri: optimizeCloudinaryUrl(item.avatarUrl) };
    return require('../../assets/image/avt.png');
  };
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image 
          source={getAvatarSource()} 
          // Nếu là ALL thì icon nhỏ (contain), Avatar người thì full (cover)
          style={item._id === 'ALL' ? styles.smallIcon : styles.fullImage}
          resizeMode={item._id === 'ALL' ? 'contain' : 'cover'}
        />
      </View>

      {/* Tên */}
      <Text style={styles.name}>{item.fullname}</Text>

      {/* Mũi tên phải */}
      <Image 
        source={require('../../assets/image/right_arrow.png')} 
        style={styles.arrow}
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
    borderBottomColor: Colors.neutral_light1, 
  },
  avatarContainer: {
    width: 34,
    height: 34,
    borderRadius: 17, 
    backgroundColor: Colors.surface, 
    justifyContent: 'center', 
    alignItems: 'center',     
    overflow: 'hidden',       
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  smallIcon: {
    width: 38,  
    height: 38,
    tintColor: Colors.text_secondary, 
  },
  name: {
    flex: 1, 
    marginLeft: 12,
    color: Colors.text_primary,
    fontSize: 16,
    fontWeight: '500',
  },
  arrow: {
    width: 15,
    height: 15,
    tintColor: Colors.text_hint,
  }
});

export default FriendRow;