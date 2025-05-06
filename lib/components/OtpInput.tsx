import { useState, type RefObject } from "react";
import { TextInput, View } from "react-native";

interface OTPInputProps {
  codes: string[];
  refs: RefObject<TextInput>[];
  errorMessages: string[] | undefined;
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

  const handleFocus = (index: number) => setFocusedIndex(index);
  const handleBlur = () => setFocusedIndex(null);

  return (
    <View className="flex-row w-full justify-between">
      {codes.map((code, index) => (
        <TextInput
          key={index}
          autoComplete="one-time-code"
          enterKeyHint="next"
          className="text-[16px] h-12 w-12 rounded-lg text-center border-2"
          style={[
            // base dynamic colors
            {
              backgroundColor: config.backgroundColor,
              color: config.textColor,
              borderColor: config.borderColor,
            },
            // error state
            errorMessages && {
              borderColor: config.errorColor,
              color: config.errorColor,
            },
            // focus state
            focusedIndex === index && { borderColor: config.focusColor },
          ]}
          editable={editable}
          inputMode="numeric"
          onChangeText={(text) => onChangeCode(text, index)}
          value={code}
          onFocus={() => handleFocus(index)}
          onBlur={handleBlur}
          maxLength={index === 0 ? codes.length : 1}
          ref={refs[index]}
          onKeyPress={({ nativeEvent: { key } }) => {
            if (key === "Backspace" && index > 0) {
              onChangeCode("", index - 1);
              refs[index - 1]?.current?.focus();
            }
          }}
        />
      ))}
    </View>
  );
}
