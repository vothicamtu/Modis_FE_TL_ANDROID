import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { styles as formStyles } from '../../styles/loginScreen.styles';
import { useColors } from '../../hook/useColors';

interface Props {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: any;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityRole?: 'text' | 'search';
}

export const AuthInput = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry, 
  keyboardType, 
  testID,
  accessibilityLabel,
  accessibilityRole = 'text'
}: Props) => {
  const [focused, setFocused] = useState(false);
  const C = useColors();

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
            borderColor: focused ? C.primary : C.inputBorder, // Dynamic border color
            backgroundColor: C.inputBg,
            borderWidth: focused ? 2 : 1.5, // Dynamic border width
          },
          focused && { 
            shadowColor: C.primary, 
            shadowOffset: { width: 0, height: 4 }, 
            shadowOpacity: 0.2, // Reduced shadow opacity
            shadowRadius: 8, // Reduced shadow radius
            elevation: 4 // Reduced elevation
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
          keyboardAppearance={C.statusBar === 'dark-content' ? 'light' : 'dark'}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          keyboardType={keyboardType}
          underlineColorAndroid="transparent"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={accessibilityLabel || testID || placeholder}
          accessibilityRole={accessibilityRole}
          accessible={true}
        />
      </View>
    </View>
  );
};
