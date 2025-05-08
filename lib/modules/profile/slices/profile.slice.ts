import { ThunkStatus } from "@/lib/types/misc";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import profileService from "../services/profile.service";
import Toast from "react-native-toast-message";
import { Profile } from "@/lib/types/profile";

export const name = "profile";

//initial state
const initialState: {
  data?: Profile;
  fetchStatus: ThunkStatus;
  updateStatus: ThunkStatus;
  changePasswordStatus: ThunkStatus;
  deleteProfileStatus: ThunkStatus;
} = {
  data: undefined,
  fetchStatus: ThunkStatus.IDLE,
  updateStatus: ThunkStatus.IDLE,
  changePasswordStatus: ThunkStatus.IDLE,
  deleteProfileStatus: ThunkStatus.IDLE,
};

const fetch = createAsyncThunk(`${name}/fetch`, profileService.fetch);

const update = createAsyncThunk(`${name}/update`, profileService.update);

const changePassword = createAsyncThunk(
  `${name}/changePassword`,
  profileService.changePassword
);

const deleteProfile = createAsyncThunk(
  `${name}/deleteProfile`,
  profileService.deleteProfile
);

//slice
export const profileSlice = createSlice({
  name,
  initialState,
  reducers: {
    setProfile(state, action) {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetch.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(update.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(changePassword.fulfilled, (state) => {
      state.changePasswordStatus = ThunkStatus.IDLE;
      Toast.show({
        type: "success",
        text1: "Password changed successfully",
      });
    });
    builder.addCase(deleteProfile.fulfilled, (state) => {
      state.deleteProfileStatus = ThunkStatus.IDLE;
    });
  },
});

//action creators
export const profileActions = {
  ...profileSlice.actions,
  fetch,
  update,
  changePassword,
  deleteProfile,
};
