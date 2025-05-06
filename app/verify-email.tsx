import CustomPage from "@/lib/components/Page";
import { TextInput, TouchableOpacity, View } from "react-native";
import { RefObject, useEffect, useRef, useState } from "react";
import { OTPInput } from "@/lib/components/OtpInput";
import { useLocalSearchParams } from "expo-router";
import { useSession } from "@/lib/contexts/auth.context";
import { ActivityIndicator, Text } from "react-native-paper";
import { useThemeColor } from "@/lib/hooks/useThemeColor";

export default function VerifyEmail() {
  const data = useLocalSearchParams();
  const primaryColor = useThemeColor({}, "primary") as string;
  const [codes, setCodes] = useState<string[] | undefined>(Array(6).fill(""));
  const { verifyEmail, authLoading, resendVerificationEmail } = useSession();
  const refs: RefObject<TextInput>[] = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
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
    const newCodes = [...codes!];
    newCodes[index] = text;
    setCodes(newCodes);
    if (text !== "" && index < 5) {
      refs[index + 1]!.current?.focus();
    }
  };

  useEffect(() => {
    if (codes!.join("").length === 6) {
      verifyEmail({ email: data.email as string, otp: codes!.join("") });
    }
  }, [codes]);

  return (
    <CustomPage enableScrollView verticalPadding>
      <View className="relative flex-1 justify-center items-center">
        <Text
          variant="headlineLarge"
          className="font-bold text-center mb-8"
          style={{ color: primaryColor }}
        >
          Verify Email
        </Text>

        <View className="w-[85%] mb-8">
          <Text variant="bodyLarge" className="text-center">
            A six-digit code has been sent to{" "}
            <Text className="font-bold">{data.email}. </Text>
            Please enter it below to verify your account.
          </Text>
        </View>

        <OTPInput
          codes={codes!}
          errorMessages={errorMessages}
          onChangeCode={onChangeCode}
          refs={refs}
          editable={!authLoading}
          config={{
            backgroundColor: "#fff",
            textColor: "#000",
            borderColor: "#000",
            errorColor: "#ff0000",
            focusColor: "#007AFF",
          }}
        />

        <View className="mt-[25px] flex-row">
          <Text>Didn't receive the code? </Text>
          <TouchableOpacity
            onPress={() =>
              resendVerificationEmail({ email: data.email as string })
            }
            disabled={authLoading}
          >
            <Text className="text-primary">Resend</Text>
          </TouchableOpacity>
        </View>

        {authLoading && (
          <View className="mt-[25px]">
            <ActivityIndicator animating size="large" />
          </View>
        )}
      </View>
    </CustomPage>
  );
}
