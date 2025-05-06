import apiClient, { withApiResponseHandling } from "@/lib/openapi-fetch.config";
import {
  AuthLoginBody,
  AuthSignUpBody,
  AuthForgotPasswordBody,
  AuthResetPasswordBody,
  AuthVerifyEmailBody,
  AuthResendVerificationBody,
} from "@/lib/types/auth";

async function login(payload: AuthLoginBody) {
  const { data } = await withApiResponseHandling(
    apiClient.POST("/auth/login", { body: payload })
  );
  return data;
}

async function signUp(payload: AuthSignUpBody) {
  const { data } = await withApiResponseHandling(
    apiClient.POST("/auth/signup", {
      body: payload,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  );
  return data;
}

async function forgotPassword(payload: AuthForgotPasswordBody) {
  const { data } = await withApiResponseHandling(
    apiClient.POST("/auth/forgot-password", { body: payload })
  );
  return data;
}

async function verifyEmail(payload: AuthVerifyEmailBody) {
  const { data } = await withApiResponseHandling(
    apiClient.POST("/auth/verify-email", { body: payload })
  );
  return data;
}

async function resendVerificationEmail(payload: AuthResendVerificationBody) {
  const { data } = await withApiResponseHandling(
    apiClient.POST("/auth/resend-verification", { body: payload })
  );
  return data;
}

async function resetPassword(payload: AuthResetPasswordBody) {
  const { data } = await withApiResponseHandling(
    apiClient.POST("/auth/reset-password", { body: payload })
  );
  return data;
}

async function refreshToken(refreshToken: string) {
  const { data } = await withApiResponseHandling(
    apiClient.POST("/auth/refresh", {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    })
  );
  return data;
}

const authService = {
  login,
  signUp,
  forgotPassword,
  verifyEmail,
  resendVerificationEmail,
  resetPassword,
  refreshToken,
};

export default authService;
