import { router } from "expo-router";
import * as React from "react";
import { Appbar } from "react-native-paper";
import { useRootContextValues } from "../contexts/root.context";
import { useSecondaryBackgroundColor } from "../hooks/useThemeColor";
import { Image, Pressable } from "react-native";

const AppBar = () => {
  const { headerOptions } = useRootContextValues();
  const { title, showBackButton } = headerOptions;
  const _goBack = () => router.back();
  const bgColor = useSecondaryBackgroundColor();

  return (
    <Appbar.Header
      statusBarHeight={0}
      mode="center-aligned"
      style={{
        backgroundColor: bgColor,
      }}
    >
      {showBackButton ? (
        <Appbar.BackAction onPress={_goBack} />
      ) : (
        <Pressable
          onPress={() =>
            router.replace({ pathname: "/(app)/(tabs)/first-tab" })
          }
        >
          <Image
            source={require("@/lib/assets/images/icon.png")}
            style={{
              marginLeft: 18,
              width: 40,
              height: 40,
              resizeMode: "contain",
            }}
          />
        </Pressable>
      )}
      <Appbar.Content title={title || ""} subtitle="Subtitle" />
    </Appbar.Header>
  );
};

export default AppBar;
