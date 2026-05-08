import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { styles as formStyles } from '../../styles/loginScreen.styles';
import { useColors } from '../../hook/useColors';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: any;
  testID?: string;
}

export const AuthInput = ({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, testID }: Props) => {
  const [focused, setFocused] = useState(false);
  const C = useColors();
  const { isDark } = useTheme();

  return (
    <View style={formStyles.inputContainer}>
      <Text style={[formStyles.label, { color: C.textSecondary }]}>{label}</Text>
      <View
        style={[
          formStyles.input,
          { 
            paddingHorizontal: 0, 
            paddingVertical: 0, 
            overflow: 'hidden', 
            borderColor: C.inputBorder, 
            backgroundColor: C.inputBg 
          },
          focused && { 
            borderColor: C.primary, 
            borderWidth: 2, 
            borderRadius: 26, 
            shadowColor: C.primary, 
            shadowOffset: { width: 0, height: 4 }, 
            shadowOpacity: 0.3, 
            shadowRadius: 10, 
            elevation: 8 
          },
        ]}
      >
        <TextInput
          testID={testID}
          style={{
            paddingVertical: 14,
            paddingHorizontal: 16,
            fontSize: 15,
            color: C.textPrimary,
            backgroundColor: 'transparent',
            width: '100%',
          }}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={C.textHint}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          keyboardType={keyboardType}
          underlineColorAndroid="transparent"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
    </View>
  );
};
