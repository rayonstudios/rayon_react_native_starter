import { useColorScheme } from "react-native";
import { Colors } from "@/lib/constants/Colors";

type ColorKeys = keyof typeof Colors.light & keyof typeof Colors.dark;

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ColorKeys | "elevation.level2"
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    const colorPath = colorName.split(".");
    let color: any = Colors[theme];
    for (const key of colorPath) {
      color = color[key];
    }
    return color;
  }
}

export const useSecondaryBackgroundColor = () => {
  const backgroundColor = useThemeColor({}, "elevation.level2");
  return backgroundColor;
};
