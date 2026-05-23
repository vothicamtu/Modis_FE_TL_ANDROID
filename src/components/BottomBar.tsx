import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { useColors } from '../hook/useColors';

const BottomBar = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const C = useColors();

  return (
    <View 
      testID="bottombar_container" 
      style={[styles.container, {
        backgroundColor: C.surfaceStrong,
        borderTopColor: C.border,
      }]}
      accessibilityRole="tabbar"
      accessibilityLabel="bottombar_container"
    >
      <TouchableOpacity
        testID="bottombar_home_button"
        style={[styles.outerCircle, {
          borderColor: C.primary,
          backgroundColor: C.surfaceStrong,
          shadowColor: C.primary,
        }]}
        onPress={() => navigation.navigate("HomeScreen")}
        activeOpacity={0.7}
        accessibilityRole="tab"
        accessibilityLabel="bottombar_home_button"
        accessible={true}
      >
        <View style={[styles.innerCircle, { backgroundColor: C.primary }]} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 24,
    borderTopWidth: 1,
  },
  outerCircle: {
    width: 60, height: 60, borderRadius: 30,
    borderWidth: 3,
    justifyContent: 'center', alignItems: 'center',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25, shadowRadius: 6, elevation: 4,
  },
  innerCircle: {
    width: 44, height: 44, borderRadius: 22,
  },
});

export default BottomBar;
