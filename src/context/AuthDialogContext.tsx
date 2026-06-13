import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AuthDialog } from '../components/auth/AuthDialog';

type DialogPayload = {
  title: string;
  message: string;
  okText?: string;
  onOkAfterClose?: () => void;
};

type AuthDialogContextValue = {
  showAuthDialog: (payload: DialogPayload) => void;
  hideAuthDialog: () => void;
  isAuthDialogVisible: boolean;
};

const AuthDialogContext = createContext<AuthDialogContextValue | null>(null);

export const AuthDialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [payload, setPayload] = useState<DialogPayload>({
    title: '',
    message: '',
  });

  const hideAuthDialog = useCallback(() => {
    setVisible(false);
    // giữ payload lại để tránh flicker; không ảnh hưởng automation
  }, []);

  const showAuthDialog = useCallback((next: DialogPayload) => {
    setPayload(next);
    setVisible(true);
  }, []);

  const onOk = useCallback(() => {
    hideAuthDialog();
    try {
      payload.onOkAfterClose?.();
    } catch {}
  }, [hideAuthDialog, payload]);

  const value = useMemo<AuthDialogContextValue>(
    () => ({
      showAuthDialog,
      hideAuthDialog,
      isAuthDialogVisible: visible,
    }),
    [showAuthDialog, hideAuthDialog, visible]
  );

  return (
    <AuthDialogContext.Provider value={value}>
      {children}
      <AuthDialog
        visible={visible}
        title={payload.title}
        message={payload.message}
        okText={payload.okText}
        onOk={onOk}
      />
    </AuthDialogContext.Provider>
  );
};

export const useAuthDialog = () => {
  const ctx = useContext(AuthDialogContext);
  if (!ctx) throw new Error('useAuthDialog must be used within AuthDialogProvider');
  return ctx;
};
