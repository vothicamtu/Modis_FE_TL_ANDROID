import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from "../styles/AllImageScreen.styles";
import {
  View,
  FlatList,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from "../styles/color";
import ImageGridItem from '../components/allImage/ImageGridItem';
import TopBar from '../components/topBar/TopBar';
import BottomBar from '../components/BottomBar';
import { ImageItem } from '../types';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePostList } from '../hook/usePostList';

const AllImagesScreen = () => {
  const insets = useSafeAreaInsets();

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

  const topBarHeight = insets.top + 80;
  const bottomBarHeight = insets.bottom + 76;

  const renderFooter = () => {
    if (!loading || refreshing) return null;
    return (
      <View style={{ padding: 10 }}>
        <ActivityIndicator size="small" color={Colors.accent} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <FlatList
        testID="all-images-flatlist"
        data={images}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ImageGridItem item={item} onPress={() => console.log('Pressed', item._id)} />
        )}
        numColumns={3}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: topBarHeight, paddingBottom: bottomBarHeight },
        ]}
        showsVerticalScrollIndicator={false}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.accent}
            colors={[Colors.primary, Colors.accent]}
            progressViewOffset={topBarHeight}
          />
        }
      />

      <LinearGradient
        colors={[Colors.surface_strong, 'rgba(255,255,255,0.9)', 'transparent']}
        style={[styles.headerOverlay, { height: topBarHeight + 20 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        pointerEvents="none"
      />

      <View style={[styles.topBarWrapper, { paddingTop: insets.top }]}>
        <TopBar
          variant="filter"
          goToMessage={undefined}
          goToProfile={undefined}
          canTransform={false}
          onFilterChange={handleFilterChange}
        />
      </View>

      <BottomBar />
    </SafeAreaView>
  );
};

export default AllImagesScreen;
