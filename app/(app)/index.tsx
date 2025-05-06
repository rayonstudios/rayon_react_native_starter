import { useAppDispatch } from "@/lib/redux/store";
import { profileActions } from "@/lib/redux/slices/profile.slice";
import { router, useNavigationContainerRef } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { StackActions } from "@react-navigation/native";

export default function Index() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const rootNavigation = useNavigationContainerRef();

  useEffect(() => {
    const initialize = async () => {
      try {
        await dispatch(profileActions.fetch())
          .unwrap()
          .then((data) => {
            if (!data) {
              router.replace("/sign-in");
              return;
            }
            if (rootNavigation.canGoBack())
              rootNavigation.dispatch(StackActions.popToTop());
            router.replace("/(app)/(tabs)/first-tab");
          });
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator
          animating={true}
          size="large"
          className="-mt-[60px]"
        />
      </View>
    );
  }

  return null;
}
