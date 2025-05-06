import React from "react";
import { Text, TouchableOpacity } from "react-native";
import * as Linking from "expo-linking";
import { useThemeColor } from "../hooks/useThemeColor";

interface HyperlinkProps {
  url: string;
  children: React.ReactNode;
}

export function Hyperlink({ url, children }: HyperlinkProps) {
  const primaryColor = useThemeColor({}, "primary") as string;

  const openLink = async () => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.warn("Cannot open URL:", url);
    }
  };

  return (
    <TouchableOpacity onPress={openLink}>
      <Text className="underline" style={{ color: primaryColor }}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}
