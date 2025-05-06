import { Link, Stack } from "expo-router";
import { View } from "react-native";
import { Text } from "react-native-paper";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 items-center justify-center p-5">
        <Text variant="titleLarge">This screen doesn't exist.</Text>
        <Link href=".." className="mt-[15px] py-[15px]">
          <Text>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
