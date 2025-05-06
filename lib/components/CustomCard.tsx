import * as React from "react";
import { Card } from "react-native-paper";
import { useThemeColor } from "../hooks/useThemeColor";
import { useColorScheme } from "react-native";

export default function CustomCard(props: any) {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, "background") as string;
  const inverseOnSurfaceColor = useThemeColor({}, "inverseOnSurface") as string;

  return (
    <Card
      style={{
        backgroundColor:
          colorScheme === "dark" ? inverseOnSurfaceColor : backgroundColor,
        marginHorizontal: 2,
        marginVertical: 1,
      }}
      {...props}
    >
      {props.children}
    </Card>
  );
}
