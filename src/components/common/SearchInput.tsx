import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Platform,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useColors } from '../../hook/useColors';
import { scale, getMinTouchArea, getFontSize } from '../../utils/responsive';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmitEditing?: () => void;
  autoFocus?: boolean;
  style?: any;
  inputStyle?: any;
  showClearButton?: boolean;
  clearButtonStyle?: any;
  leftIcon?: string;
  leftIconSize?: number;
  rightIcon?: string;
  rightIconSize?: number;
  onRightIconPress?: () => void;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityRole?: 'search' | 'text';
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Tìm kiếm...',
  onClear,
  onFocus,
  onBlur,
  onSubmitEditing,
  autoFocus = false,
  style,
  inputStyle,
  showClearButton = true,
  clearButtonStyle,
  leftIcon = 'search',
  leftIconSize = 20,
  rightIcon,
  rightIconSize = 20,
  onRightIconPress,
  testID,
  accessibilityLabel,
  accessibilityRole = 'search',
}) => {
  const C = useColors();
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: value.length > 0 ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [value, fadeAnim]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocus?.();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

  const handleClear = useCallback(() => {
    onChangeText('');
    onClear?.();
    Keyboard.dismiss();
    inputRef.current?.blur();
  }, [onChangeText, onClear]);

  const minTouchArea = getMinTouchArea();

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: C.inputBg,
          borderRadius: scale(12),
          borderWidth: 1,
          borderColor: isFocused ? C.primary : C.inputBorder,
          paddingHorizontal: scale(12),
          height: scale(48),
          marginHorizontal: scale(16),
          marginVertical: scale(8),
        },
        style,
      ]}
    >
      {leftIcon && (
        <Icon
          testID={testID ? `${testID}_left_icon` : 'search_left_icon'}
          accessibilityLabel={testID ? `${testID}_left_icon` : 'search_left_icon'}
          name={leftIcon}
          size={leftIconSize}
          color={isFocused ? C.primary : C.textHint}
          style={{ marginRight: scale(8) }}
        />
      )}

      <TextInput
        testID={testID}
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={C.textHint}
        keyboardAppearance={C.statusBar === 'dark-content' ? 'light' : 'dark'}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onSubmitEditing={onSubmitEditing}
        autoFocus={autoFocus}
        returnKeyType="search"
        style={[
          {
            flex: 1,
            fontSize: getFontSize(16),
            color: C.textPrimary,
            paddingVertical: Platform.OS === 'ios' ? scale(12) : scale(8),
          },
          inputStyle,
        ]}
        // Không dùng placeholder/text hiển thị làm accessibilityLabel; dùng ID ổn định cho automation
        accessibilityLabel={accessibilityLabel ?? testID}
        accessibilityRole={accessibilityRole}
        accessible={true}
      />

      {showClearButton && value.length > 0 && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <TouchableOpacity
            testID={testID ? `${testID}_clear_button` : 'search_clear_button'}
            onPress={handleClear}
            style={[
              {
                width: minTouchArea,
                height: minTouchArea,
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: scale(4),
              },
              clearButtonStyle,
            ]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={testID ? `${testID}_clear_button` : 'search_clear_button'}
            accessible={true}
          >
            <View
              style={{
                width: scale(20),
                height: scale(20),
                borderRadius: scale(10),
                backgroundColor: '#FFFFFF', // Always white background
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="close" size={14} color="#000000" />
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}

      {rightIcon && (
        <TouchableOpacity
          testID={testID ? `${testID}_right_icon_button` : 'search_right_icon_button'}
          onPress={onRightIconPress}
          style={{
            width: minTouchArea,
            height: minTouchArea,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: scale(4),
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel={testID ? `${testID}_right_icon_button` : 'search_right_icon_button'}
          accessible={true}
        >
          <Icon
            name={rightIcon}
            size={rightIconSize}
            color={isFocused ? C.primary : C.textHint}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};
