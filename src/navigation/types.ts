export type RootStackParamList = {
    LoadingScreen: undefined;
    LoginScreen: undefined;
    SignupScreen: undefined;
    HomeScreen: undefined;
    SendPhotoScreen: { photoUri: string };
    AllImagesScreen: undefined;
    FriendsScreen: undefined;
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
