import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import color from '../../../styles/color';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {
    goToHome: () => void;
}

function MessagesHeader({ goToHome }: Props) {
    return (
        <View testID="messages-header" style={styles.headerContainer}>
            <TouchableOpacity 
                testID="messages-header-back-button"
                onPress={goToHome} 
                style={styles.backButtonModern}
            >
                <Icon name="arrow-back" size={24} color={color.text_primary} />
            </TouchableOpacity>
            <Text testID="messages-header-title" style={styles.headerText}>Tin nhắn</Text>
            <View style={{ width: 44 }} />
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingTop: 0,    // Đã có View padding bên ngoài
        paddingBottom: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent', // Đồng bộ không nền
    },
    backButtonModern: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 22,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    backBtn: {
        width: 36,
        height: 36,
        justifyContent: 'center',
    },
    backIcon: {
        width: 22,
        height: 22,
        tintColor: color.text_secondary,
    },
    headerText: {
        flex: 1,
        fontSize: 18,
        fontWeight: '700',
        color: color.text_primary,
        textAlign: 'center',
        letterSpacing: 0.2,
    },
});

export default MessagesHeader;
