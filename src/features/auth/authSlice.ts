import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { getSession, clearSession } from "../../services/session";
import { User, JwtPayload } from "../../types/auth";

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
};

const initialState: AuthState = {
  user: null,
  token: null,
  loading: true,
};

export const restoreSession = createAsyncThunk(
  "auth/restoreSession",
  async () => {
    const session = await getSession();
    if (!session?.token) return null;

    const decoded = jwtDecode<JwtPayload>(session.token);

    return {
      token: session.token,
      user: {
        ...session.user,
        uuid: decoded.uuid,
        email: decoded.email,
        role: decoded.role,
      } as User,
    };
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ token: string; user: User }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.loading = false;
    },

    logoutSuccess(state) {
      state.user = null;
      state.token = null;
      state.loading = false;
      clearSession(); // optional but safe
    },

    stopLoading(state) {
      state.loading = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        if (action.payload) {
          state.token = action.payload.token;
          state.user = action.payload.user;
        }
        state.loading = false;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { loginSuccess, logoutSuccess, stopLoading } = authSlice.actions;

export default authSlice.reducer;
