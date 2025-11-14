// src/hooks/auth.hooks.ts
import { useStorageState } from "@/lib/hooks/useStorageState";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { useCallback, useEffect } from "react";
import { ThunkStatus } from "@/lib/types/misc";
import { authActions } from "../slices/auth.slice";
import {
  AuthForgotPasswordBody,
  AuthLoginBody,
  AuthResendVerificationBody,
  AuthResetPasswordBody,
  AuthSignUpBody,
  AuthVerifyEmailBody,
} from "../types/auth.types";

export function useAuth() {
  // secure storage tokens
  const [[loadingAccessToken, accessToken]] = useStorageState("accessToken");
  const [[loadingRefreshToken, refreshToken]] = useStorageState("refreshToken");

  const dispatch = useAppDispatch();
  const {
    status,
    loginStatus,
    signUpStatus,
    logoutStatus,
    forgotPasswordStatus,
    resetPasswordStatus,
    verifyEmailStatus,
    resendVerificationEmailStatus,
  } = useAppSelector((state) => ({
    status: state.auth.status,
    loginStatus: state.auth.loginStatus,
    signUpStatus: state.auth.signUpStatus,
    logoutStatus: state.auth.logoutStatus,
    forgotPasswordStatus: state.auth.forgotPasswordStatus,
    resetPasswordStatus: state.auth.resetPasswordStatus,
    verifyEmailStatus: state.auth.verifyEmailStatus,
    resendVerificationEmailStatus: state.auth.resendVerificationEmailStatus,
  }));

  // keep slice.status in sync with stored token
  useEffect(() => {
    if (accessToken && status !== "authenticated") {
      dispatch(authActions.setStatus("authenticated"));
    } else if (!accessToken && status !== "unauthenticated") {
      dispatch(authActions.setStatus("unauthenticated"));
    }
  }, [accessToken, status, dispatch]);

  // action dispatchers
  const login = useCallback(
    (data: AuthLoginBody) => dispatch(authActions.login(data)),
    [dispatch]
  );
  const signUp = useCallback(
    (data: AuthSignUpBody) => dispatch(authActions.signUp(data)),
    [dispatch]
  );
  const logout = useCallback(() => dispatch(authActions.logout()), [dispatch]);
  const forgotPassword = useCallback(
    (data: AuthForgotPasswordBody) =>
      dispatch(authActions.forgotPassword(data)),
    [dispatch]
  );
  const resetPassword = useCallback(
    (data: AuthResetPasswordBody) => dispatch(authActions.resetPassword(data)),
    [dispatch]
  );
  const verifyEmail = useCallback(
    (data: AuthVerifyEmailBody) => dispatch(authActions.verifyEmail(data)),
    [dispatch]
  );
  const resendVerificationEmail = useCallback(
    (data: AuthResendVerificationBody) =>
      dispatch(authActions.resendVerificationEmail(data)),
    [dispatch]
  );

  return {
    // tokens + loading
    accessToken,
    refreshToken,
    loadingAccessToken,
    loadingRefreshToken,

    // auth state
    status,
    loginLoading: loginStatus === ThunkStatus.LOADING,
    signUpLoading: signUpStatus === ThunkStatus.LOADING,
    logoutLoading: logoutStatus === ThunkStatus.LOADING,
    forgotPasswordLoading: forgotPasswordStatus === ThunkStatus.LOADING,
    resetPasswordLoading: resetPasswordStatus === ThunkStatus.LOADING,
    verifyEmailLoading: verifyEmailStatus === ThunkStatus.LOADING,
    resendVerificationEmailLoading:
      resendVerificationEmailStatus === ThunkStatus.LOADING,

    // actions
    login,
    signUp,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerificationEmail,
  };
}
