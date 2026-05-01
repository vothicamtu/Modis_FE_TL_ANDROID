import React from 'react';
import { Text, View, Image, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from '../styles/loading.styles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useColors } from '../hook/useColors';

export default function LoadingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const C = useColors();

  const login = async () => { navigation.navigate('LoginScreen'); };
  const signup = async () => { navigation.navigate('SignupScreen'); };

  return (
    <LinearGradient colors={C.bgGradient} style={styles.container} testID="loading-screen">
      <StatusBar barStyle={C.statusBar} translucent backgroundColor="transparent" />

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
          <Text testID="loading-tagline-1" style={[styles.tagline, { color: C.textPrimary }]}>Kết nối mọi nơi!</Text>
          <Text testID="loading-tagline-2" style={[styles.tagline, { color: C.textPrimary }]}>Xem ảnh trực tiếp của bạn bè</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            testID="loading-signup-button"
            activeOpacity={0.7}
            onPress={signup}
            style={[styles.buttonPrimary, { backgroundColor: C.primary, shadowColor: C.primary }]}
          >
            <Text style={[styles.buttonTextPrimary, { color: C.btnPrimaryText }]}>Create new account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="loading-login-button"
            activeOpacity={0.7}
            onPress={login}
            style={[styles.buttonSecondary, { backgroundColor: 'transparent', borderColor: C.secondary }]}
          >
            <Text style={[styles.buttonTextSecondary, { color: C.secondary }]}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}