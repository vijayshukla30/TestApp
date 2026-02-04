import { Slot } from "expo-router";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { Provider } from "react-redux";

import { store } from "../store";
import useAppDispatch from "../hooks/useAppDispatch";
import { restoreSession } from "../features/auth/authSlice";
import "../../global.css";
import { ThemeProvider } from "../context/ThemeProvider";
import { Linking } from "react-native";
import { fetchUserActivity } from "../features/activity/activitySlice";
import useAuth from "../hooks/useAuth";

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

function ReduxBootstrap() {
  const dispatch = useAppDispatch();
  const { token } = useAuth()!;

  useEffect(() => {
    const sub = Linking.addEventListener("url", ({ url }) => {
      console.log("url :>> ", url);
      if (url.includes("platform-auth-success") && token) {
        dispatch(fetchUserActivity({ token }));
      }
    });

    return () => sub.remove();
  }, [dispatch, token]);

  return (
    <>
      <Bootstrap />
      <AppShell />
    </>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <ReduxBootstrap />
      </ThemeProvider>
    </Provider>
  );
}
