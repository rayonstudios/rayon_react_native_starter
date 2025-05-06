import { globalErrorHandler } from "@/lib/utils/error.utils";
import createClient from "openapi-fetch";
import axios from "./axios.config";
import { paths } from "./types/openapi-fetch";
import Constants from "expo-constants";
import { API_BASE_URL_DEV, API_BASE_URL_PROD } from "./constants/misc";

const { APP_VARIANT } = Constants.expoConfig?.extra || {};

export const PERMISSION_ERR_MSG =
  "You don't have permission to perform this action. Please contact your organization admin.";

const API_BASE_URL =
  APP_VARIANT === "development" ? API_BASE_URL_DEV : API_BASE_URL_PROD;

// Create enhanced client by wrapping Axios as the fetch implementation
const apiClient = createClient<paths>({
  baseUrl: API_BASE_URL,
  fetch: async (input: RequestInfo, init?: RequestInit) => {
    // 1. normalize to a Request
    const req = input instanceof Request ? input : new Request(input, init);

    // 2. log just the bits you care about
    console.log("req:", {
      url: req.url,
      method: req.method,
      headers: Object.fromEntries(req.headers.entries()),
    });

    // 3. parse body based on content-type
    const ct = req.headers.get("content-type") || "";
    let data: any;
    if (ct.includes("application/json")) {
      data = await req.json();
    } else if (ct.includes("multipart/form-data")) {
      data = await req.json();
      const formData = new FormData();
      Object.entries(data as Record<string, string>).forEach(([key, value]) => {
        formData.append(key, value);
      });
      data = formData;
    } else {
      data = await req.text();
    }

    // 4. delegate to axios
    const response = await axios.request({
      url: req.url.replace(API_BASE_URL, ""),
      method: req.method.toLowerCase() as any,
      headers: Object.fromEntries(req.headers.entries()),
      data,
    });

    // 5. wrap back in a fetch‐style Response
    return new Response(JSON.stringify(response.data), {
      status: response.status,
      statusText: response.statusText,
    });
  },
});

apiClient.use({
  async onError({ error }) {
    globalErrorHandler(error);
  },
});

export async function withApiResponseHandling<T, E = unknown>(
  request: Promise<{
    data?: { data: T; error: string | null };
    error?: E;
    response: Response;
  }>
): Promise<{
  data: NonNullable<T>;
  response: Response;
}> {
  const { data, error, response } = await request;

  if (error || data?.error || !data?.data) {
    throw {
      message: (error as any)?.error ?? error ?? data?.error,
      name: "AxiosError",
    };
  }

  const result = {
    data: data.data,
    response,
  };

  return result;
}

export default apiClient;
