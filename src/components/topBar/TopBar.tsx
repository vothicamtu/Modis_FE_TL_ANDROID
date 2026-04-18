import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  Pressable,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Colors from '../../styles/color';
import { Friend, FriendDTO } from '../../types';
import FriendRow from './FriendRow';
import friendsController from '../../controller/friends.controller';
import { profileController } from '../../controller/profile.controller';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { on } from '../../utils/eventBus';
import { styles } from '../../styles/TopBar.styles';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Props {
  variant?: 'home' | 'filter';
  goToProfile?: () => void;
  goToMessage?: () => void;
  onSelectedUserId?: (id: string) => void;
  canTransform: boolean;
  onFilterChange?: (selectedId: string) => void;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

const TopBar: React.FC<Props> = ({
  variant,
  goToMessage,
  goToProfile,
  onSelectedUserId,
  canTransform,
  onFilterChange,
  showBackButton,
  onBackPress,
}) => {
  const navigation = useNavigation<any>();

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('Tất cả bạn bè');
  const [friendsList, setFriendsList] = useState<FriendDTO[]>([]);
  const [friendCount, setFriendCount] = useState(0);

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      console.warn('Cannot go back: No history and no onBackPress provided');
    }
  };

  //  Load avatar (ưu tiên AsyncStorage -> nhanh + realtime)
  const loadAvatar = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      const cached = await AsyncStorage.getItem(`avatarUrl_${userId}`);
      if (cached) {
        setAvatarUrl(cached);
        return;
      }

      const res: any = await profileController.getProfile();
      const url = res?.avatarUrl || res?.data?.avatarUrl;
      if (url) {
        setAvatarUrl(url);
        await AsyncStorage.setItem(`avatarUrl_${userId}`, url);
      }
    } catch (err) {
      console.log('Load avatar lỗi:', err);
    }
  };

  //  Load khi mount
  useEffect(() => {
    loadAvatar();
  }, []);

  //  Load lại mỗi khi quay về màn hình
  useFocusEffect(
    useCallback(() => {
      loadAvatar();
    }, [])
  );

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  // Load danh sách bạn bè
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const rawFriends: Friend[] = await friendsController.getFriends();
        setFriendCount(rawFriends.length);

        const mappedFriends: FriendDTO[] = rawFriends.map((f) => ({
          _id: f.userId,
          fullname: f.fullname || f.username || 'Unknown',
          avatarUrl: f.avatarUrl || '',
        }));

        const allOption: FriendDTO = {
          _id: 'ALL',
          fullname: 'Tất cả bạn bè',
          avatarUrl: '',
        };

        setFriendsList([allOption, ...mappedFriends]);
      } catch (err) {
        console.log('Lỗi lấy danh sách bạn bè:', err);
      }
    };

    fetchFriends();
    
    const off = on('friendsUpdated', () => {
      fetchFriends();
    });
    return off;
  }, []);

  useEffect(() => {
     const off = on('avatarUpdated', () => {
       loadAvatar();
     });
     return off;
   }, []);

  const handleSelectFriend = (item: FriendDTO) => {
    setSelectedLabel(item.fullname);
    setDropdownVisible(false);
    onSelectedUserId?.(item._id);
    onFilterChange?.(item._id);
  };

  const renderCenterContent = () => {
    if (variant === 'home') {
      return (
        <Pressable
          testID="topbar-friends-button"
          style={styles.homeFriendsButton}
          onPress={() => navigation.navigate('FriendsScreen')}
        >
          <View style={styles.box_friends}>
            <Image
              source={require('../../assets/image/image.png')}
              style={{ width: 48, height: 48 }}
              resizeMode="contain"
            />
            <Text testID="topbar-friend-count" style={styles.homeTextCount}>{friendCount}</Text>
            <Text style={styles.homeTextLabel}>Bạn bè</Text>
          </View>
        </Pressable>
      );
    }

    return (
      <TouchableOpacity testID="topbar-filter-button" style={styles.filterButton} onPress={toggleDropdown}>
        <Text testID="topbar-filter-label" style={styles.title} numberOfLines={1}>
          {selectedLabel}
        </Text>
        <View style={styles.arrowDown} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container} testID="topbar">
      {/* Nút Back hoặc Avatar */}
      {showBackButton ? (
        <TouchableOpacity
          testID="topbar-back-button"
          style={styles.iconButton}
          onPress={handleBack}
        >
          <Icon name="arrow-back" size={24} color={Colors.text_primary} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          testID="topbar-avatar-button"
          style={styles.iconButton}
          onPress={() => {
            if (canTransform && goToProfile) {
              goToProfile();
            } else {
              navigation.navigate('ProfileScreen');
            }
          }}
        >
          <Image
            testID="topbar-avatar-image"
            source={
              avatarUrl
                ? { uri: avatarUrl }
                : require('../../assets/image/avt.png')
            }
            style={styles.avatarImage}
          />
        </TouchableOpacity>
      )}

      {renderCenterContent()}

      {/* Message */}
      <TouchableOpacity
        testID="topbar-message-button"
        onPress={() => {
          if (canTransform && goToMessage) {
            goToMessage();
          } else {
            navigation.navigate('MessageScreen');
          }
        }}
        style={styles.iconButton}
      >
        <Image
          source={require('../../assets/image/message_circle.png')}
          style={styles.iconImage}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Dropdown */}
      <Modal transparent animationType="fade" visible={dropdownVisible}>
        <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
          <View style={styles.mask}>
            <TouchableWithoutFeedback>
              <View testID="topbar-dropdown" style={styles.dropdownBoard}>
                <View style={styles.separator} />

                <FlatList
                  testID="topbar-friends-dropdown-list"
                  data={friendsList}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <FriendRow
                      item={item}
                      onPress={() => handleSelectFriend(item)}
                    />
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default TopBar;
