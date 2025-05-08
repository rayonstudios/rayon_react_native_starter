import { ApiBody } from "@/lib/types/api";

export type AuthLoginBody = ApiBody<"AuthLogin">;

export type AuthSignUpBody = ApiBody<"AuthSignup">;

export type AuthForgotPasswordBody = ApiBody<"AuthForgotPassword">;

export type AuthVerifyEmailBody = ApiBody<"AuthVerifyEmail">;

export type AuthResetPasswordBody = ApiBody<"AuthResetPassword">;

export type AuthResendVerificationBody = ApiBody<"AuthResendVerification">;

export type AuthChangePasswordBody = ApiBody<"AuthChangePassword">;
