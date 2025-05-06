import React, { ReactNode } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useThemeColor } from "../hooks/useThemeColor";

interface CustomPageProps {
  children: ReactNode;
  horizontalPadding?: boolean;
  verticalPadding?: boolean;
  enableScrollView?: boolean;
  loading?: boolean;
}

const CustomPage: React.FC<CustomPageProps> = ({
  children,
  horizontalPadding = true,
  verticalPadding = false,
  enableScrollView = false,
  loading,
}) => {
  const backgroundColor = useThemeColor({}, "background") as string;

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator animating={true} size={"large"} />
      </View>
    );
  }
  return (
    <View className="flex-1">
      {enableScrollView ? (
        <ScrollView className="flex-1">
          <View
            style={[
              { flex: 1, backgroundColor: backgroundColor },
              horizontalPadding && { paddingHorizontal: 24 },
              verticalPadding && { paddingVertical: 24 },
            ]}
          >
            {children}
          </View>
        </ScrollView>
      ) : (
        <View
          style={[
            { flex: 1, backgroundColor: backgroundColor },
            horizontalPadding && { paddingHorizontal: 24 },
            verticalPadding && { paddingVertical: 24 },
          ]}
        >
          {children}
        </View>
      )}
    </View>
  );
};

export default CustomPage;
