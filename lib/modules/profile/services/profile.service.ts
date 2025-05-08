import apiClient, { withApiResponseHandling } from "@/lib/openapi-fetch.config";
import { AuthChangePasswordBody } from "@/lib/types/auth";
import { ProfileUpdateBody } from "@/lib/types/profile";

async function fetch() {
  const { data } = await withApiResponseHandling(apiClient.GET("/profile"));
  return data;
}
async function update(payload: ProfileUpdateBody) {
  const { data } = await withApiResponseHandling(
    apiClient.PATCH("/profile", {
      body: payload,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  );
  return data;
}

async function changePassword(payload: AuthChangePasswordBody) {
  const { data } = await withApiResponseHandling(
    apiClient.POST("/auth/change-password", {
      body: payload,
    })
  );
  return data;
}

async function deleteProfile() {
  const { data } = await withApiResponseHandling(apiClient.DELETE("/profile"));
  return data;
}

const profileService = {
  fetch,
  update,
  changePassword,
  deleteProfile,
};

export default profileService;
