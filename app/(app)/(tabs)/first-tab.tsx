import CustomPage from "@/lib/components/Page";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import * as React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

const FirstTab = () => {
  const primaryColor = useThemeColor({}, "primary");

  return (
    <CustomPage>
      <View className="flex-1 justify-center items-center">
        <Text
          variant={"headlineLarge"}
          style={{
            color: primaryColor as string,
          }}
          className="font-bold text-center"
        >
          This is the first tab of the app
        </Text>
      </View>
    </CustomPage>
  );
};

export default FirstTab;
