import CustomPage from "@/lib/components/Page";
import { useSession } from "@/lib/contexts/auth.context";
import { View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { TextInput, Text } from "react-native-paper";
import { ButtonWithBorderRadius } from "@/lib/components/ButtonWithBorderRadius";
import { isValidEmail, requiredRule } from "@/lib/utils/validations";

export default function ForgotPassword() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });
  const { forgotPassword, authLoading: forgotPasswordLoading } = useSession();
  const onSubmit = (data: any) => forgotPassword(data);

  return (
    <CustomPage enableScrollView={false} verticalPadding>
      <View className="flex-1 mt-[68px] items-center">
        <View className="w-[85%] mb-8">
          <Text variant="bodyLarge" className="text-center">
            Enter your email to receive an OTP for resetting your password.
          </Text>
        </View>

        <View className="w-full flex flex-col gap-4 mb-4">
          <View className="flex flex-col gap-1">
            <Controller
              control={control}
              rules={{
                required: requiredRule("Email"),
                validate: (val) =>
                  isValidEmail(val) || "Please enter a valid email",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="h-[44px]"
                  label={"Email"}
                  placeholder="Email"
                  mode="outlined"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={Boolean(errors.email)}
                />
              )}
              name="email"
            />

            {errors.email && (
              <Text variant="labelSmall" className="text-red-500">
                {errors.email.message}
              </Text>
            )}
          </View>

          <ButtonWithBorderRadius
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={forgotPasswordLoading}
          >
            Continue
          </ButtonWithBorderRadius>
        </View>
      </View>
    </CustomPage>
  );
}
