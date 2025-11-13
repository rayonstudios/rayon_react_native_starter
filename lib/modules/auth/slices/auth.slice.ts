// src/slices/auth.slice.ts
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  createListenerMiddleware,
} from "@reduxjs/toolkit";
import { ThunkStatus } from "@/lib/types/misc";
import authService from "../services/auth.service";
import { setStorageItemAsync } from "@/lib/hooks/useStorageState";
import { router } from "expo-router";
import {
  AuthForgotPasswordBody,
  AuthLoginBody,
  AuthResendVerificationBody,
  AuthResetPasswordBody,
  AuthSignUpBody,
  AuthVerifyEmailBody,
} from "../types/auth.types";

export const name = "auth";

export interface AuthState {
  status: "processing" | "authenticated" | "unauthenticated";
  loginStatus: ThunkStatus;
  signUpStatus: ThunkStatus;
  logoutStatus: ThunkStatus;
  forgotPasswordStatus: ThunkStatus;
  resetPasswordStatus: ThunkStatus;
  verifyEmailStatus: ThunkStatus;
  resendVerificationEmailStatus: ThunkStatus;
}

const initialState: AuthState = {
  status: "processing",
  loginStatus: ThunkStatus.IDLE,
  signUpStatus: ThunkStatus.IDLE,
  logoutStatus: ThunkStatus.IDLE,
  forgotPasswordStatus: ThunkStatus.IDLE,
  resetPasswordStatus: ThunkStatus.IDLE,
  verifyEmailStatus: ThunkStatus.IDLE,
  resendVerificationEmailStatus: ThunkStatus.IDLE,
};

// ---- Thunks ----

export const login = createAsyncThunk(
  `${name}/login`,
  async (credentials: AuthLoginBody) => {
    const res = await authService.login(credentials);
    return res;
  }
);

export const signUp = createAsyncThunk(
  `${name}/signUp`,
  async (data: AuthSignUpBody) => {
    const res = await authService.signUp(data);
    return res;
  }
);

export const logout = createAsyncThunk(`${name}/logout`, async () => {
  // no-op: listener will clear storage
  return;
});

export const forgotPassword = createAsyncThunk(
  `${name}/forgotPassword`,
  async (data: AuthForgotPasswordBody) => {
    const res = await authService.forgotPassword(data);
    return res;
  }
);

export const resetPassword = createAsyncThunk(
  `${name}/resetPassword`,
  async (data: AuthResetPasswordBody) => {
    const res = await authService.resetPassword(data);
    return res;
  }
);

export const verifyEmail = createAsyncThunk(
  `${name}/verifyEmail`,
  async (data: AuthVerifyEmailBody) => {
    const res = await authService.verifyEmail(data);
    return res;
  }
);

export const resendVerificationEmail = createAsyncThunk(
  `${name}/resendVerificationEmail`,
  async (data: AuthResendVerificationBody) => {
    const res = await authService.resendVerificationEmail(data);
    return res;
  }
);

// ---- Slice ----

export const authSlice = createSlice({
  name,
  initialState,
  reducers: {
    setStatus(state, action: PayloadAction<AuthState["status"]>) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (s) => {
        s.loginStatus = ThunkStatus.IDLE;
        s.status = "authenticated";
      })
      .addCase(logout.fulfilled, (s) => {
        s.logoutStatus = ThunkStatus.IDLE;
        s.status = "unauthenticated";
      })
      .addCase(verifyEmail.fulfilled, (s) => {
        s.verifyEmailStatus = ThunkStatus.IDLE;
        s.status = "authenticated";
      });
  },
});

export const authActions = {
  ...authSlice.actions,
  login,
  signUp,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
};

// ---- Listener Middleware ----

export const authListener = createListenerMiddleware();

// Persist tokens + navigate on login
authListener.startListening({
  actionCreator: login.fulfilled,
  effect: async (action) => {
    const { accessToken, refreshToken } = action.payload;
    await setStorageItemAsync("accessToken", accessToken);
    await setStorageItemAsync("refreshToken", refreshToken);
    router.push("/(app)");
  },
});

// After sign-up, send user to verify-email screen
authListener.startListening({
  actionCreator: signUp.fulfilled,
  effect: async (action) => {
    const { email } = action.meta.arg;
    router.replace({ pathname: "/verify-email", params: { email } });
  },
});

// Clear tokens on logout
authListener.startListening({
  actionCreator: logout.fulfilled,
  effect: async () => {
    await setStorageItemAsync("accessToken", null);
    await setStorageItemAsync("refreshToken", null);
  },
});

// After forgotPassword, take user to reset-password screen
authListener.startListening({
  actionCreator: forgotPassword.fulfilled,
  effect: async (action) => {
    // original thunk args live in action.meta.arg
    const { email } = action.meta.arg;
    router.replace({ pathname: "/reset-password", params: { email } });
  },
});

// After resetPassword, take user to sign-in screen
authListener.startListening({
  actionCreator: resetPassword.fulfilled,
  effect: async (action) => {
    const { email } = action.meta.arg;
    router.replace({ pathname: "/sign-in", params: { email } });
  },
});

// Persist tokens + navigate on verifyEmail
authListener.startListening({
  actionCreator: verifyEmail.fulfilled,
  effect: async (action) => {
    const { accessToken, refreshToken } = action.payload;
    await setStorageItemAsync("accessToken", accessToken);
    await setStorageItemAsync("refreshToken", refreshToken);
    router.push("/(app)");
  },
});

// Optionally, you could add UI feedback for resendVerificationEmail here
// (toast, snackbar, etc.) or leave it to your UI layer.

export default authSlice.reducer;
