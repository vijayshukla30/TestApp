import { Slot } from "expo-router";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { Provider } from "react-redux";

import { store } from "../store";
import useAppDispatch from "../hooks/useAppDispatch";
import { restoreSession } from "../features/auth/authSlice";
import "../../global.css";
import { ThemeProvider } from "../context/ThemeProvider";

SplashScreen.preventAutoHideAsync();

function Bootstrap() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, []);

  return null;
}

function AppShell() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Bootstrap />
        <AppShell />
      </ThemeProvider>
    </Provider>
  );
}
