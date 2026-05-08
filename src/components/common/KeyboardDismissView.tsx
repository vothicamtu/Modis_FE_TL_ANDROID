import React from 'react';
import { 
  TouchableWithoutFeedback, 
  Keyboard, 
  View, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView 
} from 'react-native';

interface KeyboardDismissViewProps {
  children: React.ReactNode;
  style?: any;
  useKeyboardAvoidingView?: boolean;
  keyboardVerticalOffset?: number;
  useScrollView?: boolean;
  scrollViewProps?: any;
}

export const KeyboardDismissView: React.FC<KeyboardDismissViewProps> = ({
  children,
  style,
  useKeyboardAvoidingView = true,
  keyboardVerticalOffset = Platform.OS === 'ios' ? 0 : 24,
  useScrollView = false,
  scrollViewProps = {},
}) => {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const content = (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={[{ flex: 1 }, style]}>
        {children}
      </View>
    </TouchableWithoutFeedback>
  );

  if (useScrollView) {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          {...scrollViewProps}
        >
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={style}>
              {children}
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  if (useKeyboardAvoidingView) {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        {content}
      </KeyboardAvoidingView>
    );
  }

  return content;
};