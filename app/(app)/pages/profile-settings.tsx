import CustomPage from "@/lib/components/Page";
import { router, useFocusEffect } from "expo-router";
import { Keyboard, Pressable, View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Text, TextInput } from "react-native-paper";
import { ButtonWithBorderRadius } from "@/lib/components/ButtonWithBorderRadius";
import { isValidMinLength, requiredRule } from "@/lib/utils/validations";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { profileActions } from "@/lib/redux/slices/profile.slice";
import { useCallback } from "react";
import { useRootContextValues } from "@/lib/contexts/root.context";
import { ThunkStatus } from "@/lib/types/misc";
import { useSession } from "@/lib/contexts/auth.context";
import { ProfileUpdateBody } from "@/lib/types/profile";

export default function ProfileSettings() {
  const profile = useAppSelector((state) => state.profile.data);
  const profileUpdateStatus = useAppSelector(
    (state) => state.profile.updateStatus
  );
  const dispatch = useAppDispatch();
  const { setHeaderOptions, showAlert } = useRootContextValues();
  const { signOut } = useSession();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: profile?.name || "",
      bio: profile?.bio || "",
    },
  });
  const errorColor = useThemeColor({}, "error") as string;

  useFocusEffect(
    useCallback(() => {
      setHeaderOptions({
        title: "Profile Settings",
        showBackButton: true,
      });
    }, [])
  );

  const onSubmit = (data: ProfileUpdateBody) => {
    Keyboard.dismiss();
    dispatch(profileActions.update(data));
  };

  const handleDeleteAccount = () => {
    showAlert({
      title: "Delete Account",
      message:
        "Are you sure you want to delete your account? This action is irreversible",
      onOk: async () => {
        await dispatch(profileActions.deleteProfile()).unwrap();
        signOut();
      },
    });
  };

  return (
    <CustomPage verticalPadding>
      <View>
        <View className="w-full flex flex-col gap-4 mb-4">
          <View className="flex flex-col gap-1">
            <Controller
              control={control}
              name="name"
              rules={{
                required: requiredRule("Name"),
                validate: (val) =>
                  isValidMinLength(val, 3) ||
                  "Name must be at least 3 characters",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Name"
                  placeholder="Name"
                  mode="outlined"
                  className="h-11"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={Boolean(errors.name)}
                />
              )}
            />
            {errors.name && (
              <Text variant="bodySmall" className="text-red-500">
                {errors.name.message}
              </Text>
            )}
          </View>

          <View className="flex flex-col gap-1">
            <Controller
              control={control}
              name="bio"
              rules={{ required: requiredRule("Bio") }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Bio"
                  placeholder="Bio"
                  mode="outlined"
                  className="h-11"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={Boolean(errors.bio)}
                />
              )}
            />
            {errors.bio && (
              <Text variant="bodySmall" className="text-red-500">
                {errors.bio.message}
              </Text>
            )}
          </View>

          <ButtonWithBorderRadius
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={profileUpdateStatus === ThunkStatus.LOADING}
          >
            Update
          </ButtonWithBorderRadius>
          <ButtonWithBorderRadius
            mode="outlined"
            onPress={() => router.push("/(app)/pages/change-password")}
          >
            Reset Password
          </ButtonWithBorderRadius>
        </View>

        <View className="flex-row items-center justify-center mt-4">
          <Pressable onPress={handleDeleteAccount}>
            <Text className="text-red-500">Delete Account</Text>
          </Pressable>
        </View>
      </View>
    </CustomPage>
  );
}
