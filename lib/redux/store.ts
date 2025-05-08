import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { statusHandlerEnahncer } from "./enhancers/status.enhancer";
import { errorHandlerMiddleware } from "./middlewares/errorHandler.middleware";
import { profileSlice } from "../modules/profile/slices/profile.slice";

//NOTE: require store lazily in models or dependencies of models to avoid circular dependecies
export const store = configureStore({
  reducer: {
    profile: profileSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      errorHandlerMiddleware
    ),
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers().concat(statusHandlerEnahncer),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
