import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { AppState } from "react-native";
import useAppDispatch from "./useAppDispatch";
import { JwtPayload } from "../types/auth";
import { getMsUntilExpiry, isTokenExpired } from "../utils/tokenExpiry";
import { logout } from "../features/auth/authActions";

export default function useAutoLogout() {
  const dispatch = useAppDispatch();
  const token = useSelector((state: any) => state.auth.token);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const scheduleLogout = () => {
    if (!token) return;

    const decoded = jwtDecode<JwtPayload>(token);

    if (isTokenExpired(decoded.exp)) {
      dispatch(logout());
      return;
    }

    const ms = getMsUntilExpiry(decoded.exp);

    clearTimer();
    timerRef.current = setTimeout(() => {
      dispatch(logout());
    }, ms);
  };

  useEffect(() => {
    if (!token) {
      clearTimer();
      return;
    }

    scheduleLogout();

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        scheduleLogout();
      }
    });

    return () => {
      clearTimer();
      sub.remove();
    };
  }, [token]);
}
