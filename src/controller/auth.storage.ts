import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginResponse } from '../types/auth/auth';

export const authStorage = {
  saveAuth: async (data: {
    token: string;
    id: string;
    username: string;
  }) => {
    await AsyncStorage.multiSet([
      ['userToken', data.token],
      ['userId', String(data.id)],
      ['username', data.username],
    ]);
  },

  clearAuth: async () => {
    await AsyncStorage.multiRemove([
      'userToken',
      'userId',
      'username',
    ]);
  },
};
