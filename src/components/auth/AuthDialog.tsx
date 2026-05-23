import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { useColors } from '../../hook/useColors';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  onOk: () => void;
  okText?: string;
};

/**
 * AuthDialog: custom dialog (Modal) để automation có thể locate ổn định bằng testID/accessibilityLabel.
 */
export const AuthDialog = ({ visible, title, message, onOk, okText = 'OK' }: Props) => {
  const C = useColors();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onOk}
      supportedOrientations={['portrait']}
    >
      <View
        testID="auth_dialog_container"
        accessibilityLabel="auth_dialog_container"
        accessibilityRole="alert"
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.45)',
          padding: 24,
        }}
      >
        <View
          style={{
            width: '100%',
            maxWidth: 420,
            borderRadius: 18,
            padding: 18,
            backgroundColor: C.surfaceStrong,
            borderWidth: 1,
            borderColor: C.border,
          }}
        >
          <Text
            testID="auth_dialog_title"
            accessibilityLabel="auth_dialog_title"
            style={{ color: C.textPrimary, fontSize: 18, fontWeight: '800', marginBottom: 8 }}
          >
            {title}
          </Text>
          <Text
            testID="auth_dialog_message"
            accessibilityLabel="auth_dialog_message"
            style={{ color: C.textSecondary, fontSize: 14, lineHeight: 20 }}
          >
            {message}
          </Text>

          <TouchableOpacity
            testID="auth_dialog_ok_button"
            accessibilityLabel="auth_dialog_ok_button"
            accessibilityRole="button"
            style={{
              marginTop: 16,
              alignSelf: 'flex-end',
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 12,
              backgroundColor: C.primary,
            }}
            onPress={onOk}
          >
            <Text style={{ color: C.btnPrimaryText, fontWeight: '800' }}>{okText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

