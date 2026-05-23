import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthInput } from '../components/auth/AuthInput';
import { authController } from '../controller/auth.controller';
import { styles } from '../styles/loginScreen.styles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import LinearGradient from 'react-native-linear-gradient';
import { useColors } from '../hook/useColors';
import { useAuthDialog } from '../context/AuthDialogContext';

export default function SignupScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isValid, setIsValid] = useState(false);
  const C = useColors();
  const { showAuthDialog } = useAuthDialog();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: '',
    fullname: '',
    mail: '',
    password: '',
    confirmPassword: '',
    sdt: '',
  });

  useEffect(() => {
    setIsValid(
      form.username.length > 0 &&
        form.fullname.length > 0 &&
        form.mail.length > 0 &&
        form.password.length > 0 &&
        form.confirmPassword.length > 0 &&
        form.sdt.length > 0
    );
  }, [form]);

  const updateForm = (field: string, value: string) => {
    let finalValue = value;
    if (field === 'username') finalValue = authController.formatUserName(value);
    setForm({ ...form, [field]: finalValue });
  };

  const onSignupPress = async () => {
    setLoading(true);
    const result = await authController.signup(form);
    setLoading(false);
    if (result.success) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'HomeScreen' }],
      });
      // Đúng flow app: đã navigate sang Home/Take nhưng dialog vẫn hiện -> automation phải bấm OK để đóng.
      showAuthDialog({ title: 'Thành công', message: 'Đăng ký thành công!' });
    } else {
      showAuthDialog({ title: 'Lỗi', message: result.message });
    }
  };

  return (
    <LinearGradient 
      colors={C.bgGradient} 
      style={styles.containerSignup}
      testID="signup_screen"
      accessibilityLabel="signup_screen"
    >
      <StatusBar barStyle={C.statusBar} translucent backgroundColor="transparent" />
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'flex-start' }]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
        >
          {/* Scroll phần input, giữ action (Đăng ký/Đăng nhập) luôn visible ở đáy màn hình */}
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            <View style={styles.topSection}>
              <Text 
                testID="signup_title_text" 
                style={[styles.title, { color: C.textPrimary }]}
                accessibilityRole="header"
                accessibilityLabel="signup_title_text"
              >
                Tạo tài khoản
              </Text>
              <Text 
                style={[styles.subtitle, { color: C.textHint }]}
                accessibilityRole="text"
                testID="signup_subtitle_text"
                accessibilityLabel="signup_subtitle_text"
              >
                Bắt đầu kết nối với mọi người
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
                testID="signup_username_input"
                label="Tên đăng nhập"
                value={form.username}
                onChangeText={(val) => updateForm('username', val)}
                placeholder="Nhập tên đăng nhập"
                accessibilityLabel="signup_username_input"
                accessibilityRole="text"
              />
              <AuthInput
                testID="signup_fullname_input"
                label="Họ và tên"
                value={form.fullname}
                onChangeText={(val) => updateForm('fullname', val)}
                placeholder="Nhập họ và tên"
                accessibilityLabel="signup_fullname_input"
                accessibilityRole="text"
              />
              <AuthInput
                testID="signup_email_input"
                label="Email"
                value={form.mail}
                onChangeText={(val) => updateForm('mail', val)}
                placeholder="Nhập email"
                keyboardType="email-address"
                accessibilityLabel="signup_email_input"
                accessibilityRole="text"
              />
              <AuthInput
                testID="signup_phone_input"
                label="Số điện thoại"
                value={form.sdt}
                onChangeText={(val) => updateForm('sdt', val)}
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
                accessibilityLabel="signup_phone_input"
                accessibilityRole="text"
              />
              <AuthInput
                testID="signup_password_input"
                label="Mật khẩu"
                value={form.password}
                onChangeText={(val) => updateForm('password', val)}
                placeholder="Nhập mật khẩu"
                secureTextEntry
                accessibilityLabel="signup_password_input"
                accessibilityRole="text"
              />
              <AuthInput
                testID="signup_confirm_password_input"
                label="Xác nhận mật khẩu"
                value={form.confirmPassword}
                onChangeText={(val) => updateForm('confirmPassword', val)}
                placeholder="Nhập lại mật khẩu"
                secureTextEntry
                accessibilityLabel="signup_confirm_password_input"
                accessibilityRole="text"
              />
            </View>
          </ScrollView>

          <View style={{ paddingTop: 12, paddingBottom: 16 }}>
            <TouchableOpacity
              testID="signup_submit_button"
              style={[styles.button, { marginTop: 0 }, isValid
                ? { backgroundColor: C.primary, shadowColor: C.primary, shadowOpacity: 0.35, elevation: 5 }
                : { 
                    backgroundColor: C.btnDisabled, 
                    elevation: 0, 
                    shadowOpacity: 0 
                  }
              ]}
              onPress={onSignupPress}
              disabled={!isValid || loading}
              accessibilityRole="button"
              accessibilityLabel="signup_submit_button"
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
                  Đăng ký
                </Text>
              )}
            </TouchableOpacity>

            <View style={[styles.footer, { marginTop: 12 }]}>
              <Text 
                style={{ color: C.textSecondary }}
                accessibilityRole="text"
              >
                Đã có tài khoản?
              </Text>
              <TouchableOpacity 
                testID="signup_login_link" 
                onPress={() => navigation.navigate('LoginScreen')}
                accessibilityRole="button"
                accessibilityLabel="signup_login_link"
                accessible={true}
              >
                <Text
                  style={[styles.linkText, { color: C.primary, fontWeight: '600', textDecorationLine: 'none', marginTop: 10 }]}
                  accessible={false}
                >
                  Đăng nhập ngay
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
