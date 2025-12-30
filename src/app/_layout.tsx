import { Slot } from "expo-router";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";

import { ThemeProvider } from "../context/ThemeContext";
import useTheme from "../hooks/useTheme";
import { createPaperTheme } from "../theme/paperTheme";
import { store } from "../store";
import useAppDispatch from "../hooks/useAppDispatch";
import { restoreSession } from "../features/auth/authSlice";

SplashScreen.preventAutoHideAsync();

function Bootstrap() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, []);

  return null;
}

function Providers() {
  const { theme } = useTheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <PaperProvider theme={createPaperTheme(theme)}>
      <Slot />
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Bootstrap />
        <Providers />
      </ThemeProvider>
    </Provider>
  );
}
