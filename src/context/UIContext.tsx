import React, { createContext, useState } from "react";
import { Snackbar } from "react-native-paper";

type UIContextType = {
  showMessage: (message: string) => void;
};

export const UIContext = createContext<UIContextType>({
  showMessage: () => {},
});

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
  });

  const showMessage = (message: string) => {
    setSnackbar({ visible: true, message });
  };

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
