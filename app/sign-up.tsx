import CustomPage from "@/lib/components/Page";
import { useSession } from "@/lib/contexts/auth.context";
import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Text, TextInput } from "react-native-paper";
import { ButtonWithBorderRadius } from "@/lib/components/ButtonWithBorderRadius";

import {
  isValidEmail,
  isValidMinLength,
  requiredRule,
} from "@/lib/utils/validations";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import PasswordField from "@/lib/components/PasswordField";
import { AuthSignUpBody } from "@/lib/types/auth";

export default function SignUp() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const { signUp, authLoading: signUpLoading } = useSession();
  const primaryColor = useThemeColor({}, "primary") as string;
  const onSubmit = (data: AuthSignUpBody) => signUp(data);

  return (
    <CustomPage enableScrollView verticalPadding>
      <View className="justify-center items-center mb-[50px]">
        <Text
          variant="headlineLarge"
          className="font-bold text-center text-primary mb-8"
          style={{ color: primaryColor }}
        >
          Sign Up
        </Text>

        <View className="w-[85%] mb-8">
          <Text variant="bodyLarge" className="text-center">
            Join us today and unlock exclusive features tailored just for you!
          </Text>
        </View>

        <View className="w-full flex flex-col gap-4 mb-4">
          <View className="gap-2">
            <Controller
              control={control}
              name="name"
              rules={{
                required: requiredRule("First name"),
                validate: (val) =>
                  isValidMinLength(val, 3) ||
                  "First name must be at least 3 characters",
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

          <View className="gap-2">
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
                  label="Email"
                  placeholder="Email"
                  mode="outlined"
                  className="h-11"
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
                className="h-11"
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
            loading={signUpLoading}
          >
            Continue
          </ButtonWithBorderRadius>
        </View>

        <View className="flex-row items-center justify-center mt-4">
          <Text>Already have an account? </Text>
          <Pressable onPress={() => router.replace("/sign-in")}>
            <Text className="text-primary">Sign in</Text>
          </Pressable>
        </View>
      </View>
    </CustomPage>
  );
}
