import { useState, type RefObject } from "react";
import { TextInput, View } from "react-native";

interface OTPInputProps {
  codes: string[];
  refs: RefObject<TextInput>[];
  errorMessages?: string[];
  onChangeCode: (text: string, index: number) => void;
  config: OTPInputConfig;
  editable?: boolean;
}

interface OTPInputConfig {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  errorColor: string;
  focusColor: string;
}

export function OTPInput({
  codes,
  refs,
  errorMessages,
  onChangeCode,
  config,
  editable = true,
}: OTPInputProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const getInputStyle = (index: number) => {
    const isFocused = focusedIndex === index;
    const hasError = errorMessages !== undefined;

    return {
      backgroundColor: config.backgroundColor,
      color: hasError ? config.errorColor : config.textColor,
      borderColor: hasError
        ? config.errorColor
        : isFocused
          ? config.focusColor
          : config.borderColor,
    };
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        gap: 8,
      }}
    >
      {codes.map((code, index) => (
        <TextInput
          key={index}
          ref={refs[index]}
          style={[
            {
              fontSize: 16,
              height: 48,
              width: 48,
              borderWidth: 2,
              borderRadius: 8,
            },
            getInputStyle(index),
          ]}
          autoComplete="one-time-code"
          keyboardType="default"
          returnKeyType="next"
          textAlign="center"
          maxLength={1}
          editable={editable}
          onChangeText={(text) => onChangeCode(text, index)}
          value={code}
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => setFocusedIndex(null)}
          onKeyPress={({ nativeEvent: { key } }) => {
            if (key === "Backspace" && code === "" && index > 0) {
              onChangeCode("", index - 1);
              refs[index - 1]?.current?.focus();
            }
          }}
        />
      ))}
    </View>
  );
}
