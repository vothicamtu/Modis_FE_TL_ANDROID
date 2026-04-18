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
import Colors from '../styles/color';

type Profile = {
  id: string;
  username: string;
  fullname: string | null;
  mail: string | null;
  sdt: string | null;
  avatarUrl?: string | null;
};

type Props = {
  goToProfile?: () => void;
};

export default function ProfileScreen({ goToProfile }: Props) {
  const navigation = useNavigation();
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
    <TouchableOpacity testID={testID} style={styles.item} onPress={onPress}>
      <Icon name={icon} size={22} color={danger ? '#ff4d4f' : Colors.primary} />
      <View style={{ marginLeft: 12 }}>
        <Text style={styles.label}>{label}</Text>
        {value && <Text style={styles.value}>{value}</Text>}
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
      <LinearGradient colors={['#ede8ff', '#e8f4ff', '#e8fff8']} style={styles.container}>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }} edges={[]}>
          <ActivityIndicator size="large" color="#FE9EC7" />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#ede8ff', '#e8f4ff', '#e8fff8']} style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          style={{ flex: 1 }}
          bounces={false}
          overScrollMode="never"
          testID="profile-scroll"
        >
          <View style={styles.back} />

          {/* Avatar Section */}
          <View style={styles.header} testID="profile-header">
            <Image
              testID="profile-avatar"
              source={
                profile?.avatarUrl
                  ? { uri: profile.avatarUrl }
                  : require('../assets/image/avt.png')
              }
              style={styles.avatar}
            />
            <Text testID="profile-username" style={styles.name}>{profile?.username}</Text>
            <TouchableOpacity testID="profile-edit-avatar-button" onPress={handleEditAvatar}>
              <Text style={styles.edit}>Chỉnh ảnh</Text>
            </TouchableOpacity>

            <View style={styles.iinviteWrapper}>
              <TouchableOpacity
                testID="profile-invite-button"
                style={styles.invite}
                onPress={() => setShareModal(true)}
              >
                <Text style={styles.inviteText}>Mời bạn bè tham gia Locket!</Text>
                <Icon name="share" size={18} color="#555" />
              </TouchableOpacity>
            </View>
          </View>

          {/* List Items */}
          <Text style={styles.section}>Tổng quát</Text>
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

          <Text style={styles.section}>Riêng tư & bảo mật</Text>
          <Item
            icon="lock"
            label="Đổi mật khẩu"
            value="••••••••"
            onPress={() => setPasswordModal(true)}
            testID="profile-change-password-item"
          />

          <Text style={styles.section}>Vùng nguy hiểm</Text>
          <Item icon="delete" label="Xóa tài khoản" danger onPress={() => { }} testID="profile-delete-account-item" />
          <Item icon="logout" label="Đăng xuất" onPress={() => authController.logout(navigation)} testID="profile-logout-item" />
        </ScrollView>

        {/* Modals — nằm ngoài ScrollView để không ảnh hưởng scroll */}
        <Modal
          visible={isModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.overlay} testID="profile-edit-modal">
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Cập nhật{' '}
                {currentField === 'username'
                  ? 'tên'
                  : currentField === 'sdt'
                    ? 'SĐT'
                    : 'Email'}
              </Text>
              <TextInput
                testID="profile-edit-modal-input"
                style={styles.input}
                value={tempValue}
                onChangeText={setTempValue}
                autoFocus
                placeholder="Nhập thông tin mới..."
                placeholderTextColor="#999"
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  testID="profile-edit-modal-cancel"
                  style={[styles.btn, styles.btnCancel]}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Text style={styles.btnTextCancel}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  testID="profile-edit-modal-save"
                  style={[styles.btn, styles.btnSave]}
                  onPress={handleSave}
                >
                  <Text style={styles.btnTextSave}>Lưu</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* --- MODAL ĐỔI MẬT KHẨU --- */}
        <Modal visible={passwordModal} transparent animationType="slide">
          <View style={styles.overlay} testID="profile-password-modal">
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Đổi mật khẩu</Text>
              <TextInput
                testID="profile-old-password-input"
                style={styles.input}
                placeholder="Mật khẩu hiện tại"
                placeholderTextColor="#999"
                secureTextEntry
                value={passwordData.oldPass}
                onChangeText={(text) => setPasswordData({ ...passwordData, oldPass: text })}
              />
              <TextInput
                testID="profile-new-password-input"
                style={styles.input}
                placeholder="Mật khẩu mới"
                placeholderTextColor="#999"
                secureTextEntry
                value={passwordData.newPass}
                onChangeText={(text) => setPasswordData({ ...passwordData, newPass: text })}
              />
              <TextInput
                testID="profile-confirm-password-input"
                style={styles.input}
                placeholder="Xác nhận mật khẩu mới"
                placeholderTextColor="#999"
                secureTextEntry
                value={passwordData.confirmPass}
                onChangeText={(text) =>
                  setPasswordData({ ...passwordData, confirmPass: text })
                }
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  testID="profile-password-modal-cancel"
                  style={[styles.btn, styles.btnCancel]}
                  onPress={() => setPasswordModal(false)}
                >
                  <Text style={styles.btnTextCancel}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  testID="profile-password-modal-save"
                  style={[styles.btn, styles.btnSave]}
                  onPress={handleChangePassword}
                >
                  <Text style={styles.btnTextSave}>Cập nhật</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* --- MODAL SHARE APP --- */}
        <Modal visible={shareModal} transparent animationType="slide">
          <View style={styles.overlay} testID="profile-share-modal">
            <View style={[styles.modalContent, { paddingBottom: 30 }]}>
              <ShareAppRow />
              <TouchableOpacity
                testID="profile-share-modal-close"
                style={[styles.btn, styles.btnCancel, { marginTop: 20 }]}
                onPress={() => setShareModal(false)}
              >
                <Text style={styles.btnTextCancel}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
}
