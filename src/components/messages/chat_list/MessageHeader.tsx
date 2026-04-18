import { View, Text, StyleSheet } from 'react-native';
import color from '../../../styles/color';

type Props = {
    goToHome: () => void;
}

function MessagesHeader({ goToHome }: Props) {
    return (
        <View testID="messages-header" style={styles.headerContainer}>
            {/* spacer — keeps title centered */}
            <View style={styles.backBtn} />
            <Text testID="messages-header-title" style={styles.headerText}>Messages</Text>
            <View style={styles.backBtn} />
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: color.surface_strong,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(159,165,174,0.25)',
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
