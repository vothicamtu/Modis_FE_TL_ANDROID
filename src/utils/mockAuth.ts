import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MockUser {
    userId: string;
    username: string;
    email: string;
    accessToken: string;
    refreshToken: string;
}

export const MOCK_USERS: Record<string, MockUser> = {
    user1: {
        userId: '',
        username: 'u001',
        email: 'user1@example.com',
        accessToken: '',
        refreshToken: '',
    },
    user2: {
        userId: '',
        username: 'u002',
        email: 'user2@example.com',
        accessToken: '',
        refreshToken: '',
    },
};

export const mockLogin = async (userKey: keyof typeof MOCK_USERS = 'user1'): Promise<boolean> => {
    try {
        const user = MOCK_USERS[userKey];
        console.log('Attempting mock login for user:', userKey);
        if (!user) {
            console.error(`Mock user ${userKey} not found`);
            return false;
        }

        // Save to AsyncStorage (same as real login)
        await AsyncStorage.multiSet([
            ['userId', user.userId],
            ['username', user.username],
            ['email', user.email],
            ['accessToken', user.accessToken],
            ['refreshToken', user.refreshToken],
        ]);

        console.log(`Mock login successful as ${user.username} (${user.userId})`);
        return true;
    } catch (error) {
        console.error('Mock login failed:', error);
        return false;
    }
};

export const mockLogout = async (): Promise<void> => {
    try {
        await AsyncStorage.multiRemove([
            'userId',
            'username',
            'email',
            'accessToken',
            'refreshToken',
        ]);
        console.log('Mock logout successful');
    } catch (error) {
        console.error('Mock logout failed:', error);
    }
};

export const getMockUserInfo = async (): Promise<MockUser | null> => {
    try {
        const [userId, username, email, accessToken, refreshToken] = await AsyncStorage.multiGet([
            'userId',
            'username',
            'email',
            'accessToken',
            'refreshToken',
        ]);

        if (!userId[1]) return null;

        return {
            userId: userId[1],
            username: username[1] || '',
            email: email[1] || '',
            accessToken: accessToken[1] || '',
            refreshToken: refreshToken[1] || '',
        };
    } catch (error) {
        console.error('Failed to get mock user info:', error);
        return null;
    }
};

export const isMockLoggedIn = async (): Promise<boolean> => {
    try {
        const token = await AsyncStorage.getItem('accessToken');
        return token !== null;
    } catch (error) {
        return false;
    }
};

export default {
    mockLogin,
    mockLogout,
    getMockUserInfo,
    isMockLoggedIn,
    MOCK_USERS,
};
