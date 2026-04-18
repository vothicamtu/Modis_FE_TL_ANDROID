import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  View,
  Image,
} from 'react-native';
import { AuthInput } from '../components/auth/AuthInput';
import { authController } from '../controller/auth.controller';
import { styles } from '../styles/loginScreen.styles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../styles/color';

export default function SignupScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isValid, setIsValid] = useState(false);
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
    <LinearGradient colors={['#ede8ff', '#e8f4ff', '#e8fff8']} style={styles.containerSignup}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.topSection}>
            <Image
              source={require('../assets/image/LOGO_MODIS_TACH_NEN.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text testID="signup-title" style={styles.title}>
              Tạo tài khoản
            </Text>
            <Text style={styles.subtitle}>Bắt đầu kết nối với mọi người</Text>
          </View>

          <View style={styles.card}>
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
              style={[styles.button, isValid ? styles.buttonActive : styles.buttonDisabled]}
              onPress={onSignupPress}
              disabled={!isValid || loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.text_primary} />
              ) : (
                <Text style={styles.buttonText}>Đăng ký</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={[styles.footer, { marginBottom: 32 }]}>
            <Text style={{ color: Colors.text_hint }}>Đã có tài khoản?</Text>
            <TouchableOpacity testID="signup-login-link" onPress={() => navigation.navigate('LoginScreen')}>
              <Text style={styles.linkText}>Đăng nhập ngay</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
