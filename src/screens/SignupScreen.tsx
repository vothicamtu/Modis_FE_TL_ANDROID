import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView, View } from 'react-native';
import { AuthInput } from '../components/auth/AuthInput';
import { authController } from '../controller/auth.controller';
import { styles } from '../styles/loginScreen.styles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navigation';
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
      form.username.length > 0 && form.fullname.length > 0 &&
      form.mail.length > 0 && form.password.length > 0 &&
      form.confirmPassword.length > 0 && form.sdt.length > 0
    );
  }, [form]);

  const updateForm = (field: string, value: string) => {
    let finalValue = value;
    if (field === 'userName') finalValue = authController.formatUserName(value);
    setForm({ ...form, [field]: finalValue });
  };

  const onSignupPress = async () => {
    setLoading(true);
    const result = await authController.signup(form);
    setLoading(false);
    if (result.success) {
      Alert.alert('Thành công', 'Đăng ký thành công!');
      navigation.replace('HomeScreen');
    } else {
      Alert.alert('Lỗi', result.message);
    }
  };

  return (
    <LinearGradient colors={['#ede8ff', '#e8f4ff', '#e8fff8']} style={styles.containerSignup}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingVertical: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity testID="signup-back-button" onPress={() => navigation.goBack()} style={{ marginBottom: 16 }}>
            <Icon name="arrow-back-ios" size={20} color={Colors.accent} />
          </TouchableOpacity>

          <View style={styles.card} testID="signup-card">
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>Join and connect with friends</Text>

            <AuthInput
              testID="signup-username-input"
              label="Username"
              value={form.username}
              onChangeText={(text) => updateForm('username', text)}
              placeholder="No spaces..."
            />
            <AuthInput
              testID="signup-fullname-input"
              label="Full name"
              value={form.fullname}
              onChangeText={(text) => updateForm('fullname', text)}
              placeholder="Your full name..."
            />
            <AuthInput
              testID="signup-phone-input"
              label="Phone number"
              value={form.sdt}
              onChangeText={(text) => updateForm('sdt', text)}
              placeholder="Phone number..."
              keyboardType="phone-pad"
            />
            <AuthInput
              testID="signup-email-input"
              label="Email"
              value={form.mail}
              onChangeText={(text) => updateForm('mail', text)}
              placeholder="Your email..."
            />
            <AuthInput
              testID="signup-password-input"
              label="Password"
              value={form.password}
              onChangeText={(text) => updateForm('password', text)}
              placeholder="Create a password..."
              secureTextEntry
            />
            <AuthInput
              testID="signup-confirm-password-input"
              label="Confirm password"
              value={form.confirmPassword}
              onChangeText={(text) => updateForm('confirmPassword', text)}
              placeholder="Repeat your password..."
              secureTextEntry
            />

            <TouchableOpacity
              testID="signup-button"
              style={[styles.button, isValid ? styles.buttonActive : styles.buttonDisabled]}
              onPress={onSignupPress}
              disabled={!isValid || loading}
            >
              {loading ? (
                <ActivityIndicator testID="signup-loading" color={Colors.text_primary} />
              ) : (
                <Text style={styles.buttonText}>Create account</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={{ color: Colors.text_hint, fontSize: 14 }}>
                Already have an account?{' '}
                <Text testID="signup-login-link" style={styles.linkText} onPress={() => navigation.navigate('LoginScreen')}>
                  Login
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
