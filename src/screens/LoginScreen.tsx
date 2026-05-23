import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthInput } from '../components/auth/AuthInput';
import { styles } from '../styles/loginScreen.styles';
import { authController } from '../controller/auth.controller';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import LinearGradient from 'react-native-linear-gradient';
import { useColors } from '../hook/useColors';
import { useAuthDialog } from '../context/AuthDialogContext';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const C = useColors();
  const { showAuthDialog } = useAuthDialog();

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
      showAuthDialog({ title: 'Thông báo', message: result.message });
    }
  };

  return (
    <LinearGradient 
      colors={C.bgGradient} 
      style={styles.container}
      testID="login_screen"
      accessibilityLabel="login_screen"
    >
      <StatusBar barStyle={C.statusBar} translucent backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <View style={styles.topSection}>
            <Text 
              testID="login_title_text" 
              style={[styles.title, { color: C.textPrimary }]}
              accessibilityRole="header"
              accessibilityLabel="login_title_text"
            >
              Chào mừng trở lại
            </Text>
            <Text 
              style={[styles.subtitle, { color: C.textHint }]}
              accessibilityRole="text"
              testID="login_subtitle_text"
              accessibilityLabel="login_subtitle_text"
            >
              Đăng nhập để tiếp tục kết nối
            </Text>
          </View>

          <View style={[styles.card, {
            backgroundColor: C.surfaceStrong, // Use surfaceStrong for unified appearance
            borderColor: C.border,
            shadowColor: C.primary,
            shadowOpacity: 0.08, // Reduced shadow for cleaner look
            shadowRadius: 16,
            elevation: 2, // Reduced elevation
          }]}>
            <AuthInput 
              testID="login_username_input" 
              label="Tên đăng nhập" 
              value={username} 
              onChangeText={setUsername} 
              placeholder="Nhập tên đăng nhập"
              accessibilityLabel="login_username_input"
              accessibilityRole="text"
            />
            <AuthInput 
              testID="login_password_input" 
              label="Mật khẩu" 
              value={password} 
              onChangeText={setPassword} 
              placeholder="Nhập mật khẩu" 
              secureTextEntry
              accessibilityLabel="login_password_input"
              accessibilityRole="text"
            />

            <TouchableOpacity
              testID="login_submit_button"
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
              accessibilityRole="button"
              accessibilityLabel="login_submit_button"
              accessibilityState={{ disabled: !isValid || loading }}
              accessible={true}
            >
              {loading ? (
                <ActivityIndicator color={C.btnPrimaryText} />
              ) : (
                <Text
                  style={[styles.buttonText, { color: isValid ? C.btnPrimaryText : C.btnCancelText }]}
                  accessible={false}
                >
                  Đăng nhập
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text 
              style={{ color: C.textSecondary }}
              accessibilityRole="text"
            >
              Chưa có tài khoản?
            </Text>
            <TouchableOpacity 
              testID="login_signup_link" 
              onPress={() => navigation.navigate('SignupScreen')}
              accessibilityRole="button"
              accessibilityLabel="login_signup_link"
              accessible={true}
            >
              <Text
                style={[styles.linkText, { color: C.primary, fontWeight: '600', textDecorationLine: 'none' }]}
                accessible={false}
              >
                Đăng ký ngay
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
