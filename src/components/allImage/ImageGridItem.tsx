import React from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { ImageItem } from '../../types';
import { optimizeCloudinaryUrl } from '../../utils/cloudinary';
import { useColors } from '../../hook/useColors';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const ITEM_MARGIN = 2;
// Tính toán kích thước ảnh dựa trên màn hình chia 3
const ITEM_SIZE = (width / COLUMN_COUNT) - (ITEM_MARGIN * 2);

interface Props {
  item: ImageItem;
  onPress: () => void;
}

const ImageGridItem: React.FC<Props> = ({ item, onPress }) => {
  const C = useColors();
  return (
    <TouchableOpacity testID={`image-grid-item-${item._id}`} onPress={onPress} style={styles.container}>
      <View style={[styles.card, { backgroundColor: C.surfaceStrong }]}>
        <Image
          testID={`image-grid-image-${item._id}`}
          source={{ uri: optimizeCloudinaryUrl(item.uri) }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: ITEM_SIZE,
    height: ITEM_SIZE, 
    margin: ITEM_MARGIN,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ImageGridItem;