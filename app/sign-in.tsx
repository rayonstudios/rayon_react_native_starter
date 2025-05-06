import CustomPage from "@/lib/components/Page";
import { useSession } from "@/lib/contexts/auth.context";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { TextInput, Text } from "react-native-paper";
import { ButtonWithBorderRadius } from "@/lib/components/ButtonWithBorderRadius";
import {
  isValidEmail,
  isValidMinLength,
  requiredRule,
} from "@/lib/utils/validations";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import PasswordField from "@/lib/components/PasswordField";

export default function SignIn() {
  const data = useLocalSearchParams();
  const { signIn, authLoading: signInLoading } = useSession();
  const onSubmit = (data: any) => signIn(data);
  const primaryColor = useThemeColor({}, "primary") as string;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: (data?.email as string) || "",
      password: "",
    },
  });

  return (
    <CustomPage verticalPadding>
      <View className="flex-1 items-center">
        <Text
          variant="headlineLarge"
          className="font-bold text-center mb-8"
          style={{ color: primaryColor }}
        >
          Sign In
        </Text>

        <View className="w-[85%] mb-8">
          <Text variant="bodyLarge" className="text-center">
            Welcome back! Sign in to continue your journey
          </Text>
        </View>

        <View className="w-full flex flex-col gap-y-4 mb-4">
          <View className="flex flex-col gap-2">
            <Controller
              control={control}
              name="email"
              rules={{
                required: requiredRule("Email"),
                validate: (val) =>
                  isValidEmail(val) || "Please enter a valid email",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="h-12"
                  label={"Email"}
                  placeholder="Email"
                  mode="outlined"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={Boolean(errors.email)}
                />
              )}
            />
            {errors.email && (
              <Text variant="bodySmall" className="text-red-500">
                {errors.email.message}
              </Text>
            )}
          </View>

          <Controller
            control={control}
            name="password"
            rules={{
              required: requiredRule("Password"),
              validate: (val) =>
                isValidMinLength(val, 6) ||
                "Password must be at least 6 characters",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <PasswordField
                label="Password"
                placeholder="Enter password"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <ButtonWithBorderRadius
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={signInLoading}
          >
            Continue
          </ButtonWithBorderRadius>
        </View>

        <Pressable onPress={() => router.push("/forgot-password")}>
          <Text variant="bodyLarge" className="underline">
            Forgot Password?
          </Text>
        </Pressable>

        <View className="flex-row items-center justify-center w-full mt-4">
          <Text>Don't have an account? </Text>
          <Pressable onPress={() => router.replace("/sign-up")}>
            <Text className="text-primary font-medium">Sign up</Text>
          </Pressable>
        </View>
      </View>
    </CustomPage>
  );
}
