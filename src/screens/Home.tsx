import 'react-native-reanimated';
import React, { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Dimensions, StatusBar } from 'react-native';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import TakeScreen from './Take';
import MessageScreen from '../components/messages/chat_list/MessageScreen';
import React_emoji_comment from './React_emoji_comment';
import ProfileScreen from './ProfileScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

function HomeScreen() {
    // Hàng (dọc) và Cột (ngang)
    const activeRow = useSharedValue(0); // 0 = top row, 1 = bottom row
    const activeCol = useSharedValue(1); // 0 = trái, 1 = giữa, 2 = phải

    // Vị trí ban đầu: cột giữa
    const translateX = useSharedValue(-width * 1);
    const translateY = useSharedValue(0);


    useFocusEffect(
        useCallback(() => {
            translateY.value = 0
            activeRow.value = 0
        }, [])
    )

    const gesture = Gesture.Pan()
        .simultaneousWithExternalGesture()
        .activeOffsetX([-20, 20])   // kích hoạt khi vuốt ngang ≥ 20px
        .activeOffsetY([-30, 30])   // kích hoạt khi vuốt dọc ≥ 30px (cho Take→React)
        .onEnd((e) => {
            const { translationX, translationY } = e;
            const absX = Math.abs(translationX)
            const absY = Math.abs(translationY)
            if (absY > absX && activeCol.value === 1) {
                // --- xử lý dọc ---
                if (translationY < -height / 4 && activeRow.value < 1) {
                    activeRow.value += 1; // vuốt lên
                } else if (translationY > height / 4 && activeRow.value > 0) {
                    activeRow.value -= 1; // vuốt xuống
                }
            }
            if (absX > absY) {
                // --- xử lý ngang ---
                if (translationX < -width / 4 && activeCol.value < 2) {
                    activeCol.value += 1; // vuốt sang trái
                } else if (translationX > width / 4 && activeCol.value > 0) {
                    activeCol.value -= 1; // vuốt sang phải
                }
            }

            // --- cập nhật vị trí ---
            translateX.value = withTiming(-activeCol.value * width, { duration: 400 });
            translateY.value = withTiming(-activeRow.value * height, { duration: 400 });
        })


    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
        ],
    }));

    const goToHome = () => {
        activeRow.value = 0;
        activeCol.value = 1;
        translateX.value = withTiming(-width * 1, { duration: 400 });
        translateY.value = withTiming(0, { duration: 400 });
    };

    const goToMessage = () => {
        if (activeRow.value === 0) {
            activeRow.value = 0
            translateY.value = withTiming(0, { duration: 400 })
        } else if (activeRow.value === 1) {
            activeRow.value = 1
            translateY.value = withTiming(-height, { duration: 400 })
        }
        translateX.value = withTiming(-width * 2, { duration: 400 })
        activeCol.value = 2
    }
    const goToProfile = () => {
        if (activeRow.value === 0) {
            activeRow.value = 0
            translateY.value = withTiming(0, { duration: 400 })
        } else if (activeRow.value === 1) {
            activeRow.value = 1
            translateY.value = withTiming(-height, { duration: 400 })
        }
        translateX.value = withTiming(0, { duration: 400 })
        activeCol.value = 0

    }
    return (
        <SafeAreaView style={{ flex: 1, overflow: 'hidden' }}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <GestureHandlerRootView style={{ flex: 1 }}>
                <GestureDetector gesture={gesture}>
                    <Animated.View
                        style={[
                            {
                                width: width * 3,  // 3 cột
                                height: height * 2, // 2 hàng
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                            },
                            animatedStyle,
                        ]}
                    >
                        {/* Hàng 0 */}
                        <View style={{ width, height }}>
                            <ProfileScreen goToHome={goToHome} />
                        </View>
                        <View style={{ width, height }}>
                            <TakeScreen goToMessage={goToMessage} goToProfile={goToProfile}/>
                        </View>
                        <View style={{ width, height }}>
                            <MessageScreen goToHome={goToHome}/>
                        </View>

                        {/* Hàng 1 */}
                        <View style={{ width, height }}>
                            <ProfileScreen goToHome={goToHome} />
                        </View>
                        <View style={{ width, height }}>
                            <React_emoji_comment goToHome={goToHome} goToMessage={goToMessage} goToProfile={goToProfile} panGesture={gesture} />

                        </View>
                        <View style={{ width, height }}>
                            <MessageScreen goToHome={goToHome}/>
                        </View>
                    </Animated.View>
                </GestureDetector>
            </GestureHandlerRootView>
        </SafeAreaView>
    );
}

export default HomeScreen;
