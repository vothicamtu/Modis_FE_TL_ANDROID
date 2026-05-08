import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  Switch,
} from 'react-native';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from '../styles/profileScreen.styles';
import { useNavigation } from '@react-navigation/native';
import { authController } from '../controller/auth.controller';
import { profileController } from '../controller/profile.controller';
import { launchImageLibrary } from 'react-native-image-picker';
import ShareAppRow from '../components/friends/ShareAppRow';
import { useTheme } from '../context/ThemeContext';
import { useColors } from '../hook/useColors';

type Profile = {
  id: string;
  username: string;
  fullname: string | null;
  mail: string | null;
  sdt: string | null;
  avatarUrl?: string | null;
};

type Props = {
  goToHome?: () => void;
};

export default function ProfileScreen({ goToHome }: Props) {
  const navigation = useNavigation();
  const { isDark, toggleTheme } = useTheme();
  const C = useColors();

  const handleBack = () => {
    if (goToHome) {
      goToHome();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      console.warn('ProfileScreen: No history and no goToHome provided');
    }
  };
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwordModal, setPasswordModal] = useState(false);
  const [shareModal, setShareModal] = useState(false); // thêm
  const [passwordData, setPasswordData] = useState({
    oldPass: '',
    newPass: '',
    confirmPass: '',
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState<'username' | 'sdt' | 'mail'>('username');
  const [tempValue, setTempValue] = useState('');

  const Item = ({
    icon,
    label,
    value,
    danger,
    onPress,
    testID,
  }: {
    icon: string;
    label: string;
    value?: string;
    danger?: boolean;
    onPress?: () => void;
    testID?: string;
  }) => (
    <TouchableOpacity testID={testID} style={[styles.item, { backgroundColor: C.surface, borderLeftColor: danger ? C.danger : C.primary }]} onPress={onPress}>
      <Icon name={icon} size={22} color={danger ? C.danger : C.primary} />
      <View style={{ marginLeft: 12 }}>
        <Text style={[styles.label, { color: C.textPrimary }]}>{label}</Text>
        {value && <Text style={[styles.value, { color: C.textSecondary }]}>{value}</Text>}
      </View>
    </TouchableOpacity>
  );

  const openEdit = (field: 'username' | 'sdt' | 'mail', currentVal: string | null) => {
    setCurrentField(field);
    setTempValue(currentVal || '');
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const newValue = await profileController.updateField(currentField, tempValue);

      if (profile) {
        setProfile({
          ...profile,
          [currentField]: newValue,
        });
      }
      setIsModalVisible(false);
      Alert.alert('Thành công', 'Đã cập nhật!');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.oldPass || !passwordData.newPass || !passwordData.confirmPass) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ các trường');
      return;
    }
    try {
      setLoading(true);
      await profileController.changePassword(
        passwordData.oldPass,
        passwordData.newPass,
        passwordData.confirmPass
      );
      setPasswordModal(false);
      setPasswordData({ oldPass: '', newPass: '', confirmPass: '' });
      Alert.alert('Thành công', 'Mật khẩu đã được thay đổi.');
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message;
      Alert.alert('Lỗi', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAvatar = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.6,
    });

    if (result.didCancel || !result.assets || !result.assets[0].uri) return;

    try {
      setLoading(true);
      const newAvatarUrl = await profileController.updateAvatar(result.assets[0].uri);
      if (profile) {
        setProfile({ ...profile, avatarUrl: newAvatarUrl });
      }
      Alert.alert('Thành công', 'Ảnh đại diện đã được cập nhật!');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải ảnh lên.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response: any = await profileController.getProfile();
        if (response?.data) {
          setProfile(response.data);
        } else {
          setProfile(response);
        }
      } catch (error) {
        console.log('Lỗi load profile:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  if (loading && !isModalVisible) {
    return (
      <LinearGradient colors={C.bgGradient} style={styles.container}>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }} edges={[]}>
          <ActivityIndicator size="large" color={C.primary} />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={C.bgGradient} style={{ flex: 1 }}>
      <StatusBar barStyle={C.statusBar} translucent backgroundColor="transparent" />
      <View style={{ flex: 1 }}>
        <SafeAreaView style={{ zIndex: 10, width: '100%', backgroundColor: 'transparent' }} edges={['top']}>
          <View style={{ paddingTop: 4 }}>
            <View style={{ paddingBottom: 12, paddingHorizontal: 16 }}>
              <TouchableOpacity
                testID="profile-back-button"
                onPress={handleBack}
                style={[styles.backButtonModern, { backgroundColor: C.backBtn, shadowColor: C.backBtnShadow }]}
              >
                <Icon name="arrow-back" size={24} color={C.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80, paddingTop: 0 }}
          style={{ flex: 1 }}
          bounces={false}
          overScrollMode="never"
          testID="profile-scroll"
        >
          {/* Avatar Section */}
          <View style={styles.header} testID="profile-header">
            <Image
              testID="profile-avatar"
              source={
                profile?.avatarUrl
                  ? { uri: profile.avatarUrl }
                  : require('../assets/image/avt.png')
              }
              style={[styles.avatar, { borderColor: C.primary }]}
            />
            <Text testID="profile-username" style={[styles.name, { color: C.textPrimary }]}>{profile?.username}</Text>
            <TouchableOpacity testID="profile-edit-avatar-button" onPress={handleEditAvatar}>
              <Text style={[styles.edit, { color: C.primary }]}>Chỉnh ảnh</Text>
            </TouchableOpacity>

            <View style={styles.iinviteWrapper}>
              <TouchableOpacity
                testID="profile-invite-button"
                style={styles.invite}
                onPress={() => setShareModal(true)}
              >
                <Text style={[styles.inviteText, { color: C.textPrimary }]}>Mời bạn bè tham gia Locket!</Text>
                <Icon name="share" size={18} color={C.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* List Items */}
          <Text style={[styles.section, { color: C.textSecondary }]}>Tổng quát</Text>
          <Item
            icon="person"
            label="Sửa tên"
            value={profile?.username || 'Chưa thiết lập'}
            onPress={() => openEdit('username', profile?.username || null)}
            testID="profile-edit-username-item"
          />
          <Item
            icon="phone"
            label="Thay đổi số điện thoại"
            value={profile?.sdt || 'Chưa thiết lập'}
            onPress={() => openEdit('sdt', profile?.sdt || null)}
            testID="profile-edit-phone-item"
          />
          <Item
            icon="email"
            label="Thay đổi email"
            value={profile?.mail || 'Chưa thiết lập'}
            onPress={() => openEdit('mail', profile?.mail || null)}
            testID="profile-edit-email-item"
          />

          <Text style={[styles.section, { color: C.textSecondary }]}>Riêng tư & bảo mật</Text>
          <Item
            icon="lock"
            label="Đổi mật khẩu"
            value="••••••••"
            onPress={() => setPasswordModal(true)}
            testID="profile-change-password-item"
          />

          {/* Giao diện */}
          <Text style={[styles.section, { color: C.textSecondary }]}>Giao diện</Text>
          <View style={[styles.item, { backgroundColor: C.surface, borderLeftColor: C.primary }]}>
            <Icon name={isDark ? 'dark-mode' : 'light-mode'} size={22} color={C.primary} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={[styles.label, { color: C.textPrimary }]}>Chế độ tối</Text>
              <Text style={[styles.value, { color: C.textSecondary }]}>{isDark ? 'Đang bật' : 'Đang tắt'}</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: C.textHint, true: C.primary }}
              thumbColor={C.primary}
            />
          </View>

          <Text style={[styles.section, { color: C.textSecondary }]}>Vùng nguy hiểm</Text>
          <Item icon="delete" label="Xóa tài khoản" danger onPress={() => { }} testID="profile-delete-account-item" />
          <Item icon="logout" label="Đăng xuất" onPress={() => authController.logout(navigation)} testID="profile-logout-item" />
        </ScrollView>

        {/* Modals */}
        <Modal
          visible={isModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={[styles.overlay, { backgroundColor: C.modalOverlay }]} testID="profile-edit-modal">
            <View style={[styles.modalContent, { backgroundColor: C.surfaceStrong, borderColor: C.borderAccent }]}>
              <Text style={[styles.modalTitle, { color: C.textPrimary }]}>
                Cập nhật{' '}
                {currentField === 'username' ? 'tên' : currentField === 'sdt' ? 'SĐT' : 'Email'}
              </Text>
              <TextInput
                testID="profile-edit-modal-input"
                style={[styles.input, { backgroundColor: C.inputBg, borderColor: C.inputBorder, color: C.textPrimary }]}
                value={tempValue}
                onChangeText={setTempValue}
                autoFocus
                placeholder="Nhập thông tin mới..."
                placeholderTextColor={C.textHint}
                keyboardAppearance={C.statusBar === 'dark-content' ? 'light' : 'dark'}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  testID="profile-edit-modal-cancel"
                  style={[styles.btn, { backgroundColor: C.btnCancel }]}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Text style={[styles.btnTextCancel, { color: C.btnCancelText }]}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  testID="profile-edit-modal-save"
                  style={[styles.btn, styles.btnSave, { backgroundColor: C.primary }]}
                  onPress={handleSave}
                >
                  <Text style={[styles.btnTextSave, { color: C.btnPrimaryText }]}>Lưu</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={passwordModal} transparent animationType="slide">
          <View style={[styles.overlay, { backgroundColor: C.modalOverlay }]} testID="profile-password-modal">
            <View style={[styles.modalContent, { backgroundColor: C.surfaceStrong, borderColor: C.borderAccent }]}>
              <Text style={[styles.modalTitle, { color: C.textPrimary }]}>Đổi mật khẩu</Text>
              <TextInput
                testID="profile-old-password-input"
                style={[styles.input, { backgroundColor: C.inputBg, borderColor: C.inputBorder, color: C.textPrimary }]}
                placeholder="Mật khẩu hiện tại"
                placeholderTextColor={C.textHint}
                keyboardAppearance={C.statusBar === 'dark-content' ? 'light' : 'dark'}
                secureTextEntry
                value={passwordData.oldPass}
                onChangeText={(text) => setPasswordData({ ...passwordData, oldPass: text })}
              />
              <TextInput
                testID="profile-new-password-input"
                style={[styles.input, { backgroundColor: C.inputBg, borderColor: C.inputBorder, color: C.textPrimary }]}
                placeholder="Mật khẩu mới"
                placeholderTextColor={C.textHint}
                keyboardAppearance={C.statusBar === 'dark-content' ? 'light' : 'dark'}
                secureTextEntry
                value={passwordData.newPass}
                onChangeText={(text) => setPasswordData({ ...passwordData, newPass: text })}
              />
              <TextInput
                testID="profile-confirm-password-input"
                style={[styles.input, { backgroundColor: C.inputBg, borderColor: C.inputBorder, color: C.textPrimary }]}
                placeholder="Xác nhận mật khẩu mới"
                placeholderTextColor={C.textHint}
                keyboardAppearance={C.statusBar === 'dark-content' ? 'light' : 'dark'}
                secureTextEntry
                value={passwordData.confirmPass}
                onChangeText={(text) => setPasswordData({ ...passwordData, confirmPass: text })}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  testID="profile-password-modal-cancel"
                  style={[styles.btn, { backgroundColor: C.btnCancel }]}
                  onPress={() => setPasswordModal(false)}
                >
                  <Text style={[styles.btnTextCancel, { color: C.btnCancelText }]}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  testID="profile-password-modal-save"
                  style={[styles.btn, styles.btnSave, { backgroundColor: C.primary }]}
                  onPress={handleChangePassword}
                >
                  <Text style={[styles.btnTextSave, { color: C.btnPrimaryText }]}>Cập nhật</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={shareModal} transparent animationType="slide">
          <TouchableOpacity 
            style={[styles.overlay, { backgroundColor: C.modalOverlay }]} 
            testID="profile-share-modal"
            activeOpacity={1}
            onPress={() => setShareModal(false)}
          >
            <TouchableOpacity 
              style={[styles.modalContent, { backgroundColor: C.surfaceStrong, borderColor: C.borderAccent, paddingBottom: 30 }]}
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <ShareAppRow />
              <TouchableOpacity
                testID="profile-share-modal-close"
                style={[styles.btn, { backgroundColor: C.btnCancel, marginTop: 20 }]}
                onPress={() => setShareModal(false)}
              >
                <Text style={[styles.btnTextCancel, { color: C.btnCancelText }]}>Đóng</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </View>
    </LinearGradient>
  );
}
