import { Slot } from "expo-router";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { Provider } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Audio } from "expo-av";
import { ThemeProvider } from "../context/ThemeContext";
import { store } from "../store";
import useAppDispatch from "../hooks/useAppDispatch";
import { restoreSession } from "../features/auth/authSlice";
import "../../global.css";
import { useAppSelector } from "../hooks/useAppSelector";
import useAutoLogout from "../hooks/useAutoLogout";
import { bootstrapStorage } from "../utils/bootstrapStorage";
import useAuth from "../hooks/useAuth";

SplashScreen.preventAutoHideAsync();

function Bootstrap() {
  const dispatch = useAppDispatch();
  const { user } = useAuth()!;

  const loading = useAppSelector((state) => state.auth.loading);

  useEffect(() => {
    dispatch(restoreSession());
  }, []);

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  useEffect(() => {
    if (!user) return;
    const init = async () => {
      await bootstrapStorage();
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
      });
    };

    init();
  }, [user]);

  return null;
}

function AppShell() {
  useAutoLogout();
  return <Slot />;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView>
        <ThemeProvider>
          <Bootstrap />
          <AppShell />
        </ThemeProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
