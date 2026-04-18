import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Alert } from 'react-native';
import FriendsScreen from "../screens/FriendsScreen"
import HomeScreen from '../screens/Home'
import SendPhotoScreen from '../screens/Send_photo';
import AllImagesScreen from '../screens/AllImage';
import MessageScreen from '../components/messages/chat_list/MessageScreen';
import ConversationScreen from '../components/messages/conversation/ConversationScreen';
import UserStatsScreen from '../screens/UserStatsScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import LoadingScreen from '../screens/LoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ProfileScreen from '../screens/ProfileScreen';
export type RootStackParamList = {
    LoadingScreen: undefined;
    LoginScreen: undefined;
    SignupScreen: undefined;
    HomeScreen: undefined;
    SendPhotoScreen: { photoUri: string };
    AllImagesScreen: undefined;
    FriendsScreen: undefined;
    UserStatsScreen: undefined;
    MessageScreen: undefined;
    ConversationScreen: {
        conversationId: string;
        receiverId: string;
        receiverName: string;
        receiverAvatar?: string | null;
        initialMessage?: string;
    };
    ProfileScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigation() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="LoadingScreen"
                    screenOptions={{
                        headerShown: false,
                        animation: 'fade',
                    }}
                >
                    <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
                    <Stack.Screen name="LoginScreen" component={LoginScreen} />
                    <Stack.Screen name="SignupScreen" component={SignupScreen} />
                    <Stack.Screen name="HomeScreen" component={HomeScreen} />
                    <Stack.Screen name="SendPhotoScreen" component={SendPhotoScreen} />
                    <Stack.Screen name="AllImagesScreen" component={AllImagesScreen} />
                    <Stack.Screen name="FriendsScreen" component={FriendsScreen} />
                    <Stack.Screen name="UserStatsScreen" component={UserStatsScreen} />
                    <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
                    <Stack.Screen name="MessageScreen" component={MessageScreen} />
                    <Stack.Screen name="ConversationScreen" component={ConversationScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}