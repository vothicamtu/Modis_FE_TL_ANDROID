import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar, Alert, SafeAreaView, ActivityIndicator } from 'react-native';
import { AuthInput } from '../components/auth/AuthInput';
import { styles } from '../styles/loginScreen.styles';
import { authController } from '../controller/auth.controller';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navigation';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../styles/color';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    setIsValid(username.length > 0 && password.length > 0);
  }, [username, password]);

  const onLoginPress = async () => {
    setLoading(true);
    const result = await authController.login(username, password);
    setLoading(false);
    if (result.success) {
      navigation.navigate('HomeScreen');
    } else {
      Alert.alert('Thông báo', result.message);
    }
  };

  return (
    <LinearGradient colors={['#ede8ff', '#e8f4ff', '#e8fff8']} style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      <SafeAreaView>
        <TouchableOpacity testID="login-back-button" onPress={() => navigation.goBack()} style={{ marginBottom: 8 }}>
          <Icon name="arrow-back-ios" size={20} color={Colors.accent} />
        </TouchableOpacity>

        <View style={styles.topSection}>
          <Image
            testID="login-logo"
            source={require('../assets/image/LOGO_MODIS_TACH_NEN.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.card} testID="login-card">
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <AuthInput
            testID="login-username-input"
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="Your username..."
          />

          <AuthInput
            testID="login-password-input"
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Your password..."
            secureTextEntry
          />

          <TouchableOpacity
            testID="login-button"
            accessibilityLabel="login-button"
            style={[styles.button, isValid ? styles.buttonActive : styles.buttonDisabled]}
            onPress={onLoginPress}
            disabled={!isValid || loading}
          >
            {loading ? (
              <ActivityIndicator testID="login-loading" color={Colors.text_primary} />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={{ color: Colors.text_hint, fontSize: 14 }}>
              Don't have an account?{' '}
              <Text testID="login-signup-link" style={styles.linkText} onPress={() => navigation.navigate('SignupScreen')}>
                Sign up
              </Text>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
