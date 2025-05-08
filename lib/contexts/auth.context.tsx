import {
  useContext,
  createContext,
  type PropsWithChildren,
  useState,
} from "react";
import { useStorageState } from "../hooks/useStorageState";
import {
  AuthLoginBody,
  AuthSignUpBody,
  AuthForgotPasswordBody,
  AuthResetPasswordBody,
  AuthVerifyEmailBody,
  AuthResendVerificationBody,
} from "../types/auth";
import authService from "../modules/auth/services/auth.service";
import { router } from "expo-router";
import { useAppDispatch } from "../redux/store";
import Toast from "react-native-toast-message";
import { profileActions } from "../modules/profile/slices/profile.slice";

const AuthContext = createContext<{
  signIn: (data: AuthLoginBody) => void;
  signUp: (data: AuthSignUpBody) => void;
  forgotPassword: (data: AuthForgotPasswordBody) => void;
  resetPassword: (data: AuthResetPasswordBody) => void;
  verifyEmail: (data: AuthVerifyEmailBody) => void;
  resendVerificationEmail: (data: AuthResendVerificationBody) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
  authLoading: boolean;
}>({
  signIn: (data) => null,
  signUp: (data) => null,
  forgotPassword: (data) => null,
  resetPassword: (data) => null,
  verifyEmail: (data) => null,
  resendVerificationEmail: (data) => null,
  signOut: () => null,
  session: null,
  isLoading: false,
  authLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[loadingAccessToken, accessToken], setAccessToken] =
    useStorageState("accessToken");
  const [[loadingRefreshToken, refreshToken], setRefreshToken] =
    useStorageState("refreshToken");
  const [authLoading, setAuthLoading] = useState(false);
  const dispatch = useAppDispatch();

  return (
    <AuthContext.Provider
      value={{
        signIn: (data) => {
          setAuthLoading(true);
          authService
            .login(data)
            .then((response) => {
              setAccessToken(response.accessToken);
              setRefreshToken(response.refreshToken);
              dispatch(profileActions.setProfile(response.user));
            })
            .then(() => {
              setTimeout(() => {
                router.push("/(app)");
              }, 100);
            })
            .catch((error) => {
              console.log("Error signing in:", error);
              console.error(error);
            })
            .finally(() => {
              setAuthLoading(false);
            });
        },
        signOut: () => {
          setAccessToken(null);
          setRefreshToken(null);
        },
        signUp: (data: AuthSignUpBody) => {
          setAuthLoading(true);
          authService
            .signUp(data)
            .then((response) => {
              console.log("response After Sign up: ", response);

              router.replace({
                pathname: "/verify-email",
                params: { email: data.email },
              });
            })
            .catch((error) => {
              console.error(error);
            })
            .finally(() => {
              setAuthLoading(false);
            });
        },
        forgotPassword: (data: AuthForgotPasswordBody) => {
          setAuthLoading(true);
          authService
            .forgotPassword(data)
            .then((response) => {
              Toast.show({
                type: "success",
                text1: response.message,
              });
              router.replace({
                pathname: "/reset-password",
                params: { email: data.email },
              });
            })
            .catch((error) => {
              console.error(error);
            })
            .finally(() => {
              setAuthLoading(false);
            });
        },
        resetPassword: (data: AuthResetPasswordBody) => {
          setAuthLoading(true);
          authService
            .resetPassword(data)
            .then((response) => {
              Toast.show({
                type: "success",
                text1: response.message,
              });
              router.replace({
                pathname: "/sign-in",
                params: { email: data.email },
              });
            })
            .catch((error) => {
              console.error(error);
            })
            .finally(() => {
              setAuthLoading(false);
            });
        },
        verifyEmail: (data: AuthVerifyEmailBody) => {
          setAuthLoading(true);
          authService
            .verifyEmail(data)
            .then((response) => {
              setAccessToken(response.accessToken);
              setRefreshToken(response.refreshToken);
              router.push("/(app)");
            })
            .catch((error) => {
              console.error(error);
            })
            .finally(() => {
              setAuthLoading(false);
            });
        },
        resendVerificationEmail: (data: AuthResendVerificationBody) => {
          setAuthLoading(true);
          authService
            .resendVerificationEmail(data)
            .then((response) => {
              console.log("response: ", response);
            })
            .catch((error) => {
              console.error(error);
            })
            .finally(() => {
              setAuthLoading(false);
            });
        },
        session: accessToken,
        isLoading: loadingAccessToken || loadingRefreshToken,
        authLoading: authLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
