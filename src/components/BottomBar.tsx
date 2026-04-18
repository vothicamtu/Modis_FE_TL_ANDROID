import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Colors from '../styles/color';
import { RootStackParamList } from '../navigation/Navigation';

const BottomBar = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View testID="bottom-bar" style={styles.container}>
      <TouchableOpacity
        testID="bottom-bar-home-button"
        style={styles.outerCircle}
        onPress={() => navigation.navigate("HomeScreen")}
        activeOpacity={0.7}
      >
        <View style={styles.innerCircle} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 24,
    backgroundColor: Colors.surface_strong,
    borderTopWidth: 1,
    borderTopColor: 'rgba(159,165,174,0.2)',
  },
  outerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface_strong,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  innerCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
  },
});

export default BottomBar;
