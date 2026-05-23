import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FriendsScreen from "../screens/FriendsScreen"
import HomeScreen from '../screens/Home'
import SendPhotoScreen from '../screens/Send_photo';
import AllImagesScreen from '../screens/AllImage';
import MessageScreen from '../components/messages/chat_list/MessageScreen';
import ConversationScreen from '../components/messages/conversation/ConversationScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import LoadingScreen from '../screens/LoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { RootStackParamList } from './types';
import { ThemeProvider } from '../context/ThemeContext';
import { useColors } from '../hook/useColors';
import { AuthDialogProvider } from '../context/AuthDialogContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

function NavigationContent() {
    const C = useColors();
    
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="LoadingScreen"
                screenOptions={{
                    headerShown: false,
                    animation: 'fade',
                    statusBarTranslucent: true,
                    headerTintColor: C.textPrimary,
                    headerStyle: {
                        backgroundColor: C.bg,
                    },
                }}
            >
                    <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
                    <Stack.Screen name="LoginScreen" component={LoginScreen} />
                    <Stack.Screen name="SignupScreen" component={SignupScreen} />
                    <Stack.Screen name="HomeScreen" component={HomeScreen} />
                    <Stack.Screen name="SendPhotoScreen" component={SendPhotoScreen} />
                    <Stack.Screen name="AllImagesScreen" component={AllImagesScreen} 
                        options={{ statusBarTranslucent: true }} />
                    <Stack.Screen name="FriendsScreen" component={FriendsScreen}
                        options={{ statusBarTranslucent: true }} />
                    <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
                    <Stack.Screen name="MessageScreen" component={MessageScreen} />
                    <Stack.Screen name="ConversationScreen" component={ConversationScreen} />
                </Stack.Navigator>
            </NavigationContainer>
    );
}

export default function AppNavigation() {
    return (
        <ThemeProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <AuthDialogProvider>
                    <NavigationContent />
                </AuthDialogProvider>
            </GestureHandlerRootView>
        </ThemeProvider>
    );
}
