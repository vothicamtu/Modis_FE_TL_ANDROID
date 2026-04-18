import React from "react";
import {styles} from "../styles/Page_Component.styles"
import { View, StatusBar, Pressable, Image, StyleSheet, Text } from "react-native";
import Colors from "../styles/color";

type ReactEmojiCommentProps = {
    goToMessage: () => void;
};

function Page_component({goToMessage}: ReactEmojiCommentProps) {
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.black} barStyle="light-content" />
            <View style={styles.toggle_friends}>
                <Pressable
                    onPress={() => {}}
                    style={{ width: 40, height: 40 }}>
                    <View style={styles.gray_circle_border}>
                        <Image
                            source={require('../assets/image/account_icon.png')}
                            style={{ width: '80%', height: '80%', }} />
                    </View>
                </Pressable>
                <Pressable
                    onPress={goToMessage}
                    style={{ width: 40, height: 40 }}>
                    <View style={styles.gray_circle_border}>
                        <Image
                            source={require('../assets/image/message_circle.png')}
                            style={{ width: '70%', height: '70%' }} />
                    </View>
                </Pressable>
            </View>
        </View>
    );
}

export default Page_component