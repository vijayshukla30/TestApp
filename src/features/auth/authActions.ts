import { jwtDecode } from "jwt-decode";
import { AppDispatch } from "../../store";
import { saveSession, clearSession } from "../../services/session";
import { loginSuccess, logoutSuccess } from "./authSlice";
import { User, JwtPayload } from "../../types/auth";

export const login =
  (token: string, user: User) => async (dispatch: AppDispatch) => {
    const decoded = jwtDecode<JwtPayload>(token);

    const enrichedUser: User = {
      ...user,
      uuid: decoded.uuid,
      email: decoded.email,
      role: decoded.role,
    };

    await saveSession(token, enrichedUser);
    dispatch(loginSuccess({ token, user: enrichedUser }));
  };

export const logout = () => async (dispatch: AppDispatch) => {
  await clearSession();
  dispatch(logoutSuccess());
};
