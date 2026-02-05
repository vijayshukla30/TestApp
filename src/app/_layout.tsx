import { Slot } from "expo-router";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { Provider } from "react-redux";

import { ThemeProvider } from "../context/ThemeContext";
import { store } from "../store";
import useAppDispatch from "../hooks/useAppDispatch";
import { restoreSession } from "../features/auth/authSlice";
import "../../global.css";
import { useAppSelector } from "../hooks/useAppSelector";
import useAutoLogout from "../hooks/useAutoLogout";
SplashScreen.preventAutoHideAsync();

function Bootstrap() {
  const dispatch = useAppDispatch();

  const loading = useAppSelector((state) => state.auth.loading);

  useEffect(() => {
    dispatch(restoreSession());
  }, []);

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  return null;
}

function AppShell() {
  useAutoLogout();
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
