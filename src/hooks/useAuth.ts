import { useAppSelector } from "./useAppSelector";
import { login, logout } from "../features/auth/authActions";
import useAppDispatch from "./useAppDispatch";

export default function useAuth() {
  const { user, token, loading } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();

  return {
    user,
    token,
    loading,
    login: (token: string, user: any) => dispatch(login(token, user)),
    logout: () => dispatch(logout()),
  };
}
