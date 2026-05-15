import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  View,
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

export default function SignupScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isValid, setIsValid] = useState(false);
  const C = useColors();
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
      Alert.alert('Thành công', 'Đăng ký thành công!');
      navigation.reset({
        index: 0,
        routes: [{ name: 'HomeScreen' }],
      });
    } else {
      Alert.alert('Lỗi', result.message);
    }
  };

  return (
    <LinearGradient 
      colors={C.bgGradient} 
      style={styles.containerSignup}
      testID="signup_screen"
      accessibilityLabel="Màn hình đăng ký"
    >
      <StatusBar barStyle={C.statusBar} translucent backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.topSection}>
            <Text 
              testID="signup_title_text" 
              style={[styles.title, { color: C.textPrimary }]}
              accessibilityRole="header"
              accessibilityLabel="Tạo tài khoản"
            >
              Tạo tài khoản
            </Text>
            <Text 
              style={[styles.subtitle, { color: C.textHint }]}
              accessibilityRole="text"
              accessibilityLabel="Bắt đầu kết nối với mọi người"
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
              accessibilityLabel="Nhập tên đăng nhập"
              accessibilityRole="text"
            />
            <AuthInput
              testID="signup_fullname_input"
              label="Họ và tên"
              value={form.fullname}
              onChangeText={(val) => updateForm('fullname', val)}
              placeholder="Nhập họ và tên"
              accessibilityLabel="Nhập họ và tên"
              accessibilityRole="text"
            />
            <AuthInput
              testID="signup_email_input"
              label="Email"
              value={form.mail}
              onChangeText={(val) => updateForm('mail', val)}
              placeholder="Nhập email"
              keyboardType="email-address"
              accessibilityLabel="Nhập email"
              accessibilityRole="text"
            />
            <AuthInput
              testID="signup_phone_input"
              label="Số điện thoại"
              value={form.sdt}
              onChangeText={(val) => updateForm('sdt', val)}
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
              accessibilityLabel="Nhập số điện thoại"
              accessibilityRole="text"
            />
            <AuthInput
              testID="signup_password_input"
              label="Mật khẩu"
              value={form.password}
              onChangeText={(val) => updateForm('password', val)}
              placeholder="Nhập mật khẩu"
              secureTextEntry
              accessibilityLabel="Nhập mật khẩu"
              accessibilityRole="text"
            />
            <AuthInput
              testID="signup_confirm_password_input"
              label="Xác nhận mật khẩu"
              value={form.confirmPassword}
              onChangeText={(val) => updateForm('confirmPassword', val)}
              placeholder="Nhập lại mật khẩu"
              secureTextEntry
              accessibilityLabel="Nhập lại mật khẩu"
              accessibilityRole="text"
            />

            <TouchableOpacity
              testID="signup_submit_button"
              style={[styles.button, isValid
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
              accessibilityLabel={loading ? "Đang đăng ký" : "Đăng ký"}
              accessibilityState={{ disabled: !isValid || loading }}
            >
              {loading ? (
                <ActivityIndicator color={C.btnPrimaryText} />
              ) : (
                <Text style={[styles.buttonText, { color: isValid ? C.btnPrimaryText : C.btnCancelText }]}>Đăng ký</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={[styles.footer, { marginBottom: 32 }]}>
            <Text 
              style={{ color: C.textSecondary }}
              accessibilityRole="text"
            >
              Đã có tài khoản?
            </Text>
            <TouchableOpacity 
              testID="signup_login_link" 
              onPress={() => navigation.navigate('LoginScreen')}
              accessibilityRole="link"
              accessibilityLabel="Đăng nhập ngay"
            >
              <Text style={[styles.linkText, { color: C.primary, fontWeight: '600', textDecorationLine: 'none' }]}>Đăng nhập ngay</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
