import { getErrorMessage, globalErrorHandler } from "@/lib/utils/error.utils";
import authService from "./redux/services/auth.service";
import axiosApi from "axios";
import { API_BASE_URL_DEV, API_BASE_URL_PROD } from "./constants/misc";
import {
  getStorageItemAsync,
  setStorageItemAsync,
} from "./hooks/useStorageState";
import Constants from "expo-constants";

const { APP_VARIANT } = Constants.expoConfig?.extra || {};

export const PERMISSION_ERR_MSG =
  "You don't have permission to perform this action. Please contact your organization admin.";

const axios = axiosApi.create({
  baseURL: APP_VARIANT === "development" ? API_BASE_URL_DEV : API_BASE_URL_PROD,
  headers: {
    "Content-Type": "application/json",
  },
});

axios.interceptors.request.use(async (reqConfig) => {
  const token = await getStorageItemAsync("accessToken");
  if (token && !reqConfig.headers.Authorization) {
    reqConfig.headers.Authorization = `Bearer ${token}`;
  }
  return reqConfig;
});

axios.interceptors.response.use(undefined, async (error) => {
  if (error.response?.status === 403 && error.config.method !== "get") {
    error.message = PERMISSION_ERR_MSG;
    throw error;
  }

  let msg = getErrorMessage(
    error.response?.data?.error || error.response?.data,
    ""
  );
  if (!msg)
    msg = `${
      error.response?.statusText ? error.response.statusText + "! " : ""
    }${error.message}`;
  error.message = msg;

  console.log("error.response: ", error.response);

  if (error.response?.status === 401) {
    if (!["/auth/login", "/auth/refresh"].includes(error.config.url!)) {
      try {
        const refreshTokenOld = await getStorageItemAsync("refreshToken");
        if (!refreshTokenOld) {
          throw new Error("No refresh token available");
        }
        const { accessToken, refreshToken } =
          await authService.refreshToken(refreshTokenOld);

        // Update tokens in storage
        await setStorageItemAsync("accessToken", accessToken || "");
        await setStorageItemAsync("refreshToken", refreshToken || "");

        // Update Authorization header with new access token
        error.config.headers.Authorization = `Bearer ${accessToken}`;

        // Retry the original request
        return axios(error.config);
      } catch (refreshError) {
        console.log("Failed to refresh token:", refreshError);

        // Clear stored tokens and handle logout
        await setStorageItemAsync("accessToken", null);
        await setStorageItemAsync("refreshToken", null);

        throw refreshError;
      }
    } else {
      // Logout if unable to refresh token
      await setStorageItemAsync("accessToken", null);
      await setStorageItemAsync("refreshToken", null);
    }
  }

  globalErrorHandler(error);
  throw error;
});

export default axios;
