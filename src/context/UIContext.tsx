import React, { createContext, useState } from "react";
import { Snackbar } from "react-native-paper";

type UIContextType = {
  showMessage: (message: string) => void;
};

export const UIContext = createContext<UIContextType>({
  showMessage: () => {},
});

let externalShowMessage: ((msg: string) => void) | null = null;

export const setExternalShowMessage = (fn: (msg: string) => void) => {
  externalShowMessage = fn;
};

export const showGlobalMessage = (message: string) => {
  externalShowMessage?.(message);
};

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
  });

  const showMessage = (message: string) => {
    setSnackbar({ visible: true, message });
  };
  setExternalShowMessage(showMessage);

  return (
    <UIContext.Provider value={{ showMessage }}>
      {children}
      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ visible: false, message: "" })}
        duration={3000}
      >
        {snackbar.message}
      </Snackbar>
    </UIContext.Provider>
  );
}
