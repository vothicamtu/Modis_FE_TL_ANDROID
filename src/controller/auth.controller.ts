import { authService } from '../services/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from '../types/auth/auth';
import { authStorage } from './auth.storage';
import StompService from '../socket/service/StompService';

export const authController = {
  login: async (username: string, password: string) => {
  try {
    const rq: LoginRequest = { username, password };
    const data = await authService.login(rq);

    if (!data?.token) {
      return { success: false, message: 'Dữ liệu trả về không hợp lệ' };
    }

    await authStorage.saveAuth(data);

    return { success: true };
  } catch (error: any) {
    const msg =
      error.response?.data?.message ||
      'Tài khoản hoặc mật khẩu không chính xác';
    return { success: false, message: msg };
  }
},

  formatUserName: (input: string) => {
    return input
      .normalize("NFD")

      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "");
  },

  signup: async (formData: any) => {
  const {
    username,
    fullname,
    mail,
    password,
    confirmPassword,
    sdt,
  } = formData;

  if (!username || !fullname || !mail || !password || !confirmPassword || !sdt) {
    return { success: false, message: 'Không thể để trống' };
  }

  if (password !== confirmPassword) {
    return { success: false, message: 'Mật khẩu không khớp' };
  }

  if (sdt.length < 9 || sdt.length > 11) {
    return { success: false, message: 'Số điện thoại không hợp lệ' };
  }

  try {
    const rq: SignupRequest = {
      username,
      password,
      fullname,
      mail,
      sdt,
    };

    const result = await authService.signup(rq);

    if (!result?.token) {
      return { success: false, message: 'Đăng ký không thành công' };
    }

    await authStorage.saveAuth(result);

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Lỗi server',
    };
  }
},

  async logout(navigation: any) {
  try {
    await authStorage.clearAuth();
    StompService.disconnect();

    navigation.reset({
      index: 0,
      routes: [{ name: 'LoadingScreen' }],
    });
  } catch (error) {
    console.log('Logout error:', error);
  }
}

};