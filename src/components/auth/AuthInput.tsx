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
      <View 
        style={[
          formStyles.input, 
          { paddingHorizontal: 0, paddingVertical: 0, overflow: 'hidden' },
          focused && styles.inputFocused
        ]}
      >
        <TextInput
          testID={testID}
          style={{ 
            paddingVertical: 14, 
            paddingHorizontal: 16, 
            fontSize: 15, 
            color: Colors.text_primary, 
            backgroundColor: 'transparent',
            width: '100%',
          }}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.text_hint}
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

const styles = StyleSheet.create({
  inputFocused: {
    borderColor: Colors.primary,
    borderWidth: 2,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.6)', // Sáng hơn và rõ ràng hơn
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
});
