import { ThunkStatus } from "@/lib/types/misc";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import authService from "../services/auth.service";

export const name = "auth";

//initial state
const initialState: {
  status: "processing" | "authenticated" | "unauthenticated";
  loginStatus: ThunkStatus;
  logoutStatus: ThunkStatus;
  changePasswordStatus: ThunkStatus;
} = {
  status: "processing",
  loginStatus: ThunkStatus.IDLE,
  logoutStatus: ThunkStatus.IDLE,
  changePasswordStatus: ThunkStatus.IDLE,
};

const login = createAsyncThunk(
  `${name}/login`,
  async (data: Parameters<typeof authService.login>[0]) => {
    const res = await authService.login(data);
    localStorage.setItem("accessToken", res.accessToken);
    localStorage.setItem("refreshToken", res.refreshToken);
    return res;
  }
);

const logout = createAsyncThunk(`${name}/logout`, async () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
});

//slice
export const authSlice = createSlice({
  name,
  initialState,
  reducers: {
    setStatus(state, action: PayloadAction<(typeof initialState)["status"]>) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state) => {
      state.status = "authenticated";
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.status = "unauthenticated";
    });
  },
});

//action creators
export const authActions = {
  ...authSlice.actions,
  login,
  logout,
};
