import React from 'react';
import { Text, View, Image, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from '../styles/loading.styles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navigation';

export default function LoadingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const login = async () => {
    navigation.navigate('LoginScreen');
  };

  const signup = async () => {
    navigation.navigate('SignupScreen');
  };

  return (
    <LinearGradient
      colors={['#ede8ff', '#e8f4ff', '#e8fff8']}
      style={styles.container}
      testID="loading-screen"
    >
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      <SafeAreaView style={styles.content}>

        <View style={styles.topSection}>
          <Image
            testID="loading-logo"
            source={require('../assets/image/LOGO_MODIS_TACH_NEN.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textContainer}>
          <Text testID="loading-tagline-1" style={styles.tagline}>Kết nối mọi nơi!</Text>
          <Text testID="loading-tagline-2" style={styles.tagline}>Xem ảnh trực tiếp của bạn bè</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            testID="loading-signup-button"
            activeOpacity={0.7}
            onPress={signup}
            style={styles.buttonPrimary}>
            <Text style={styles.buttonTextPrimary}>Create new account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="loading-login-button"
            activeOpacity={0.7}
            onPress={login}
            style={styles.buttonSecondary}
          >
            <Text style={styles.buttonTextSecondary}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}