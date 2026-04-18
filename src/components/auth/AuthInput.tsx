import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { styles as formStyles } from '../../styles/loginScreen.styles';
import Colors from '../../styles/color';

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

  return (
    <View style={formStyles.inputContainer}>
      <Text style={formStyles.label}>{label}</Text>
      <TextInput
        testID={testID}
        style={[
          formStyles.input,
          focused && styles.inputFocused,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.text_hint}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        keyboardType={keyboardType}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputFocused: {
    borderColor: Colors.accent,
    borderWidth: 2,
    borderRadius: 14,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
});
