import React, { createContext, useContext, useState } from 'react';
import { View, StyleSheet, Modal, Pressable } from 'react-native';
import { Text } from '../../components/Text';
import { theme } from '../../theme';

type ConfirmOptions = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
};

type AppAlertContextType = {
  showAlert: (title: string, message: string, onClose?: () => void) => void;
  showConfirm: (options: ConfirmOptions) => void;
};

const AppAlertContext = createContext<AppAlertContextType | undefined>(undefined);

export function AppAlertProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<'alert' | 'confirm'>('alert');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [confirmLabel, setConfirmLabel] = useState('Confirm');
  const [cancelLabel, setCancelLabel] = useState('Cancel');
  const [destructive, setDestructive] = useState(false);
  const [onCloseCb, setOnCloseCb] = useState<(() => void) | null>(null);
  const [onConfirmCb, setOnConfirmCb] = useState<(() => void) | null>(null);
  const [onCancelCb, setOnCancelCb] = useState<(() => void) | null>(null);

  function showAlert(alertTitle: string, alertMessage: string, onClose?: () => void) {
    setMode('alert');
    setTitle(alertTitle);
    setMessage(alertMessage);
    setOnCloseCb(() => onClose || null);
    setVisible(true);
  }

  function showConfirm(options: ConfirmOptions) {
    setMode('confirm');
    setTitle(options.title);
    setMessage(options.message);
    setConfirmLabel(options.confirmLabel || 'Confirm');
    setCancelLabel(options.cancelLabel || 'Cancel');
    setDestructive(!!options.destructive);
    setOnConfirmCb(() => options.onConfirm);
    setOnCancelCb(() => options.onCancel || null);
    setVisible(true);
  }

  function handleClose() {
    setVisible(false);
    if (onCloseCb) onCloseCb();
  }

  function handleConfirm() {
    setVisible(false);
    if (onConfirmCb) onConfirmCb();
  }

  function handleCancel() {
    setVisible(false);
    if (onCancelCb) onCancelCb();
  }

  return (
    <AppAlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}

      <Modal visible={visible} transparent animationType="fade" onRequestClose={mode === 'confirm' ? handleCancel : handleClose}>
        <View style={styles.overlay}>
          <View style={styles.box}>
            <Text variant="h3" color="#0D1B4B" style={{ marginBottom: 8 }}>
              {title}
            </Text>
            <Text variant="bodyMd" color={theme.colors.inkSoft} style={{ marginBottom: 20 }}>
              {message}
            </Text>

            {mode === 'alert' ? (
              <Pressable style={styles.primaryButton} onPress={handleClose}>
                <Text variant="bodyMd" color="#fff" style={{ fontWeight: '600' }}>OK</Text>
              </Pressable>
            ) : (
              <View style={styles.buttonRow}>
                <Pressable style={styles.cancelButton} onPress={handleCancel}>
                  <Text variant="bodyMd" color="#0D1B4B" style={{ fontWeight: '600' }}>{cancelLabel}</Text>
                </Pressable>
                <Pressable
                  style={[styles.primaryButton, { flex: 1 }, destructive && styles.destructiveButton]}
                  onPress={handleConfirm}
                >
                  <Text variant="bodyMd" color="#fff" style={{ fontWeight: '600' }}>{confirmLabel}</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </AppAlertContext.Provider>
  );
}

export function useAppAlert() {
  const context = useContext(AppAlertContext);
  if (context === undefined) {
    throw new Error('useAppAlert must be used within an AppAlertProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(13, 27, 75, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
  },
  primaryButton: {
    backgroundColor: '#3AAFA9',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  destructiveButton: {
    backgroundColor: '#E53935',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#DCE8F0',
  },
});