import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthInput } from '../components/auth/AuthInput';
import { styles } from '../styles/loginScreen.styles';
import { authController } from '../controller/auth.controller';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import LinearGradient from 'react-native-linear-gradient';
import { useColors } from '../hook/useColors';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const C = useColors();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    setIsValid(username.length > 0 && password.length > 0);
  }, [username, password]);

  const onLoginPress = async () => {
    setLoading(true);
    const result = await authController.login(username, password);
    setLoading(false);
    if (result.success) {
      navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] });
    } else {
      Alert.alert('Thông báo', result.message);
    }
  };

  return (
    <LinearGradient colors={C.bgGradient} style={styles.container}>
      <StatusBar barStyle={C.statusBar} translucent backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <View style={styles.topSection}>
            <Text testID="login-title" style={[styles.title, { color: C.textPrimary }]}>Chào mừng trở lại</Text>
            <Text style={[styles.subtitle, { color: C.textHint }]}>Đăng nhập để tiếp tục kết nối</Text>
          </View>

          <View style={[styles.card, {
            backgroundColor: C.surface,
            borderColor: C.border,
            shadowColor: C.primary,
            shadowOpacity: 0.15,
            shadowRadius: 20,
          }]}>
            <AuthInput testID="login-username-input" label="Tên đăng nhập" value={username} onChangeText={setUsername} placeholder="Nhập tên đăng nhập" />
            <AuthInput testID="login-password-input" label="Mật khẩu" value={password} onChangeText={setPassword} placeholder="Nhập mật khẩu" secureTextEntry />

            <TouchableOpacity
              testID="login-submit-button"
              style={[styles.button, isValid
                ? { backgroundColor: C.primary, shadowColor: C.primary, shadowOpacity: 0.35, elevation: 5 }
                : { 
                    backgroundColor: C.btnDisabled, 
                    elevation: 0, 
                    shadowOpacity: 0 
                  }
              ]}
              onPress={onLoginPress}
              disabled={!isValid || loading}
            >
              {loading ? (
                <ActivityIndicator color={C.btnPrimaryText} />
              ) : (
                <Text style={[styles.buttonText, { color: isValid ? C.btnPrimaryText : C.btnCancelText }]}>Đăng nhập</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={{ color: C.textSecondary }}>Chưa có tài khoản?</Text>
            <TouchableOpacity testID="login-signup-link" onPress={() => navigation.navigate('SignupScreen')}>
              <Text style={[styles.linkText, { color: C.primary, fontWeight: '600', textDecorationLine: 'none' }]}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
