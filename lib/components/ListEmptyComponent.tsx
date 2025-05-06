import React from "react";
import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "react-native-paper";

type ListEmptyComponentProps = {
  title?: string;
  subtitle?: string;
  iconName?: keyof typeof MaterialIcons.glyphMap;
  iconSize?: number;
  iconColor?: string;
};

const ListEmptyComponent: React.FC<ListEmptyComponentProps> = ({
  title = "No Items Found",
  subtitle = "Please check back later or refresh the page.",
  iconName = "inbox",
  iconSize = 48,
  iconColor = "#bbb",
}) => {
  return (
    <View className="flex-1 items-center justify-center p-5">
      <MaterialIcons name={iconName} size={iconSize} color={iconColor} />
      <Text className="text-[18px] font-semibold text-center mt-[10px]">
        {title}
      </Text>
      {subtitle && (
        <Text className="text-[14px] text-center mt-[5px]">{subtitle}</Text>
      )}
    </View>
  );
};

export default ListEmptyComponent;
