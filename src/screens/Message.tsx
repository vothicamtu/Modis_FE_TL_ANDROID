import { StyleSheet, Text, View, SafeAreaView } from "react-native";

// type ReactEmojiCommentProps = {
//     goToHome: () => void;
// };

function MessageScreen() {
    return (
        <View style={style.container}>
            <Text>Giao diện nhắn tin</Text>
        </View>
    )
}
const style = StyleSheet.create({
    container: {
        display: "flex",
        flex: 1,
        backgroundColor: "green",
    },
})

export default MessageScreen