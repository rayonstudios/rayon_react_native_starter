import CustomPage from "@/lib/components/Page";
import { ButtonWithBorderRadius } from "@/lib/components/ButtonWithBorderRadius";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { router } from "expo-router";
import { View, Image } from "react-native";
import { Text } from "react-native-paper";

export default function Root() {
  const primaryColor = useThemeColor({}, "primary");
  return (
    <CustomPage>
      <View className="flex-1 justify-center items-center">
        <View className="w-[75%] mb-16 mt-[-200px]">
          <Text
            variant="headlineLarge"
            className="font-bold text-center"
            style={{ color: primaryColor }}
          >
            Take a fresh start of your dream project now!
          </Text>
        </View>

        <View className="flex flex-col">
          <Image
            source={require("@/lib/assets/images/rayon-logo.png")}
            style={{ resizeMode: "contain", width: 300 }}
          />
          <Text
            className="font-bold text-right mt-[-30px] "
            style={{ color: primaryColor }}
          >
            STUDIOS
          </Text>
        </View>

        <View className="w-full flex flex-col gap-4 absolute bottom-6">
          <ButtonWithBorderRadius
            mode="contained"
            onPress={() => router.push("/sign-up")}
          >
            Sign Up
          </ButtonWithBorderRadius>
          <ButtonWithBorderRadius
            mode="outlined"
            onPress={() => router.push("/sign-in")}
          >
            Sign In
          </ButtonWithBorderRadius>
        </View>
      </View>
    </CustomPage>
  );
}
