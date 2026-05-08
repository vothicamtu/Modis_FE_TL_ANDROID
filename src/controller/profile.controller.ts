import AsyncStorage from '@react-native-async-storage/async-storage';
import { profileService } from '../services/profile.service';
import { emit } from '../utils/eventBus';

class ProfileController {
  async getProfile() {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return null;
      const profile = await profileService.getProfileById(userId);
      return profile;
    } catch (error) {
      console.log('Không lấy được profile', error);
      return null;
    }
  }

  async updateField(field: 'username' | 'sdt' | 'mail', newValue: string) {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId || !newValue) throw new Error("Thông tin không hợp lệ");

      let response;
      if (field === 'username') {
        response = await profileService.updateUsername(userId, newValue);
      } else if (field === 'sdt') {
        response = await profileService.updatePhone(userId, newValue);
      } else if (field === 'mail') {
        response = await profileService.updateMail(userId, newValue);
      }
      return response?.data?.[field === 'sdt' ? 'sdt' : field] || newValue;
    } catch (error) {
      throw error;
    }
  }

  async changePassword(oldPass: string, newPass: string, confirmPass: string) {
    if (newPass !== confirmPass) {
      throw new Error("Mật khẩu xác nhận không khớp!");
    }
    if (newPass.length < 6) {
      throw new Error("Mật khẩu mới phải có ít nhất 6 ký tự!");
    }
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) throw new Error("Phiên đăng nhập hết hạn");
    return await profileService.changePassword(userId, oldPass, newPass);
  }

  async updateAvatar(imageUri: string) {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error("Không tìm thấy ID người dùng");

      const response = await profileService.updateAvatar(userId, imageUri);

      // backend trả về { message: "...", avatarUrl: "..." } trong response.data
      const avatarUrl = response?.avatarUrl || response?.data?.avatarUrl;

      // lưu vào AsyncStorage để TopBar dùng
      if (avatarUrl) {
        await AsyncStorage.setItem(`avatarUrl_${userId}`, avatarUrl);
        emit('avatarUpdated');
      }

      return avatarUrl;
    } catch (error) {
      console.error("Lỗi tại ProfileController.updateAvatar:", error);
      throw error;
    }
  }
}

export const profileController = new ProfileController();
