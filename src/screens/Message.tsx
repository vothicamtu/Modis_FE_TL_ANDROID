import { StyleSheet, Text, View } from "react-native";
import { useColors } from "../hook/useColors";

function MessageScreen() {
    const C = useColors();
    return (
        <View style={[style.container, { backgroundColor: C.bgGradient[0] }]}>
            <Text style={{ color: C.textPrimary }}>Giao diện nhắn tin</Text>
        </View>
    )
}
const style = StyleSheet.create({
    container: {
        flex: 1,
    },
})

export default MessageScreen