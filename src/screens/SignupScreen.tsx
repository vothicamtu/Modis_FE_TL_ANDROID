import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  View,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthInput } from '../components/auth/AuthInput';
import { authController } from '../controller/auth.controller';
import { styles } from '../styles/loginScreen.styles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useColors } from '../hook/useColors';
import { useTheme } from '../context/ThemeContext';

export default function SignupScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isValid, setIsValid] = useState(false);
  const C = useColors();
  const { isDark } = useTheme();
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
    <LinearGradient colors={C.bgGradient} style={styles.containerSignup}>
      <StatusBar barStyle={C.statusBar} translucent backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.topSection}>
            <Text testID="signup-title" style={[styles.title, { color: C.textPrimary }]}>Tạo tài khoản</Text>
            <Text style={[styles.subtitle, { color: C.textHint }]}>Bắt đầu kết nối với mọi người</Text>
          </View>

          <View style={[styles.card, {
            backgroundColor: C.surface,
            borderColor: C.border,
            shadowColor: C.primary,
            shadowOpacity: 0.15,
            shadowRadius: 20,
          }]}>
            <AuthInput
              testID="signup-username-input"
              label="Tên đăng nhập"
              value={form.username}
              onChangeText={(val) => updateForm('username', val)}
              placeholder="Nhập tên đăng nhập"
            />
            <AuthInput
              testID="signup-fullname-input"
              label="Họ và tên"
              value={form.fullname}
              onChangeText={(val) => updateForm('fullname', val)}
              placeholder="Nhập họ và tên"
            />
            <AuthInput
              testID="signup-email-input"
              label="Email"
              value={form.mail}
              onChangeText={(val) => updateForm('mail', val)}
              placeholder="Nhập email"
              keyboardType="email-address"
            />
            <AuthInput
              testID="signup-phone-input"
              label="Số điện thoại"
              value={form.sdt}
              onChangeText={(val) => updateForm('sdt', val)}
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
            />
            <AuthInput
              testID="signup-password-input"
              label="Mật khẩu"
              value={form.password}
              onChangeText={(val) => updateForm('password', val)}
              placeholder="Nhập mật khẩu"
              secureTextEntry
            />
            <AuthInput
              testID="signup-confirm-password-input"
              label="Xác nhận mật khẩu"
              value={form.confirmPassword}
              onChangeText={(val) => updateForm('confirmPassword', val)}
              placeholder="Nhập lại mật khẩu"
              secureTextEntry
            />

            <TouchableOpacity
              testID="signup-submit-button"
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
            >
              {loading ? (
                <ActivityIndicator color={C.btnPrimaryText} />
              ) : (
                <Text style={[styles.buttonText, { color: isValid ? C.btnPrimaryText : C.btnCancelText }]}>Đăng ký</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={[styles.footer, { marginBottom: 32 }]}>
            <Text style={{ color: C.textSecondary }}>Đã có tài khoản?</Text>
            <TouchableOpacity testID="signup-login-link" onPress={() => navigation.navigate('LoginScreen')}>
              <Text style={[styles.linkText, { color: C.primary, fontWeight: '600', textDecorationLine: 'none' }]}>Đăng nhập ngay</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
