import React, { useEffect, useCallback } from "react";
import { Platform, PermissionsAndroid } from "react-native";
import { Redirect, Stack } from "expo-router";
import { useSession } from "@/lib/contexts/auth.context";
import AppBar from "@/lib/components/Appbar";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import messaging from "@react-native-firebase/messaging";
import { profileActions } from "@/lib/redux/slices/profile.slice";
import { Notifications } from "react-native-notifications";

export default function AppLayout() {
  const profile = useAppSelector((state) => state.profile.data);
  const dispatch = useAppDispatch();
  const { session, isLoading } = useSession();

  const onAppBootstrap = useCallback(async () => {
    if (!profile) return;

    const token = await messaging().getToken();

    if (
      !Array.isArray(profile.fcm_tokens) ||
      !profile.fcm_tokens.includes(token)
    ) {
      dispatch(profileActions.update({ added_fcm_token: token }));
      console.log("Token saved: ", token);
    } else {
      console.log("Token already exists:", token);
    }
  }, [profile, dispatch]);

  const requestNotificationPermission = async () => {
    if (Platform.OS === "android" && Platform.Version >= 33) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn("Notification permission denied");
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
      }
    } else if (Platform.OS === "ios") {
      const authStatus = await messaging().requestPermission();
      if (
        authStatus !== messaging.AuthorizationStatus.AUTHORIZED &&
        authStatus !== messaging.AuthorizationStatus.PROVISIONAL
      ) {
        console.warn("Notification permission denied");
      }
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        console.log("Notification permission granted");
      }
    }
  };

  const handleRemoteMessage = useCallback((data: any) => {
    if (!data) return;
    console.log("Notification data:", data);
  }, []);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    onAppBootstrap();
  }, [onAppBootstrap]);

  useEffect(() => {
    const unsubscribe = messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        "remoteMessage from onNotificationOpenedApp: ",
        remoteMessage
      );
      handleRemoteMessage(remoteMessage.data);
    });
    Notifications.getInitialNotification().then((remoteMessage) => {
      console.log("remoteMessage from getInitialNotification", remoteMessage);
      handleRemoteMessage(remoteMessage?.payload);
    });

    return () => unsubscribe();
  }, [handleRemoteMessage]);

  if (isLoading) return null;

  if (!session) {
    return <Redirect href="/root" />;
  }

  return (
    <>
      <AppBar />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
