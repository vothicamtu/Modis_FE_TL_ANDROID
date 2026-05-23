import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from "../styles/AllImageScreen.styles";
import { View, FlatList, StatusBar, ActivityIndicator, RefreshControl } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ImageGridItem from '../components/allImage/ImageGridItem';
import TopBar from '../components/topBar/TopBar';
import { ImageItem } from '../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePostList } from '../hook/usePostList';
import { useColors } from '../hook/useColors';

const AllImagesScreen = () => {
  const insets = useSafeAreaInsets();
  const C = useColors();
  console.log('[AllImage] insets.top =', insets.top);

  const {
    data: images,
    loading,
    refreshing,
    onRefresh,
    onLoadMore,
    handleFilterChange,
  } = usePostList<ImageItem>('GRID');

  useFocusEffect(
    React.useCallback(() => {
      onRefresh();
    }, [onRefresh])
  );

  const bottomBarHeight = insets.bottom + 76;

  const renderFooter = () => {
    if (!loading || refreshing) return null;
    return (
      <View style={{ padding: 10 }}>
        <ActivityIndicator size="small" color={C.accent} />
      </View>
    );
  };

  return (
    <LinearGradient 
      colors={C.bgGradient} 
      style={styles.container}
      testID="all_images_screen"
      accessibilityLabel="all_images_screen"
    >
      <StatusBar barStyle={C.statusBar} translucent backgroundColor="transparent" />
      <View style={{ height: insets.top, backgroundColor: C.bgGradient[0] }} />
      <View style={{ flex: 1, paddingTop: 28 }}>
        <TopBar
            variant="filter"
            goToMessage={undefined}
            goToProfile={undefined}
            canTransform={false}
            onFilterChange={handleFilterChange}
            showBackButton={true}
          />
        <View style={{ flex: 1 }}>
          <FlatList
            testID="all_images_flatlist"
            data={images}
            keyExtractor={(item) => item._id}
            renderItem={({ item, index }) => (
              <ImageGridItem 
                item={item} 
                onPress={() => console.log('Pressed', item._id)}
                testID={`all_images_grid_item_${index}`}
              />
            )}
            numColumns={3}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: bottomBarHeight },
            ]}
            showsVerticalScrollIndicator={false}
            onEndReached={onLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            accessibilityRole="list"
            accessibilityLabel="all_images_flatlist"
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={C.accent}
                colors={[C.primary, C.accent]}
                progressBackgroundColor={C.surfaceStrong}
              />
            }
          />
          {loading && (
            <View style={[styles.loadingOverlay, { backgroundColor: C.loadingOverlay }]}>
              <ActivityIndicator size="large" color={C.accent} />
            </View>
          )}
        </View>
      </View>
    </LinearGradient>
  );
};

export default AllImagesScreen;
