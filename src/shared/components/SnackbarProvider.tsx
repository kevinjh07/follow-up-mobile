import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

interface SnackbarContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
}

interface SnackbarProviderProps {
  children: React.ReactNode;
}

export function SnackbarProvider({ children }: SnackbarProviderProps) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'error' | 'info'>('info');

  const showMessage = useCallback((msg: string, msgType: 'success' | 'error' | 'info') => {
    setMessage(msg);
    setType(msgType);
    setVisible(true);
  }, []);

  const showSuccess = useCallback(
    (message: string) => showMessage(message, 'success'),
    [showMessage],
  );
  const showError = useCallback((message: string) => showMessage(message, 'error'), [showMessage]);
  const showInfo = useCallback((message: string) => showMessage(message, 'info'), [showMessage]);

  const onDismiss = useCallback(() => setVisible(false), []);

  const backgroundColor = type === 'success' ? '#4caf50' : type === 'error' ? '#b00020' : '#2196f3';

  return (
    <SnackbarContext.Provider value={{ showSuccess, showError, showInfo }}>
      {children}
      <View style={styles.snackbarContainer}>
        <Snackbar
          visible={visible}
          onDismiss={onDismiss}
          duration={3000}
          style={[styles.snackbar, { backgroundColor }]}
          action={{
            label: 'OK',
            onPress: onDismiss,
          }}
        >
          {message}
        </Snackbar>
      </View>
    </SnackbarContext.Provider>
  );
}

const styles = StyleSheet.create({
  snackbarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  snackbar: {
    marginBottom: 0,
  },
});
