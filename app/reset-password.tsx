import CustomPage from "@/lib/components/Page";
import { TouchableOpacity, View, TextInput as TextInputRN } from "react-native";
import { TextInput } from "react-native-paper";
import { RefObject, useEffect, useRef, useState } from "react";
import { OTPInput } from "@/lib/components/OtpInput";
import { useLocalSearchParams } from "expo-router";
import { useSession } from "@/lib/contexts/auth.context";
import { ActivityIndicator, Text } from "react-native-paper";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { Controller, useForm } from "react-hook-form";
import { requiredRule } from "@/lib/utils/validations";
import { ButtonWithBorderRadius } from "@/lib/components/ButtonWithBorderRadius";
import PasswordField from "@/lib/components/PasswordField";

export default function ResetEmail() {
  const data = useLocalSearchParams();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      email: data?.email,
      otp: "",
      password: "",
    },
  });

  const primaryColor = useThemeColor({}, "primary") as string;
  const [codes, setCodes] = useState<string[]>(Array(6).fill(""));
  const { resetPassword, authLoading, resendVerificationEmail } = useSession();
  const [field, setField] = useState<string>("otp");

  const refs: RefObject<TextInputRN>[] = [
    useRef<TextInputRN>(null),
    useRef<TextInputRN>(null),
    useRef<TextInputRN>(null),
    useRef<TextInputRN>(null),
    useRef<TextInputRN>(null),
    useRef<TextInputRN>(null),
  ];

  const [errorMessages, setErrorMessages] = useState<string[]>();

  const onChangeCode = (text: string, index: number) => {
    if (text.length > 1) {
      setErrorMessages(undefined);
      const newCodes = text.split("");
      setCodes(newCodes);
      refs[5]!.current?.focus();
      return;
    }
    setErrorMessages(undefined);
    const newCodes = [...codes];
    newCodes[index] = text;
    setCodes(newCodes);
    if (text !== "" && index < 5) {
      refs[index + 1]!.current?.focus();
    }
  };

  useEffect(() => {
    if (codes.join("").length === 6) {
      setValue("otp", codes.join(""));
    }
  }, [codes]);

  const onSubmit = (data: any) => {
    resetPassword(data);
  };
  const handleResetPassword = () => {
    if (field === "otp") {
      setField("data");
    }
  };

  return (
    <CustomPage enableScrollView verticalPadding>
      <View className="justify-center items-center mb-[50px]">
        <Text
          variant="headlineLarge"
          className="font-bold text-center mb-8"
          style={{ color: primaryColor }}
        >
          Reset Password
        </Text>

        <View className="w-[85%] mb-8">
          <Text variant="bodyLarge" className="text-center">
            {field === "otp"
              ? "Enter otp to reset your password."
              : "Enter your new password."}
          </Text>
        </View>

        <View className="w-full flex flex-col gap-4 mb-4">
          {field === "otp" ? (
            <View className="flex flex-col gap-1">
              <Controller
                control={control}
                rules={{
                  required: requiredRule("Otp"),
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <OTPInput
                    codes={codes!}
                    errorMessages={errorMessages}
                    onChangeCode={onChangeCode}
                    refs={refs as any}
                    editable={!authLoading}
                    config={{
                      backgroundColor: "#fff",
                      textColor: "#000",
                      borderColor: "#000",
                      errorColor: "#ff0000",
                      focusColor: "#007AFF",
                    }}
                  />
                )}
                name="otp"
              />
              {errors.otp && (
                <Text variant="bodySmall" className="text-red-500">
                  {errors.otp.message}
                </Text>
              )}
            </View>
          ) : (
            <>
              <Controller
                control={control}
                render={() => (
                  <TextInput
                    label="Email"
                    disabled
                    className="h-11"
                    mode="outlined"
                    value={
                      Array.isArray(data?.email) ? data.email[0] : data?.email
                    }
                  />
                )}
                name="email"
              />

              <Controller
                control={control}
                rules={{
                  required: requiredRule("Password"),
                }}
                name="password"
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
            </>
          )}

          {field === "otp" ? (
            <ButtonWithBorderRadius
              mode="contained"
              onPress={handleResetPassword}
            >
              Continue
            </ButtonWithBorderRadius>
          ) : (
            <ButtonWithBorderRadius
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={authLoading}
            >
              Continue
            </ButtonWithBorderRadius>
          )}
        </View>

        {field === "otp" && (
          <>
            <View className="mt-[25px] flex flex-row">
              <Text>Didn't receive the code? </Text>
              <TouchableOpacity
                onPress={() =>
                  resendVerificationEmail({
                    email: data!.email as string,
                  })
                }
                disabled={authLoading}
              >
                <Text style={{ color: primaryColor }}>Resend</Text>
              </TouchableOpacity>
            </View>
            {authLoading && (
              <ActivityIndicator animating className="mt-[25px]" />
            )}
          </>
        )}
      </View>
    </CustomPage>
  );
}
