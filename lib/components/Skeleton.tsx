import React from "react";
import SkeletonComponent from "react-native-reanimated-skeleton";
import { ICustomViewStyle } from "react-native-reanimated-skeleton";
import { useThemeColor } from "../hooks/useThemeColor";

type Props = {
  isLoading: boolean;
  children: React.ReactNode;
  layout: ICustomViewStyle[];
};

const Skeleton = (props: Props) => {
  const backgroundColor = useThemeColor({}, "background") as string;
  const inverseOnSurfaceColor = useThemeColor({}, "inverseOnSurface") as string;
  return (
    <SkeletonComponent
      animationDirection="horizontalLeft"
      containerStyle={{
        width: "100%",
      }}
      boneColor={inverseOnSurfaceColor}
      highlightColor={backgroundColor}
      isLoading={props.isLoading}
      layout={props.layout}
    >
      {props.children}
    </SkeletonComponent>
  );
};

export default Skeleton;
