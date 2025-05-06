import { useSession } from "@/lib/contexts/auth.context";
import { useRootContextValues } from "@/lib/contexts/root.context";
import { profileActions } from "@/lib/redux/slices/profile.slice";
import { useAppDispatch } from "@/lib/redux/store";
import { router } from "expo-router";
import { useMemo } from "react";
import { Pressable, View } from "react-native";
import { Divider, Icon, Text } from "react-native-paper";
import messaging from "@react-native-firebase/messaging";

const ThirdTab = () => {
  const { showAlert } = useRootContextValues();
  const { signOut } = useSession();
  const dispatch = useAppDispatch();

  const profileMenu = useMemo(() => {
    return [
      {
        title: "About",
        icon: "alert-circle-outline",
        onPress: () => {
          router.push("/(app)/pages/about");
        },
      },
      {
        title: "Profile Setting",
        icon: "account-edit-outline",
        onPress: () => {
          router.push("/(app)/pages/profile-settings");
        },
      },
      {
        title: "Sign Out",
        icon: "logout",
        onPress: () => {
          showAlert({
            title: "Logout",
            message: "Are you sure you want to logout?",
            onOk: async () => {
              try {
                const token = await messaging().getToken();
                await dispatch(
                  profileActions.update({
                    removed_fcm_token: token,
                  })
                )
                  .unwrap()
                  .then(() => {
                    signOut();
                  });
              } catch (error) {
                console.error("Error removing token:", error);
                signOut();
              }
            },
          });
        },
      },
    ];
  }, []);

  return (
    <View className="flex-1 w-full">
      {profileMenu.map((item, index) => (
        <View key={index}>
          <Pressable
            className="p-[18px] flex-row items-center w-full gap-4"
            onPress={item.onPress}
          >
            <Icon source={item.icon} size={24} />
            <Text key={index}>{item.title}</Text>
          </Pressable>
          <Divider />
        </View>
      ))}
    </View>
  );
};

export default ThirdTab;
