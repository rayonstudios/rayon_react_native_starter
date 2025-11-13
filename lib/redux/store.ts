import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { TypedStartListening } from "@reduxjs/toolkit";
import { statusHandlerEnhancer } from "./enhancers/status.enhancer";
import { errorHandlerMiddleware } from "./middlewares/errorHandler.middleware";
import { authListener, authSlice } from "../modules/auth/slices/auth.slice";
import { profileSlice } from "../modules/profile/slices/profile.slice";

//NOTE: require store lazily in models or dependencies of models to avoid circular dependecies
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    profile: profileSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .prepend(authListener.middleware)
      .concat(errorHandlerMiddleware),
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers().concat(statusHandlerEnhancer),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Typed startListening for use in slices
export type AppStartListening = TypedStartListening<RootState, AppDispatch>;
export const startAppListening = authListener.startListening as AppStartListening;
