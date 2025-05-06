import React, { useState } from "react";
import { View } from "react-native";
import { TextInput, Text, TextInputProps } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColor } from "../hooks/useThemeColor";

interface PasswordFieldProps extends TextInputProps {
  errorMessage?: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  errorMessage,
  ...props
}) => {
  const [isPasswordSecure, setIsPasswordSecure] = useState<boolean>(true);
  const iconColor = useThemeColor({}, "inverseSurface") as string;

  return (
    <View className="gap-2">
      <TextInput
        secureTextEntry={isPasswordSecure}
        right={
          <TextInput.Icon
            icon={() => (
              <MaterialCommunityIcons
                name={isPasswordSecure ? "eye-off" : "eye"}
                size={20}
                color={iconColor}
              />
            )}
            onPress={() => setIsPasswordSecure(!isPasswordSecure)}
          />
        }
        className="h-12"
        error={Boolean(errorMessage)}
        {...props}
      />
      {errorMessage && (
        <Text variant="bodySmall" className="text-red-500">
          {errorMessage}
        </Text>
      )}
    </View>
  );
};

export default PasswordField;
