import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useColors } from '../../../hook/useColors';

type Props = {
    goToHome: () => void;
}

function MessagesHeader({ goToHome }: Props) {
    const C = useColors();
    return (
        <View testID="messages-header" style={styles.headerContainer}>
            <TouchableOpacity
                testID="messages-header-back-button"
                onPress={goToHome}
                style={[styles.backButtonModern, { backgroundColor: C.msgBackBtn, shadowColor: C.msgBackBtnShadow }]}
            >
                <Icon name="arrow-back" size={24} color={C.msgIcon} />
            </TouchableOpacity>
            <Text testID="messages-header-title" style={[styles.headerText, { color: C.msgTitle }]}>Tin nhắn</Text>
            <View style={{ width: 44 }} />
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingTop: 0,
        paddingBottom: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    backButtonModern: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerText: {
        flex: 1,
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        letterSpacing: 0.2,
    },
});

export default MessagesHeader;
