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

  const topBarHeight = 60; // paddingTop:4 + icon:44 + paddingBottom:12
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
    <LinearGradient colors={['#ede8ff', '#e8f4ff', '#e8fff8']} style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Header — giống Profile: SafeAreaView transparent, TopBar hòa vào gradient */}
      <SafeAreaView edges={['top']}>
        <View style={{ paddingTop: 4 }}>
          <TopBar
            variant="filter"
            goToMessage={undefined}
            goToProfile={undefined}
            canTransform={false}
            onFilterChange={handleFilterChange}
            showBackButton={true}
          />
        </View>
      </SafeAreaView>

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
            { paddingBottom: bottomBarHeight },
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
            />
          }
        />
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        )}
    </LinearGradient>
  );
};

export default AllImagesScreen;
