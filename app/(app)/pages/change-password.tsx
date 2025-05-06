import CustomPage from "@/lib/components/Page";
import { router, useFocusEffect } from "expo-router";
import { View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { ButtonWithBorderRadius } from "@/lib/components/ButtonWithBorderRadius";
import { requiredRule } from "@/lib/utils/validations";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { profileActions } from "@/lib/redux/slices/profile.slice";
import { useCallback } from "react";
import { useRootContextValues } from "@/lib/contexts/root.context";
import { ThunkStatus } from "@/lib/types/misc";
import PasswordField from "@/lib/components/PasswordField";

export default function ChangePassword() {
  const changePasswordStatus = useAppSelector(
    (state) => state.profile.changePasswordStatus
  );
  const dispatch = useAppDispatch();
  const { setHeaderOptions } = useRootContextValues();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      newPassword: "",
      oldPassword: "",
    },
  });

  useFocusEffect(
    useCallback(() => {
      setHeaderOptions({
        title: "Reset Password",
        showBackButton: true,
      });
    }, [])
  );

  const onSubmit = (data: any) => {
    dispatch(
      profileActions.changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      })
    )
      .unwrap()
      .then((data) => {
        router.back();
      });
  };

  return (
    <CustomPage verticalPadding>
      <View className="w-full flex flex-col gap-4 mb-4">
        <Controller
          control={control}
          rules={{
            required: requiredRule("Old Password"),
          }}
          name="oldPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <PasswordField
              label="Old Password"
              placeholder="Old password"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.oldPassword?.message}
            />
          )}
        />

        <Controller
          control={control}
          rules={{
            required: requiredRule("New Password"),
            minLength: {
              value: 2,
              message: "Password must be at least 6 characters",
            },
          }}
          name="newPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <PasswordField
              label="New Password"
              placeholder="New password"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.newPassword?.message}
            />
          )}
        />

        <ButtonWithBorderRadius
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={changePasswordStatus === ThunkStatus.LOADING}
        >
          Change Password
        </ButtonWithBorderRadius>
      </View>
    </CustomPage>
  );
}
